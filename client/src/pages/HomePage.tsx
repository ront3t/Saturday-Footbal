import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { 
  Users, 
  Calendar, 
  Trophy, 
  MapPin,
  ArrowRight,
  Check
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      title: 'Organize Meetups',
      description: 'Create and manage soccer meetups with your friends and local community.',
      icon: Calendar,
    },
    {
      title: 'Join Groups',
      description: 'Connect with like-minded players and join existing soccer groups.',
      icon: Users,
    },
    {
      title: 'Track Stats',
      description: 'Keep track of your games, goals, assists, and performance statistics.',
      icon: Trophy,
    },
    {
      title: 'Find Locations',
      description: 'Discover soccer fields and venues near you with integrated maps.',
      icon: MapPin,
    },
  ];

  const benefits = [
    'Connect with local soccer players',
    'Organize games with ease',
    'Track your performance',
    'Discover new venues',
    'Build lasting friendships',
    'Improve your skills',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Connect. Play.{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Excel.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join the ultimate platform for soccer enthusiasts. Organize meetups, 
              track your performance, and connect with players in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Play Soccer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From organizing meetups to tracking your progress, we've got everything 
              covered for the modern soccer enthusiast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Choose Soccer Meetup?
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Join thousands of soccer players who have already discovered the 
                best way to organize and enjoy their favorite sport.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-blue-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                  <div className="text-gray-600 mb-4">Active Players</div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600 mb-4">Meetups Organized</div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">Cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Level Up Your Soccer Game?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community today and start organizing amazing soccer meetups 
            with players in your area.
          </p>
          <Link to="/register">
            <Button size="lg">
              Start Playing Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
