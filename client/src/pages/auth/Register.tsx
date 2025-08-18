import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Eye, EyeOff, Calendar, MapPin } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { register as registerUser, clearError } from '../../store/slices/authSlice';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import AvatarSelector from '../../components/profile/AvatarSelector';

import toast from 'react-hot-toast';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  location: string;
  preferredPositions: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('default-avatar.png');
  const [step, setStep] = useState(1);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<RegisterFormData>({
    defaultValues: {
      preferredPositions: []
    }
  });

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

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

  const handleNext = async () => {
    const fieldsToValidate = step === 1 
      ? ['email', 'password', 'confirmPassword']
      : ['firstName', 'lastName', 'dateOfBirth', 'location', 'skillLevel'];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registrationData } = data;
    
    const userData = {
      ...registrationData,
      profile: {
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        dateOfBirth: registrationData.dateOfBirth,
        location: registrationData.location,
        preferredPositions: registrationData.preferredPositions,
        skillLevel: registrationData.skillLevel,
        profileImage: {
          type: 'avatar' as const,
          value: selectedAvatar
        }
      }
    };

    await dispatch(registerUser(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Card className="backdrop-blur-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">SM</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-300">Join the soccer community</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step >= num ? 'bg-blue-500' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    error={errors.email?.message}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password"
                    className="pl-10 pr-10"
                    error={errors.password?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value =>
                        value === password || 'Passwords do not match'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    className="pl-10 pr-10"
                    error={errors.confirmPassword?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <Button 
                  type="button"
                  onClick={handleNext}
                  fullWidth 
                  size="lg"
                  className="mt-6"
                >
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      {...register('firstName', {
                        required: 'First name is required'
                      })}
                      placeholder="First name"
                      className="pl-10"
                      error={errors.firstName?.message}
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      {...register('lastName', {
                        required: 'Last name is required'
                      })}
                      placeholder="Last name"
                      className="pl-10"
                      error={errors.lastName?.message}
                    />
                  </div>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    {...register('dateOfBirth', {
                      required: 'Date of birth is required'
                    })}
                    type="date"
                    className="pl-10"
                    error={errors.dateOfBirth?.message}
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    {...register('location', {
                      required: 'Location is required'
                    })}
                    placeholder="City, Country"
                    className="pl-10"
                    error={errors.location?.message}
                  />
                </div>

                <Select
                  {...register('skillLevel', {
                    required: 'Skill level is required'
                  })}
                  label="Skill Level"
                  options={skillLevelOptions}
                  error={errors.skillLevel?.message}
                />

                <div className="flex space-x-2">
                  <Button 
                    type="button"
                    onClick={handleBack}
                    variant="ghost"
                    fullWidth
                  >
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleNext}
                    fullWidth 
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-3">
                    Choose Avatar
                  </label>
                  <AvatarSelector
                    selectedAvatar={selectedAvatar}
                    onSelect={setSelectedAvatar}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-3">
                    Preferred Positions (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {positionOptions.map((position) => (
                      <label
                        key={position.value}
                        className="flex items-center space-x-2 p-2 rounded-lg border border-slate-600 hover:border-slate-500 cursor-pointer transition-colors"
                      >
                        <input
                          {...register('preferredPositions')}
                          type="checkbox"
                          value={position.value}
                          className="rounded text-blue-600 focus:ring-blue-500 bg-slate-700 border-slate-600"
                        />
                        <span className="text-slate-300 text-sm">
                          {position.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    type="button"
                    onClick={handleBack}
                    variant="ghost"
                    fullWidth
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    loading={loading}
                    fullWidth 
                  >
                    Create Account
                  </Button>
                </div>
              </>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-center text-slate-300">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;