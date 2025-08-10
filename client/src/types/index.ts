export interface User {
  _id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    profileImage: {
      type: 'avatar' | 'upload';
      value: string;
    };
    dateOfBirth: string;
    location: string;
    preferredPositions: string[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    bio?: string;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  privacy: 'public' | 'private' | 'invite-only';
  location: {
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  managers: User[];
  members: User[];
  rules?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Meetup {
  _id: string;
  title: string;
  description: string;
  group: Group;
  createdBy: User;
  dateTime: string;
  duration?: number;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  minParticipants: number;
  maxParticipants: number;
  costPerPerson?: number;
  participants: {
    confirmed: User[];
    waitlist: User[];
    guests: {
      user: User;
      approved: boolean;
      approvedBy?: User;
    }[];
  };
  status: 'draft' | 'published' | 'full' | 'completed' | 'cancelled';
  games: Game[];
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  _id: string;
  meetup: string;
  teams: {
    team1: Team;
    team2: Team;
  };
  score: {
    team1: number;
    team2: number;
  };
  startTime: string;
  endTime?: string;
  duration?: number;
  format: string;
  events: GameEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  _id: string;
  name?: string;
  color?: string;
  captain?: User;
  players: User[];
  createdAt: string;
  updatedAt: string;
}

export interface GameEvent {
  type: 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution';
  player: User;
  team: Team;
  timestamp: string;
  assistedBy?: User;
  substitutedFor?: User;
}

export interface UserStats {
  gamesPlayed: number;
  meetupsAttended: number;
  totalGoals: number;
  totalAssists: number;
  totalYellowCards: number;
  totalRedCards: number;
  averageGoalsPerGame: string;
  averageAssistsPerGame: string;
}
