import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../Context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError('');
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚽</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your Soccer Meetup account
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

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                leftIcon={<Mail className="w-4 h-4" />}
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                leftIcon={<Lock className="w-4 h-4" />}
                placeholder="Enter your password"
              />

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
