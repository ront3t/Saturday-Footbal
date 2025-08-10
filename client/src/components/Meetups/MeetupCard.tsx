import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { Meetup } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  DollarSign 
} from 'lucide-react';

interface MeetupCardProps {
  meetup: Meetup;
  onRegister?: (meetupId: string) => void;
  onCancel?: (meetupId: string) => void;
  registering?: boolean;
  currentUserId?: string;
}

export const MeetupCard: React.FC<MeetupCardProps> = ({
  meetup,
  onRegister,
  onCancel,
  registering = false,
  currentUserId
}) => {
  const isRegistered = currentUserId && meetup.participants.confirmed.some(
    user => user._id === currentUserId
  );
  
  const isOnWaitlist = currentUserId && meetup.participants.waitlist.some(
    user => user._id === currentUserId
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'full': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const spotsLeft = meetup.maxParticipants - meetup.participants.confirmed.length;

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link 
              to={`/meetups/${meetup._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {meetup.title}
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              by {meetup.createdBy.profile.firstName} {meetup.createdBy.profile.lastName}
            </p>
          </div>
          <Badge variant={getStatusColor(meetup.status)}>
            {meetup.status}
          </Badge>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {meetup.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {format(new Date(meetup.dateTime), 'PPP p')}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {meetup.location.name}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {meetup.participants.confirmed.length}/{meetup.maxParticipants} participants
            {spotsLeft > 0 && (
              <span className="text-green-600 ml-1">
                ({spotsLeft} spots left)
              </span>
            )}
          </div>

          {meetup.duration && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {meetup.duration} minutes
            </div>
          )}

          {meetup.costPerPerson && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              ${meetup.costPerPerson} per person
            </div>
          )}
        </div>

        {/* Participants Preview */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-gray-600">Participants:</span>
          <div className="flex -space-x-2">
            {meetup.participants.confirmed.slice(0, 5).map((participant) => (
              <Avatar
                key={participant._id}
                src={participant.profile.profileImage.type === 'upload' ? 
                     participant.profile.profileImage.value : undefined}
                alt={`${participant.profile.firstName} ${participant.profile.lastName}`}
                fallback={`${participant.profile.firstName[0]}${participant.profile.lastName[0]}`}
                size="sm"
                className="border-2 border-white"
              />
            ))}
            {meetup.participants.confirmed.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                +{meetup.participants.confirmed.length - 5}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <Link to={`/meetups/${meetup._id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>

          {currentUserId && meetup.status === 'published' && (
            <div className="flex space-x-2">
              {isRegistered ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onCancel?.(meetup._id)}
                  loading={registering}
                >
                  Cancel Registration
                </Button>
              ) : isOnWaitlist ? (
                <Button variant="secondary" size="sm" disabled>
                  On Waitlist
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onRegister?.(meetup._id)}
                  loading={registering}
                  disabled={meetup.participants.confirmed.length >= meetup.maxParticipants}
                >
                  {meetup.participants.confirmed.length >= meetup.maxParticipants ? 'Join Waitlist' : 'Register'}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
