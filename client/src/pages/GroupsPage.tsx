import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useGroups } from '../hooks/useGroups';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  Plus, 
  Search, 
  Users, 
  MapPin, 
  Globe,
  Lock,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { groupService } from '../services/groupService';

export const GroupsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrivacy, setFilterPrivacy] = useState<'all' | 'public' | 'private' | 'invite-only'>('all');
  const [joiningGroup, setJoiningGroup] = useState<string | null>(null);

  // Use the custom hook with filters
  const { groups, loading, error, refetch } = useGroups({
    search: searchTerm,
    privacy: filterPrivacy === 'all' ? undefined : filterPrivacy,
    limit: 20,
  });

  const handleJoinGroup = async (groupId: string) => {
    try {
      setJoiningGroup(groupId);
      await groupService.joinGroup(groupId);
      toast.success('Successfully joined the group!');
      refetch(); // Refresh the groups list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join group');
    } finally {
      setJoiningGroup(null);
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'invite-only':
        return <UserPlus className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getPrivacyColor = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return 'success';
      case 'private':
        return 'warning';
      case 'invite-only':
        return 'info';
      default:
        return 'default';
    }
  };

  // Check if user is already a member
  const isUserMember = (group: any) => {
    return user && group.members.some((member: any) => member._id === user._id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Soccer Groups</h1>
            <p className="text-gray-600 mt-2">
              Find and join soccer groups in your area
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/groups/create">
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <Input
              placeholder="Search groups by name, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <select
              value={filterPrivacy}
              onChange={(e) => setFilterPrivacy(e.target.value as any)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="invite-only">Invite Only</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              Retry
            </Button>
          </div>
        )}

        {/* Groups Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group._id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {group.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getPrivacyColor(group.privacy) as any}>
                          <div className="flex items-center space-x-1">
                            {getPrivacyIcon(group.privacy)}
                            <span className="capitalize">{group.privacy}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {group.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {group.location.city}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {group.members.length} members
                    </div>

                    {/* Members Preview */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Members:</span>
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 4).map((member) => (
                          <Avatar
                            key={member._id}
                            src={member.profile.profileImage?.type === 'upload' ? 
                                 member.profile.profileImage.value : undefined}
                            alt={`${member.profile.firstName} ${member.profile.lastName}`}
                            fallback={`${member.profile.firstName[0]}${member.profile.lastName[0]}`}
                            size="sm"
                            className="border-2 border-white"
                          />
                        ))}
                        {group.members.length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                            +{group.members.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <Link to={`/groups/${group._id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {user && !isUserMember(group) && group.privacy === 'public' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleJoinGroup(group._id)}
                        loading={joiningGroup === group._id}
                      >
                        Join
                      </Button>
                    )}
                    {isUserMember(group) && (
                      <Badge variant="success" className="self-center">
                        Member
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {groups.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterPrivacy !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a group in your area!'
              }
            </p>
            <Link to="/groups/create">
              <Button>Create New Group</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};