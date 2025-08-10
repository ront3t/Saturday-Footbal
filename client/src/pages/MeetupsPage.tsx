import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { MeetupCard } from '../components/Meetups/MeetupCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  Plus, 
  Search, 
  Calendar, 
} from 'lucide-react';
import { Meetup } from '@/types';

export const MeetupsPage: React.FC = () => {
  const { user } = useAuth();
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'full' | 'completed'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  // Filter meetups
  const filteredMeetups = meetups.filter(meetup => {
    const matchesSearch = meetup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meetup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meetup.location.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || meetup.status === statusFilter;
    
    const now = new Date();
    const meetupDate = new Date(meetup.dateTime);
    const matchesTime = timeFilter === 'all' || 
                       (timeFilter === 'upcoming' && meetupDate > now) ||
                       (timeFilter === 'past' && meetupDate < now);
    
    return matchesSearch && matchesStatus && matchesTime;
  });

  const handleRegister = async (meetupId: string) => {
    // TODO: Implement API call
    console.log('Registering for meetup:', meetupId);
  };

  const handleCancel = async (meetupId: string) => {
    // TODO: Implement API call
    console.log('Cancelling registration for meetup:', meetupId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Soccer Meetups</h1>
            <p className="text-gray-600 mt-2">
              Discover and join soccer meetups in your area
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/meetups/create">
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Meetup
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2">
            <Input
              placeholder="Search meetups by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="full">Full</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        {/* Meetups Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetups.map((meetup) => (
              <MeetupCard
                key={meetup._id}
                meetup={meetup}
                onRegister={handleRegister}
                onCancel={handleCancel}
                currentUserId={user?._id}
              />
            ))}
          </div>
        )}

        {filteredMeetups.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meetups found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || timeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a meetup!'
              }
            </p>
            <Link to="/meetups/create">
              <Button>Create New Meetup</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};