import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Users, Plus, MapPin, Search } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUserGroups } from '../store/slices/groupSlice';

import PageHeader from '../components/layout/PageHeader';
import Container from '../components/layout/Container';
import EmptyState from '../components/layout/EmptyState';

import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';

import CreateGroupForm from '../components/CreateGroupForm';

const Groups: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { groups, loading } = useAppSelector(state => state.groups);

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrivacy = privacyFilter === 'all' || group.privacy === privacyFilter;
    return matchesSearch && matchesPrivacy;
  });

  const privacyOptions = [
    { value: 'all', label: 'All Privacy Levels' },
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'invite-only', label: 'Invite Only' }
  ];

  const getPrivacyBadgeVariant = (privacy: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info'> = {
      public: 'success',
      private: 'warning',
      'invite-only': 'info'
    };
    return variants[privacy] || 'info';
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
        title="Soccer Groups"
        subtitle="Manage your groups and discover new soccer communities"
        action={{
          label: 'Create Group',
          onClick: () => setIsCreateModalOpen(true),
          icon: Plus
        }}
      >
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={privacyFilter}
              onChange={(e) => setPrivacyFilter(e.target.value)}
              options={privacyOptions}
            />
          </div>
        </div>
      </PageHeader>

      <Container className="py-8">
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div
                key={group._id}
                className="cursor-pointer"
                onClick={() => navigate(`/groups/${group._id}`)}
                role="button"
              >
                <Card hover>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant={getPrivacyBadgeVariant(group.privacy)} size="sm">
                      {group.privacy}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {group.name}
                  </h3>

                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                    {group.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-slate-400 text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      {group.members.length} members
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {group.location.city}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 text-xs">Managers:</span>
                      <div className="flex -space-x-2">
                        {group.managers.slice(0, 3).map((manager, index) => (
                          <div
                            key={manager._id}
                            className="w-6 h-6 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center border-2 border-slate-800 text-xs text-white"
                          >
                            {manager.profile?.firstName?.charAt(0)}
                          </div>
                        ))}
                        {group.managers.length > 3 && (
                          <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center border-2 border-slate-800 text-xs text-white">
                            +{group.managers.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title={searchTerm || privacyFilter !== 'all' ? 'No groups found' : 'No groups yet'}
            description={
              searchTerm || privacyFilter !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Create your first group to start organizing soccer meetups!'
            }
            action={{
              label: 'Create Group',
              onClick: () => setIsCreateModalOpen(true)
            }}
          />
        )}
      </Container>
      {/* Create Group Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Group"
        size="lg"
      >
        <CreateGroupForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            dispatch(fetchUserGroups());
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Groups;
