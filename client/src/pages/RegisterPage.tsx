import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../Context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { AvatarSelector } from '../components/common/AvatarSelector';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  profile: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().refine(date => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 16 && age <= 100;
    }, 'You must be between 16 and 100 years old'),
    location: z.string().min(1, 'Location is required'),
    preferredPositions: z.array(z.string()).min(1, 'At least one position is required'),
    skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Any'];
const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-1.png');
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError('');
      
      const userData = {
        ...data,
        profile: {
          ...data.profile,
          profileImage: {
            type: 'avatar' as const,
            value: selectedAvatar,
          },
          preferredPositions: selectedPositions,
        },
      };

      await registerUser(userData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePositionChange = (position: string) => {
    const newPositions = selectedPositions.includes(position)
      ? selectedPositions.filter(p => p !== position)
      : [...selectedPositions, position];
    
    setSelectedPositions(newPositions);
    setValue('profile.preferredPositions', newPositions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚽</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Join Soccer Meetup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and start playing
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Account Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Email"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      leftIcon={<Mail className="w-4 h-4" />}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Password"
                      type="password"
                      {...register('password')}
                      error={errors.password?.message}
                      leftIcon={<Lock className="w-4 h-4" />}
                      placeholder="Create a password"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                
                {/* Avatar Selection */}
                <div className="mb-6">
                  <AvatarSelector
                    selectedAvatar={selectedAvatar}
                    onAvatarSelect={setSelectedAvatar}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    {...register('profile.firstName')}
                    error={errors.profile?.firstName?.message}
                    leftIcon={<User className="w-4 h-4" />}
                    placeholder="John"
                  />
                  <Input
                    label="Last Name"
                    {...register('profile.lastName')}
                    error={errors.profile?.lastName?.message}
                    leftIcon={<User className="w-4 h-4" />}
                    placeholder="Doe"
                  />
                  <Input
                    label="Phone Number (Optional)"
                    type="tel"
                    {...register('profile.phoneNumber')}
                    error={errors.profile?.phoneNumber?.message}
                    leftIcon={<Phone className="w-4 h-4" />}
                    placeholder="+1 (555) 123-4567"
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    {...register('profile.dateOfBirth')}
                    error={errors.profile?.dateOfBirth?.message}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  />
                  <Input
                    label="Location"
                    {...register('profile.location')}
                    error={errors.profile?.location?.message}
                    leftIcon={<MapPin className="w-4 h-4" />}
                    placeholder="New York, NY"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Level
                    </label>
                    <select
                      {...register('profile.skillLevel')}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select skill level</option>
                      {skillLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                    {errors.profile?.skillLevel && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.profile.skillLevel.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Preferred Positions */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Positions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {positions.map((position) => (
                      <label
                        key={position}
                        className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPositions.includes(position)}
                          onChange={() => handlePositionChange(position)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{position}</span>
                      </label>
                    ))}
                  </div>
                  {errors.profile?.preferredPositions && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.profile.preferredPositions.message}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio (Optional)
                  </label>
                  <textarea
                    {...register('profile.bio')}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                  {errors.profile?.bio && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.profile.bio.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
