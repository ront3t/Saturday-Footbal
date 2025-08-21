import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Calendar as CalendarIcon, Users, DollarSign } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createMeetup } from '../store/slices/meetupSlice';
import { fetchUserGroups } from '../store/slices/groupSlice';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import toast from 'react-hot-toast';
import LocationPicker from '../components/LocationPicker';

interface CreateMeetupFormData {
  title: string;
  description: string;
  group: string;
  dateTime: string;
  duration?: number;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  minParticipants: number;
  maxParticipants: number;
  costPerPerson?: number;
}

const CreateMeetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { groups, loading: groupsLoading } = useAppSelector(state => state.groups);
  const { loading: meetupLoading } = useAppSelector(state => state.meetups);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors }
  } = useForm<CreateMeetupFormData>();

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);

  const groupOptions = groups.map(group => ({
    value: group._id,
    label: group.name
  }));

  const handleNext = async () => {
    const fieldsToValidate = step === 1 
      ? ['title', 'description', 'group']
      : step === 2 
      ? ['dateTime', 'duration', 'minParticipants', 'maxParticipants']
      : [];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (step === 3 && !selectedLocation) {
      toast.error('Please select a location');
      return;
    }
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: CreateMeetupFormData) => {
    if (!selectedLocation) {
      toast.error('Please select a location');
      return;
    }

    try {
      const meetupData = {
        ...data,
        location: selectedLocation,
        duration: data.duration || undefined,
        costPerPerson: data.costPerPerson || undefined
      };

      await dispatch(createMeetup(meetupData)).unwrap();
      toast.success('Meetup created successfully!');
      navigate('/meetups');
    } catch (error: any) {
      toast.error(error || 'Failed to create meetup');
    }
  };

  const minDate = new Date();
  minDate.setHours(minDate.getHours() + 1);
  const minDateTime = minDate.toISOString().slice(0, 16);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Create Meetup"
        subtitle="Organize a new soccer meetup for your group"
        action={{
          label: 'Back to Meetups',
          onClick: () => navigate('/meetups'),
          icon: ArrowLeft
        }}
      />

      <Container className="py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= num 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-colors ${
                      step > num ? 'bg-blue-500' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Basic Information
                    </h3>
                    <p className="text-slate-400">
                      Let's start with the basic details of your meetup
                    </p>
                  </div>

                  <Input
                    {...register('title', {
                      required: 'Meetup title is required',
                      maxLength: {
                        value: 200,
                        message: 'Title cannot exceed 200 characters'
                      }
                    })}
                    label="Meetup Title"
                    placeholder="e.g., Friday Evening Football"
                    error={errors.title?.message}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description', {
                        required: 'Description is required',
                        maxLength: {
                          value: 1000,
                          message: 'Description cannot exceed 1000 characters'
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      rows={4}
                      placeholder="Describe your meetup..."
                    />
                    {errors.description && (
                      <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <Select
                    {...register('group', { required: 'Please select a group' })}
                    label="group"
                    options={[...groupOptions]}
                    error={errors.group?.message}
                    disabled={groupsLoading}
                  />

                  <div className="flex justify-end">
                    <Button type="button" onClick={handleNext}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Schedule & Capacity
                    </h3>
                    <p className="text-slate-400">
                      Set the time and participant limits
                    </p>
                  </div>

                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      {...register('dateTime', {
                        required: 'Date and time is required',
                        validate: value => {
                          const selected = new Date(value);
                          const now = new Date();
                          return selected > now || 'Meetup must be in the future';
                        }
                      })}
                      type="datetime-local"
                      label="Date & Time"
                      min={minDateTime}
                      className="pl-10"
                      error={errors.dateTime?.message}
                    />
                  </div>

                  <Input
                    {...register('duration', {
                      valueAsNumber: true,
                      min: { value: 30, message: 'Duration must be at least 30 minutes' },
                      max: { value: 480, message: 'Duration cannot exceed 8 hours' }
                    })}
                    type="number"
                    label="Duration (minutes, optional)"
                    placeholder="e.g., 90"
                    error={errors.duration?.message}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Users className="absolute left-3 top-9 w-5 h-5 text-slate-400" />
                      <Input
                        {...register('minParticipants', {
                          required: 'Minimum participants is required',
                          min: { value: 2, message: 'Minimum must be at least 2' },
                          valueAsNumber: true
                        })}
                        type="number"
                        label="Min Players"
                        placeholder="e.g., 10"
                        className="pl-10"
                        error={errors.minParticipants?.message}
                      />
                    </div>

                    <div className="relative">
                      <Users className="absolute left-3 top-9 w-5 h-5 text-slate-400" />
                      <Input
                        {...register('maxParticipants', {
                          required: 'Maximum participants is required',
                          min: { value: 2, message: 'Maximum must be at least 2' },
                          validate: value => {
                            const minValue = watch('minParticipants') || 0;
                            return value >= minValue || 'Maximum must be greater than or equal to minimum';
                          },
                          valueAsNumber: true
                        })}
                        type="number"
                        label="Max Players"
                        placeholder="e.g., 22"
                        className="pl-10"
                        error={errors.maxParticipants?.message}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button type="button" variant="ghost" onClick={handleBack} fullWidth>
                      Back
                    </Button>
                    <Button type="button" onClick={handleNext} fullWidth>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Location
                    </h3>
                    <p className="text-slate-400">
                      Choose where the meetup will take place
                    </p>
                  </div>

                  <LocationPicker
                    onLocationSelect={setSelectedLocation}
                    selectedLocation={selectedLocation}
                  />

                  <div className="flex space-x-3">
                    <Button type="button" variant="ghost" onClick={handleBack} fullWidth>
                      Back
                    </Button>
                    <Button type="button" onClick={handleNext} fullWidth>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Final Details
                    </h3>
                    <p className="text-slate-400">
                      Add any additional information
                    </p>
                  </div>

                  <div className="relative">
                    <DollarSign className="absolute left-3 top-9 w-5 h-5 text-slate-400" />
                    <Input
                      {...register('costPerPerson', {
                        min: { value: 0, message: 'Cost cannot be negative' },
                        valueAsNumber: true
                      })}
                      type="number"
                      step="0.01"
                      label="Cost per Person (optional)"
                      placeholder="0.00"
                      className="pl-10"
                      error={errors.costPerPerson?.message}
                      helperText="Leave empty if the meetup is free"
                    />
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <h4 className="font-medium text-white mb-3">Meetup Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Title:</span>
                        <span className="text-white">{watch('title') || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Group:</span>
                        <span className="text-white">
                          {groups.find(g => g._id === watch('group'))?.name || 'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date & Time:</span>
                        <span className="text-white">
                          {watch('dateTime') ? new Date(watch('dateTime')).toLocaleString() : 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Participants:</span>
                        <span className="text-white">
                          {watch('minParticipants') || 0} - {watch('maxParticipants') || 0} players
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-white">
                          {selectedLocation?.name || 'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cost:</span>
                        <span className="text-white">
                          {watch('costPerPerson') ? `${watch('costPerPerson')}/person` : 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button type="button" variant="ghost" onClick={handleBack} fullWidth>
                      Back
                    </Button>
                    <Button type="submit" loading={meetupLoading} fullWidth>
                      Create Meetup
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default CreateMeetup;
