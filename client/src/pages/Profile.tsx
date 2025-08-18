import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Calendar, Edit3, Save, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateProfile } from '../store/slices/authSlice';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import AvatarSelector from '../components/profile/AvatarSelector';
import toast from 'react-hot-toast';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  location: string;
  preferredPositions: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  bio?: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileFormData>();

  React.useEffect(() => {
    if (user) {
      reset({
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        phoneNumber: user.profile.phoneNumber || '',
        location: user.profile.location,
        preferredPositions: user.profile.preferredPositions,
        skillLevel: user.profile.skillLevel,
        bio: user.profile.bio || ''
      });
      setSelectedAvatar(user.profile.profileImage.value);
    }
  }, [user, reset]);

  const skillLevelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const positionOptions = [
    { value: 'Goalkeeper', label: 'Goalkeeper' },
    { value: 'Defender', label: 'Defender' },
    { value: 'Midfielder', label: 'Midfielder' },
    { value: 'Forward', label: 'Forward' },
    { value: 'Any', label: 'Any Position' }
  ];

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await dispatch(updateProfile({
        ...data,
        profileImage: {
          type: 'avatar' as const,
          value: selectedAvatar
        }
      })).unwrap();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      reset({
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        phoneNumber: user.profile.phoneNumber || '',
        location: user.profile.location,
        preferredPositions: user.profile.preferredPositions,
        skillLevel: user.profile.skillLevel,
        bio: user.profile.bio || ''
      });
      setSelectedAvatar(user.profile.profileImage.value);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Profile"
        subtitle="Manage your personal information and preferences"
        action={{
          label: isEditing ? 'Cancel' : 'Edit Profile',
          onClick: isEditing ? handleCancel : () => setIsEditing(true),
          icon: isEditing ? X : Edit3
        }}
      />

      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture & Basic Info */}
              <div className="lg:col-span-1">
                <Card>
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-4xl">
                        {user.profile.profileImage.type === 'avatar' ? (
                          <span className="text-white font-bold">
                            {user.profile.firstName.charAt(0)}{user.profile.lastName.charAt(0)}
                          </span>
                        ) : (
                          <img 
                            src={user.profile.profileImage.value} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-full object-cover"
                          />
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-200 mb-3">
                          Choose Avatar
                        </label>
                        <AvatarSelector
                          selectedAvatar={selectedAvatar}
                          onSelect={setSelectedAvatar}
                        />
                      </div>
                    )}

                    <h2 className="text-xl font-semibold text-white mb-1">
                      {user.profile.firstName} {user.profile.lastName}
                    </h2>
                    <p className="text-slate-400 mb-4">{user.email}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-center text-slate-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        {user.profile.location}
                      </div>
                      <div className="flex items-center justify-center text-slate-300">
                        <Calendar className="w-4 h-4 mr-2" />
                        Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </div>
                    </div>

                    <div className="mt-6">
                      <Badge variant="info" className="text-center">
                        {user.profile.skillLevel}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                <Card>
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      {...register('firstName', { required: 'First name is required' })}
                      label="First Name"
                      disabled={!isEditing}
                      error={errors.firstName?.message}
                    />

                    <Input
                      {...register('lastName', { required: 'Last name is required' })}
                      label="Last Name"
                      disabled={!isEditing}
                      error={errors.lastName?.message}
                    />

                    <Input
                      value={user.email}
                      label="Email"
                      disabled
                      className="bg-slate-700/50"
                    />

                    <Input
                      {...register('phoneNumber')}
                      label="Phone Number"
                      disabled={!isEditing}
                      error={errors.phoneNumber?.message}
                    />

                    <Input
                      {...register('location', { required: 'Location is required' })}
                      label="Location"
                      disabled={!isEditing}
                      error={errors.location?.message}
                    />

                    <Select
                      {...register('skillLevel', { required: 'Skill level is required' })}
                      label="Skill Level"
                      options={skillLevelOptions}
                      disabled={!isEditing}
                      error={errors.skillLevel?.message}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-200 mb-3">
                      Preferred Positions
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {positionOptions.map((position) => (
                        <label
                          key={position.value}
                          className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                            isEditing 
                              ? 'border-slate-600 hover:border-slate-500 cursor-pointer' 
                              : 'border-slate-700/50 cursor-default'
                          }`}
                        >
                          <input
                            {...register('preferredPositions')}
                            type="checkbox"
                            value={position.value}
                            disabled={!isEditing}
                            className="rounded text-blue-600 focus:ring-blue-500 bg-slate-700 border-slate-600 disabled:opacity-50"
                          />
                          <span className="text-slate-300 text-sm">
                            {position.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-200 mb-3">
                      Bio
                    </label>
                    <textarea
                      {...register('bio', {
                        maxLength: {
                          value: 500,
                          message: 'Bio cannot exceed 500 characters'
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      rows={4}
                      placeholder="Tell us about yourself..."
                      disabled={!isEditing}
                    />
                    {errors.bio && (
                      <p className="text-sm text-red-400 mt-1">{errors.bio.message}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-700">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        loading={loading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Profile;