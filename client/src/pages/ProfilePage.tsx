import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { AvatarSelector } from '../components/common/AvatarSelector';
import { 
  Edit2, 
  Save, 
  X, 
  Trophy, 
  Target, 
  Users, 
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.profile.firstName || '',
    lastName: user?.profile.lastName || '',
    phoneNumber: user?.profile.phoneNumber || '',
    location: user?.profile.location || '',
    bio: user?.profile.bio || '',
    profileImage: user?.profile.profileImage || { type: 'avatar' as const, value: 'avatar-1.png' },
  });

  // Mock stats - in real app, fetch from API
  const stats = {
    gamesPlayed: 24,
    totalGoals: 15,
    totalAssists: 8,
    meetupsAttended: 18,
    averageGoalsPerGame: '0.63',
    averageAssistsPerGame: '0.33',
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // In real app, make API call to update user profile
      updateUser({
        profile: {
          ...user!.profile,
          ...formData,
        },
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.profile.firstName || '',
      lastName: user?.profile.lastName || '',
      phoneNumber: user?.profile.phoneNumber || '',
      location: user?.profile.location || '',
      bio: user?.profile.bio || '',
      profileImage: user?.profile.profileImage || { type: 'avatar' as const, value: 'avatar-1.png' },
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        loading={loading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <Avatar
                      src={formData.profileImage.type === 'upload' ? 
                           formData.profileImage.value : undefined}
                      alt={`${formData.firstName} ${formData.lastName}`}
                      fallback={`${formData.firstName[0]}${formData.lastName[0]}`}
                      size="xl"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {formData.firstName} {formData.lastName}
                    </h2>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="info">
                        {user.profile.skillLevel}
                      </Badge>
                      <span className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {formData.location}
                      </span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="border-t pt-6">
                    <AvatarSelector
                      selectedAvatar={formData.profileImage.value}
                      onAvatarSelect={(avatar) => 
                        setFormData(prev => ({
                          ...prev,
                          profileImage: { type: 'avatar', value: avatar }
                        }))
                      }
                    />
                  </div>
                )}

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    leftIcon={<Edit2 className="w-4 h-4" />}
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    leftIcon={<Edit2 className="w-4 h-4" />}
                  />
                  <Input
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    disabled={!isEditing}
                    leftIcon={<Phone className="w-4 h-4" />}
                  />
                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                    leftIcon={<MapPin className="w-4 h-4" />}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Contact Info */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{user.email}</span>
                      <Badge variant="success">Verified</Badge>
                    </div>
                    {formData.phoneNumber && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{formData.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferred Positions */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Positions</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.preferredPositions.map((position, index) => (
                      <Badge key={index} variant="default">
                        {position}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Performance Stats</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Games Played</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stats.gamesPlayed}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Total Goals</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stats.totalGoals}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Total Assists</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stats.totalAssists}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-600">Meetups Attended</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stats.meetupsAttended}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Averages */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Averages</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Goals per Game</span>
                      <span className="font-semibold text-gray-900">{stats.averageGoalsPerGame}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(parseFloat(stats.averageGoalsPerGame) * 50, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Assists per Game</span>
                      <span className="font-semibold text-gray-900">{stats.averageAssistsPerGame}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(parseFloat(stats.averageAssistsPerGame) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};