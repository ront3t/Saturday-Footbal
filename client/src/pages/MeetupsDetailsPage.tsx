import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  DollarSign,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  Play,
  MoreVertical,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';
import { Meetup } from '@/types';


export const MeetupDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetup, setMeetup] = useState<Meetup>({} as Meetup);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Check user permissions
  const isCreator = user?._id === meetup.createdBy._id;
  const isGroupManager = meetup.group.managers.some(manager => manager._id === user?._id);
  const canManage = isCreator || isGroupManager;

  const isRegistered = meetup.participants.confirmed.some(p => p._id === user?._id);
  const isOnWaitlist = meetup.participants.waitlist.some(p => p._id === user?._id);
  const isGuest = meetup.participants.guests.some(g => g.user._id === user?._id);

  const spotsLeft = meetup.maxParticipants - meetup.participants.confirmed.length;
  const meetupDate = new Date(meetup.dateTime);
  const isUpcoming = meetupDate > new Date();

  const handleRegister = async () => {
    setRegistering(true);
    // TODO: Implement API call
    setTimeout(() => setRegistering(false), 1000);
  };

  const handleCancel = async () => {
    setRegistering(true);
    // TODO: Implement API call  
    setTimeout(() => setRegistering(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'full': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            {canManage && (
              <div className="flex items-center space-x-2">
                <Link to={`/meetups/${id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={getStatusColor(meetup.status) as any}>
                        {meetup.status}
                      </Badge>
                      <Link 
                        to={`/groups/${meetup.group._id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {meetup.group.name}
                      </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {meetup.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Created by {meetup.createdBy.profile.firstName} {meetup.createdBy.profile.lastName}</span>
                      <span>•</span>
                      <span>{format(new Date(meetup.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {meetup.description}
                    </p>
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {format(meetupDate, 'EEEE, MMMM d, yyyy')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {format(meetupDate, 'h:mm a')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {meetup.duration} minutes
                          </div>
                          <div className="text-sm text-gray-600">
                            Duration
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {meetup.location.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {meetup.location.address}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {meetup.participants.confirmed.length}/{meetup.maxParticipants} players
                          </div>
                          <div className="text-sm text-gray-600">
                            Min: {meetup.minParticipants} players
                          </div>
                        </div>
                      </div>

                      {meetup.costPerPerson && (
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              ${meetup.costPerPerson}
                            </div>
                            <div className="text-sm text-gray-600">
                              Per person
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Participants */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Participants ({meetup.participants.confirmed.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {meetup.participants.confirmed.map((participant) => (
                        <div key={participant._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar
                            src={participant.profile.profileImage.type === 'upload' ? 
                                 participant.profile.profileImage.value : undefined}
                            alt={`${participant.profile.firstName} ${participant.profile.lastName}`}
                            fallback={`${participant.profile.firstName[0]}${participant.profile.lastName[0]}`}
                            size="sm"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {participant.profile.firstName} {participant.profile.lastName}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">
                              {participant.profile.skillLevel}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Waitlist */}
                  {meetup.participants.waitlist.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Waitlist ({meetup.participants.waitlist.length})
                      </h3>
                      <div className="space-y-2">
                        {meetup.participants.waitlist.map((participant) => (
                          <div key={participant._id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                            <Avatar
                              src={participant.profile.profileImage.type === 'upload' ? 
                                   participant.profile.profileImage.value : undefined}
                              alt={`${participant.profile.firstName} ${participant.profile.lastName}`}
                              fallback={`${participant.profile.firstName[0]}${participant.profile.lastName[0]}`}
                              size="sm"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {participant.profile.firstName} {participant.profile.lastName}
                              </div>
                              <div className="text-sm text-gray-600 capitalize">
                                {participant.profile.skillLevel}
                              </div>
                            </div>
                            <Badge variant="warning">Waitlist</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Guests */}
                  {meetup.participants.guests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Guests ({meetup.participants.guests.length})
                      </h3>
                      <div className="space-y-2">
                        {meetup.participants.guests.map((guest) => (
                          <div key={guest.user._id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                            <Avatar
                              src={guest.user.profile.profileImage?.type === 'upload' ? 
                                   guest.user.profile.profileImage.value : undefined}
                              alt={`${guest.user.profile.firstName} ${guest.user.profile.lastName}`}
                              fallback={`${guest.user.profile.firstName[0]}${guest.user.profile.lastName[0]}`}
                              size="sm"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {guest.user.profile.firstName} {guest.user.profile.lastName}
                              </div>
                              <div className="text-sm text-gray-600">
                                Guest
                              </div>
                            </div>
                            <Badge variant={guest.approved ? 'success' : 'warning'}>
                              {guest.approved ? 'Approved' : 'Pending'}
                            </Badge>
                            {canManage && !guest.approved && (
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline">
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline">
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Registration</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant={getStatusColor(meetup.status) as any}>
                      {meetup.status}
                    </Badge>
                  </div>

                  {/* Capacity */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">
                        {meetup.participants.confirmed.length}/{meetup.maxParticipants}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${Math.min((meetup.participants.confirmed.length / meetup.maxParticipants) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    {spotsLeft > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        {spotsLeft} spots remaining
                      </p>
                    )}
                  </div>

                  {/* User Status */}
                  {user && (
                    <div className="border-t pt-4">
                      <div className="text-sm text-gray-600 mb-3">Your status:</div>
                      {isRegistered && (
                        <Badge variant="success" className="mb-3">
                          ✓ Registered
                        </Badge>
                      )}
                      {isOnWaitlist && (
                        <Badge variant="warning" className="mb-3">
                          ⏳ On Waitlist
                        </Badge>
                      )}
                      {isGuest && (
                        <Badge variant="info" className="mb-3">
                          👤 Guest
                        </Badge>
                      )}
                      {!isRegistered && !isOnWaitlist && !isGuest && (
                        <Badge variant="default" className="mb-3">
                          Not registered
                        </Badge>
                      )}

                      {/* Action Buttons */}
                      {isUpcoming && meetup.status === 'published' && (
                        <div className="space-y-2">
                          {isRegistered ? (
                            <Button
                              variant="danger"
                              size="sm"
                              className="w-full"
                              onClick={handleCancel}
                              loading={registering}
                            >
                              <UserMinus className="w-4 h-4 mr-2" />
                              Cancel Registration
                            </Button>
                          ) : isOnWaitlist ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full"
                              disabled
                            >
                              On Waitlist
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={handleRegister}
                              loading={registering}
                              disabled={meetup.maxParticipants <= meetup.participants.confirmed.length}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              {spotsLeft > 0 ? 'Register' : 'Join Waitlist'}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {!user && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-3">
                        Sign in to register for this meetup
                      </p>
                      <Link to="/login">
                        <Button size="sm" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Group Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Group</h3>
              </CardHeader>
              <CardContent>
                <Link 
                  to={`/groups/${meetup.group._id}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {meetup.group.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      View group details
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Games */}
            {meetup.games.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Games</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meetup.games.map((game: any) => (
                      <Link
                        key={game._id}
                        to={`/games/${game._id}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {game.teams?.team1?.name} vs {game.teams?.team2?.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {game.format} • {format(new Date(game.startTime), 'h:mm a')}
                          </div>
                        </div>
                        <Play className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Management Actions */}
            {canManage && isUpcoming && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Manage</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link to={`/meetups/${id}/edit`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Meetup
                      </Button>
                    </Link>
                    <Link to={`/meetups/${id}/teams`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Teams
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite Players
                    </Button>
                    <Button variant="danger" size="sm" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancel Meetup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};