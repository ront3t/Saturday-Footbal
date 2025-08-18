import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, Settings, Calendar, BarChart3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchGroupById } from '../store/slices/groupSlice';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentGroup: group, loading } = useAppSelector(state => state.groups);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupById(id));
    }
  }, [dispatch, id]);

  const isManager = group?.managers?.some((manager: any) => manager._id === user?._id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Group not found</h2>
          <Button onClick={() => navigate('/groups')}>
            Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title={group.name}
        subtitle={group.description}
        action={{
          label: 'Back to Groups',
          onClick: () => navigate('/groups'),
          icon: ArrowLeft
        }}
      >
        <div className="flex items-center space-x-4">
          <Badge variant="info">{group.privacy}</Badge>
          {isManager && (
            <Button size="sm" variant="ghost">
              <Settings className="w-4 h-4 mr-1" />
              Manage
            </Button>
          )}
        </div>
      </PageHeader>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Group Info */}
            <Card>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{group.name}</h2>
                  <div className="flex items-center space-x-4 text-slate-400">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {group.members.length} members
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {group.location.city}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-6">
                {group.description}
              </p>

              {group.rules && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Group Rules</h3>
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <p className="text-slate-300 whitespace-pre-wrap">{group.rules}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Recent Meetups */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Meetups</h3>
                <Button size="sm" variant="ghost">
                  <Calendar className="w-4 h-4 mr-1" />
                  View All
                </Button>
              </div>
              
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300">No recent meetups</p>
                <p className="text-slate-400 text-sm">Create a meetup to get started!</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button fullWidth onClick={() => navigate('/meetups/create')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Meetup
                </Button>
                <Button variant="outline" fullWidth>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Stats
                </Button>
              </div>
            </Card>

            {/* Managers */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                Managers ({group.managers.length})
              </h3>
              <div className="space-y-3">
                {group.managers.map((manager: any) => (
                  <div key={manager._id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {manager.profile?.firstName?.charAt(0)}{manager.profile?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Manager</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* All Members */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                All Members ({group.members.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {group.members.map((member: any) => (
                  <div key={member._id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {member.profile?.firstName?.charAt(0)}{member.profile?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {member.profile?.firstName} {member.profile?.lastName}
                      </p>
                      <p className="text-slate-400 text-xs">{member.profile?.skillLevel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default GroupDetail;