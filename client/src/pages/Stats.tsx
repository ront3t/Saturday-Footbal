import React, { useEffect } from 'react';
import { BarChart3, Trophy, Target, Calendar, TrendingUp, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUserStats } from '../store/slices/userSlice';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Stats: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { userStats, loading } = useAppSelector(state => state.users);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserStats(user._id));
    }
  }, [dispatch, user?._id]);

  const statCards = [
    {
      title: 'Games Played',
      value: userStats?.gamesPlayed || 0,
      icon: Calendar,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-600/20',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Meetups Attended',
      value: userStats?.meetupsAttended || 0,
      icon: Users,
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-600/20',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Total Goals',
      value: userStats?.totalGoals || 0,
      icon: Target,
      color: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-600/20',
      borderColor: 'border-yellow-500/30'
    },
    {
      title: 'Total Assists',
      value: userStats?.totalAssists || 0,
      icon: Trophy,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-600/20',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'Yellow Cards',
      value: userStats?.totalYellowCards || 0,
      icon: BarChart3,
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-600/20',
      borderColor: 'border-orange-500/30'
    },
    {
      title: 'Red Cards',
      value: userStats?.totalRedCards || 0,
      icon: TrendingUp,
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-600/20',
      borderColor: 'border-red-500/30'
    }
  ];

  const performanceStats = [
    {
      label: 'Goals per Game',
      value: userStats?.averageGoalsPerGame || '0.00',
      trend: 'neutral'
    },
    {
      label: 'Assists per Game',
      value: userStats?.averageAssistsPerGame || '0.00',
      trend: 'neutral'
    }
  ];

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
        title="Your Statistics"
        subtitle="Track your soccer performance and progress over time"
      />

      <Container className="py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} hover className={`${stat.bgColor} border ${stat.borderColor}`}>
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mr-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-300">{stat.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Metrics */}
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">Performance Metrics</h3>
            <div className="space-y-4">
              {performanceStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <span className="text-slate-300">{stat.label}</span>
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Summary */}
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">Activity Summary</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Keep Playing!</h4>
                <p className="text-slate-300 text-sm">
                  You've participated in {userStats?.meetupsAttended || 0} meetups. 
                  Join more games to improve your stats!
                </p>
              </div>

              {userStats?.gamesPlayed && userStats.gamesPlayed > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-lg font-bold text-white">
                      {((userStats.totalGoals + userStats.totalAssists) / userStats.gamesPlayed).toFixed(1)}
                    </p>
                    <p className="text-slate-400 text-sm">Goal Contributions</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-lg font-bold text-white">
                      {userStats.totalYellowCards + userStats.totalRedCards}
                    </p>
                    <p className="text-slate-400 text-sm">Total Cards</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-300">No game data yet</p>
                  <p className="text-slate-400 text-sm">Play in some meetups to see your statistics!</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Stats;