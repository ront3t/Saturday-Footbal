import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Plus, Clock, MapPin } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

import { fetchUserGroups } from '../store/slices/groupSlice';
import { fetchUserMeetups } from '../store/slices/meetupSlice';

import PageHeader from '../components/layout/PageHeader';
import Container from '../components/layout/Container';
import EmptyState from '../components/layout/EmptyState';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { groups, loading: groupsLoading } = useAppSelector(state => state.groups);
  const { meetups, loading: meetupsLoading } = useAppSelector(state => state.meetups);

  const [dataFetched, setDataFetched] = React.useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!dataFetched && user) {
        try {
          await Promise.all([
            dispatch(fetchUserGroups()),
            dispatch(fetchUserMeetups({ upcoming: true }))
          ]);
          setDataFetched(true);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      }
    };

    fetchDashboardData();
  }, [dispatch, user, dataFetched]);

  const upcomingMeetups = meetups
    .filter(meetup => new Date(meetup.dateTime) > new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 3);

  const recentGroups = groups.slice(0, 3);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info'> = {
      published: 'success',
      full: 'warning',
      draft: 'info'
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

  if (groupsLoading || meetupsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title={`Welcome back, ${user?.profile.firstName}!`}
        subtitle="Here's what's happening with your soccer activities"
      />

      <Container className="py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{groups.length}</p>
                <p className="text-slate-400">Groups Joined</p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{upcomingMeetups.length}</p>
                <p className="text-slate-400">Upcoming Meetups</p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{meetups.length}</p>
                <p className="text-slate-400">Total Meetups</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Meetups */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Upcoming Meetups</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/meetups')}
              >
                View All
              </Button>
            </div>

            {upcomingMeetups.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetups.map((meetup) => (
                  <div
                    key={meetup._id}
                    className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/meetups/${meetup._id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white">{meetup.title}</h4>
                      <Badge variant={getStatusBadge(meetup.status)} size="sm">
                        {meetup.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-slate-300 text-sm space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(meetup.dateTime)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {meetup.location.name}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-slate-400 text-sm">
                        {meetup.participants.confirmed.length}/{meetup.maxParticipants} players
                      </span>
                      <div className="w-24 bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(meetup.participants.confirmed.length / meetup.maxParticipants) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No upcoming meetups"
                description="You don't have any upcoming meetups. Create or join one to get started!"
                action={{
                  label: 'Browse Meetups',
                  onClick: () => navigate('/meetups')
                }}
              />
            )}
          </Card>

          {/* Your Groups */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Your Groups</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/groups')}
              >
                View All
              </Button>
            </div>

            {recentGroups.length > 0 ? (
              <div className="space-y-4">
                {recentGroups.map((group) => (
                  <div
                    key={group._id}
                    className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/groups/${group._id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white">{group.name}</h4>
                      <Badge variant="secondary" size="sm">
                        {group.privacy}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                      {group.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-400 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {group.members.length} members
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {group.location.city}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No groups yet"
                description="Join or create a group to start organizing soccer meetups with friends!"
                action={{
                  label: 'Explore Groups',
                  onClick: () => navigate('/groups')
                }}
              />
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate('/meetups/create')}
              variant="outline"
              className="justify-start h-16"
            >
              <Plus className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Create Meetup</div>
                <div className="text-sm opacity-70">Organize a new game</div>
              </div>
            </Button>
            
            <Button
              onClick={() => navigate('/groups')}
              variant="outline"
              className="justify-start h-16"
            >
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Join Group</div>
                <div className="text-sm opacity-70">Find soccer communities</div>
              </div>
            </Button>
            
            <Button
              onClick={() => navigate('/stats')}
              variant="outline"
              className="justify-start h-16"
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">View Stats</div>
                <div className="text-sm opacity-70">Check your performance</div>
              </div>
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;
