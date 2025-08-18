import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Search, Clock, MapPin, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUserMeetups } from '../store/slices/meetupSlice';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/layout/EmptyState';

const Meetups: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { meetups, loading } = useAppSelector(state => state.meetups);

  useEffect(() => {
    dispatch(fetchUserMeetups());
  }, [dispatch]);

  const filteredMeetups = meetups.filter(meetup => {
    const matchesSearch = meetup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meetup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meetup.status === statusFilter;
    
    let matchesTime = true;
    const now = new Date();
    const meetupDate = new Date(meetup.dateTime);
    
    if (timeFilter === 'upcoming') {
      matchesTime = meetupDate > now;
    } else if (timeFilter === 'past') {
      matchesTime = meetupDate < now;
    }
    
    return matchesSearch && matchesStatus && matchesTime;
  });

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'full', label: 'Full' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const timeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' }
  ];

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
      published: 'success',
      full: 'warning',
      draft: 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return variants[status] || 'info';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Soccer Meetups"
        subtitle="Manage and participate in soccer meetups"
        action={{
          label: 'Create Meetup',
          onClick: () => navigate('/meetups/create'),
          icon: Plus
        }}
      >
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search meetups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              options={timeOptions}
            />
          </div>
        </div>
      </PageHeader>

      <Container className="py-8">
        {filteredMeetups.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMeetups.map((meetup) => (
              <div
                key={meetup._id}
                className="cursor-pointer"
                onClick={() => navigate(`/meetups/${meetup._id}`)}
                role = "button"
              >
                <Card hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {meetup.title}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {meetup.group?.name}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(meetup.status)} size="sm">
                    {meetup.status}
                  </Badge>
                </div>

                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {meetup.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-slate-300 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className={isUpcoming(meetup.dateTime) ? 'text-green-400' : 'text-slate-400'}>
                      {formatDate(meetup.dateTime)}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-300 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {meetup.location.name}
                  </div>
                  <div className="flex items-center text-slate-300 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {meetup.participants.confirmed.length}/{meetup.maxParticipants} players
                    {meetup.participants.waitlist.length > 0 && (
                      <span className="text-yellow-400 ml-1">
                        (+{meetup.participants.waitlist.length} waiting)
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        meetup.participants.confirmed.length >= meetup.maxParticipants
                          ? 'bg-red-500'
                          : meetup.participants.confirmed.length >= meetup.minParticipants
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{
                        width: `${Math.min((meetup.participants.confirmed.length / meetup.maxParticipants) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Min: {meetup.minParticipants}</span>
                    <span>Max: {meetup.maxParticipants}</span>
                  </div>
                </div>

                {/* Cost and Additional Info */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="text-slate-400 text-sm">
                    {meetup.costPerPerson ? (
                      <span>Cost: ${meetup.costPerPerson}/person</span>
                    ) : (
                      <span>Free</span>
                    )}
                  </div>
                  <div className="text-slate-400 text-sm">
                    Created by {meetup.createdBy?.profile?.firstName}
                  </div>
                </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title={searchTerm || statusFilter !== 'all' || timeFilter !== 'all' ? 'No meetups found' : 'No meetups yet'}
            description={
              searchTerm || statusFilter !== 'all' || timeFilter !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Create your first meetup to start organizing soccer games!'
            }
            action={{
              label: 'Create Meetup',
              onClick: () => navigate('/meetups/create')
            }}
          />
        )}
      </Container>
    </div>
  );
};

export default Meetups;