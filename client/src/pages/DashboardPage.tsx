import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { 
  Calendar, 
  Users, 
  Trophy, 
  MapPin,
  Plus,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Mock data - in real app, fetch from API
  const upcomingMeetups = [
    {
      id: '1',
      title: 'Sunday Morning Football',
      date: '2025-08-03T09:00:00Z',
      location: 'Central Park Field 1',
      participants: 12,
      maxParticipants: 16,
    },
    {
      id: '2', 
      title: 'Evening Kickabout',
      date: '2025-08-05T18:00:00Z',
      location: 'Riverside Sports Complex',
      participants: 8,
      maxParticipants: 12,
    },
  ];

  const stats = {
    gamesPlayed: 24,
    goals: 15,
    assists: 8,
    winRate: 67,
  };

  const recentActivity = [
    { type: 'goal', text: 'Scored 2 goals in Sunday Match', time: '2 days ago' },
    { type: 'meetup', text: 'Joined Evening Football meetup', time: '3 days ago' },
    { type: 'assist', text: 'Recorded 1 assist in friendly match', time: '1 week ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar
                src={user?.profile.profileImage.type === 'upload' ? 
                     user.profile.profileImage.value : undefined}
                alt={`${user?.profile.firstName} ${user?.profile.lastName}`}
                fallback={`${user?.profile.firstName[0]}${user?.profile.lastName[0]}`}
                size="lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.profile.firstName}!
                </h1>
                <p className="text-gray-600">
                  Ready for your next game?
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link to="/meetups/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Meetup
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.gamesPlayed}</div>
                  <div className="text-sm text-gray-600">Games Played</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.goals}</div>
                  <div className="text-sm text-gray-600">Goals</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.assists}</div>
                  <div className="text-sm text-gray-600">Assists</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.winRate}%</div>
                  <div className="text-sm text-gray-600">Win Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Meetups */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Meetups</h2>
                  <Link to="/meetups">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMeetups.map((meetup) => (
                    <div key={meetup.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{meetup.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(meetup.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {meetup.location}
                            </span>
                            <Badge variant="info">
                              {meetup.participants}/{meetup.maxParticipants} players
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Link to={`/meetups/${meetup.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link to="/meetups/create" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Meetup
                    </Button>
                  </Link>
                  <Link to="/groups" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Browse Groups
                    </Button>
                  </Link>
                  <Link to="/profile" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Trophy className="w-4 h-4 mr-2" />
                      View Stats
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'goal' ? 'bg-green-500' :
                        activity.type === 'assist' ? 'bg-blue-500' : 'bg-purple-500'
                      }`} />
                      <div>
                        <p className="text-sm text-gray-900">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weather Widget (placeholder) */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Weather</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl mb-2">☀️</div>
                  <div className="text-2xl font-bold text-gray-900">72°F</div>
                  <div className="text-sm text-gray-600">Perfect for football!</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
