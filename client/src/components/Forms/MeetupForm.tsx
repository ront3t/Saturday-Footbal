import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Calendar, MapPin, Users, Clock, DollarSign } from 'lucide-react';

const meetupSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  dateTime: z.string().refine((date: string | number | Date) => new Date(date) > new Date(), 'Date must be in the future'),
  duration: z.number().min(30, 'Duration must be at least 30 minutes').optional(),
  location: z.object({
    name: z.string().min(1, 'Location name is required'),
    address: z.string().min(1, 'Address is required'),
  }),
  minParticipants: z.number().min(2, 'Minimum 2 participants required'),
  maxParticipants: z.number().min(2, 'Maximum must be at least 2'),
  costPerPerson: z.number().min(0, 'Cost cannot be negative').optional(),
});

type MeetupFormData = z.infer<typeof meetupSchema>;

interface MeetupFormProps {
  onSubmit: (data: MeetupFormData) => void;
  loading?: boolean;
  initialData?: Partial<MeetupFormData>;
}

export const MeetupForm: React.FC<MeetupFormProps> = ({
  onSubmit,
  loading = false,
  initialData
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MeetupFormData>({
    resolver: zodResolver(meetupSchema),
    defaultValues: initialData,
  });

  const minParticipants = watch('minParticipants');

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Edit Meetup' : 'Create New Meetup'}
        </h2>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Meetup Title"
                {...register('title')}
                error={errors.title?.message}
                placeholder="Sunday Morning Football"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your meetup..."
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>
            
            <Input
              label="Date & Time"
              type="datetime-local"
              {...register('dateTime')}
              error={errors.dateTime?.message}
              leftIcon={<Calendar className="w-4 h-4" />}
            />
            
            <Input
              label="Duration (minutes)"
              type="number"
              {...register('duration', { valueAsNumber: true })}
              error={errors.duration?.message}
              leftIcon={<Clock className="w-4 h-4" />}
              placeholder="90"
            />
            
            <Input
              label="Location Name"
              {...register('location.name')}
              error={errors.location?.name?.message}
              leftIcon={<MapPin className="w-4 h-4" />}
              placeholder="Central Park Field 1"
            />
            
            <Input
              label="Address"
              {...register('location.address')}
              error={errors.location?.address?.message}
              placeholder="123 Park Ave, New York, NY"
            />
            
            <Input
              label="Min Participants"
              type="number"
              {...register('minParticipants', { valueAsNumber: true })}
              error={errors.minParticipants?.message}
              leftIcon={<Users className="w-4 h-4" />}
              min={2}
            />
            
            <Input
              label="Max Participants"
              type="number"
              {...register('maxParticipants', { valueAsNumber: true })}
              error={errors.maxParticipants?.message}
              min={minParticipants || 2}
            />
            
            <Input
              label="Cost per Person ($)"
              type="number"
              step="0.01"
              {...register('costPerPerson', { valueAsNumber: true })}
              error={errors.costPerPerson?.message}
              leftIcon={<DollarSign className="w-4 h-4" />}
              placeholder="0.00"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              {initialData ? 'Update Meetup' : 'Create Meetup'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
