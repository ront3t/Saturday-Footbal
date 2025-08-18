import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchMeetupById, registerForMeetup, cancelRegistration } from '../store/slices/meetupSlice';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const MeetupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentMeetup: meetup, loading } = useAppSelector(state => state.meetups);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchMeetupById(id));
    }
  }, [dispatch, id]);

  const isUserRegistered = meetup?.participants.confirmed.some(p => p._id === user?._id);
  const isUserOnWaitlist = meetup?.participants.waitlist.some(p => p._id === user?._id);
  const isCreator = meetup?.createdBy._id === user?._id;
  const canEdit = isCreator || meetup?.group?.managers?.some((m: any) => m._id === user?._id);

  const handleRegister = async () => {
    if (!meetup?._id) return;
    try {
      await dispatch(registerForMeetup(meetup._id)).unwrap();
      toast.success('Successfully registered for meetup!');
    } catch (error: any) {
      toast.error(error || 'Failed to register');
    }
  };

  const handleCancelRegistration = async () => {
    if (!meetup?._id) return;
    try {
      await dispatch(cancelRegistration(meetup._id)).unwrap();
      toast.success('Registration cancelled');
    } catch (error: any) {
      toast.error(error || 'Failed to cancel registration');
    }
  };

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!meetup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Meetup not found</h2>
          <Button onClick={() => navigate('/meetups')}>
            Back to Meetups
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title={meetup.title}
        subtitle={`Organized by ${meetup.group?.name}`}
        action={{
          label: 'Back to Meetups',
          onClick: () => navigate('/meetups'),
          icon: ArrowLeft
        }}
      >
        <div className="flex items-center space-x-4">
          <Badge variant={getStatusBadgeVariant(meetup.status)}>
            {meetup.status}
          </Badge>
          {canEdit && (
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="danger">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </PageHeader>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {meetup.description}
              </p>
            </Card>

            {/* Participants */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">
                Participants ({meetup.participants.confirmed.length}/{meetup.maxParticipants})
              </h3>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
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
                <div className="flex justify-between text-sm text-slate-400 mt-2">
                  <span>Min: {meetup.minParticipants}</span>
                  <span>Current: {meetup.participants.confirmed.length}</span>
                  <span>Max: {meetup.maxParticipants}</span>
                </div>
              </div>

              {/* Confirmed Participants */}
              <div className="space-y-4">
                <h4 className="font-medium text-white">Confirmed Players</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {meetup.participants.confirmed.map((participant: any) => (
                    <div key={participant._id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {participant.profile?.firstName?.charAt(0)}{participant.profile?.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {participant.profile?.firstName} {participant.profile?.lastName}
                        </p>
                        <p className="text-slate-400 text-sm">{participant.profile?.skillLevel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waitlist */}
              {meetup.participants.waitlist.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-white mb-3">
                    Waitlist ({meetup.participants.waitlist.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {meetup.participants.waitlist.map((participant: any, index: number) => (
                      <div key={participant._id} className="flex items-center space-x-3 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {participant.profile?.firstName} {participant.profile?.lastName}
                          </p>
                          <p className="text-slate-400 text-sm">{participant.profile?.skillLevel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Meetup Details</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Date & Time</p>
                    <p className="text-slate-300 text-sm">{formatDate(meetup.dateTime)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">{meetup.location.name}</p>
                    <p className="text-slate-300 text-sm">{meetup.location.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Capacity</p>
                    <p className="text-slate-300 text-sm">
                      {meetup.minParticipants} - {meetup.maxParticipants} players
                    </p>
                  </div>
                </div>

                {meetup.duration && (
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Duration</p>
                      <p className="text-slate-300 text-sm">{meetup.duration} minutes</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Cost</p>
                    <p className="text-slate-300 text-sm">
                      {meetup.costPerPerson ? `$${meetup.costPerPerson} per person` : 'Free'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Registration Actions */}
            {meetup.status === 'published' && new Date(meetup.dateTime) > new Date() && !isCreator && (
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Join Meetup</h3>
                {isUserRegistered ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-600/20 border border-green-600/30 rounded-lg">
                      <p className="text-green-300 text-sm font-medium">
                        ✓ You're registered for this meetup!
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleCancelRegistration}
                    >
                      Cancel Registration
                    </Button>
                  </div>
                ) : isUserOnWaitlist ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                      <p className="text-yellow-300 text-sm font-medium">
                        ⏳ You're on the waitlist
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleCancelRegistration}
                    >
                      Leave Waitlist
                    </Button>
                  </div>
                ) : (
                  <Button
                    fullWidth
                    onClick={handleRegister}
                    disabled={meetup.participants.confirmed.length >= meetup.maxParticipants}
                  >
                    {meetup.participants.confirmed.length >= meetup.maxParticipants ? 'Join Waitlist' : 'Join Meetup'}
                  </Button>
                )}
              </Card>
            )}

            {/* Creator Info */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Organizer</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {meetup.createdBy?.profile?.firstName?.charAt(0)}
                    {meetup.createdBy?.profile?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {meetup.createdBy?.profile?.firstName} {meetup.createdBy?.profile?.lastName}
                  </p>
                  <p className="text-slate-400 text-sm">Meetup Creator</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MeetupDetail;