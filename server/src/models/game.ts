import mongoose, { Document, Schema } from 'mongoose';

export interface IGameEvent {
  type: 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution';
  player: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId;
  timestamp: Date;
  assistedBy?: mongoose.Types.ObjectId;
  substitutedFor?: mongoose.Types.ObjectId;
}

export interface IGame extends Document {
  meetup: mongoose.Types.ObjectId;
  teams: {
    team1: mongoose.Types.ObjectId;
    team2: mongoose.Types.ObjectId;
  };
  score: {
    team1: number;
    team2: number;
  };
  startTime: Date;
  endTime?: Date;
  duration?: number;
  format: string;
  events: IGameEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const GameEventSchema = new Schema<IGameEvent>({
  type: {
    type: String,
    enum: ['goal', 'assist', 'yellow_card', 'red_card', 'substitution'],
    required: true,
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  assistedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  substitutedFor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { _id: false });

const GameSchema = new Schema<IGame>({
  meetup: {
    type: Schema.Types.ObjectId,
    ref: 'Meetup',
    required: true,
  },
  teams: {
    team1: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    team2: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
  },
  score: {
    team1: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
    },
    team2: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
    },
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: Date,
  duration: {
    type: Number,
    min: [1, 'Duration must be at least 1 minute'],
  },
  format: {
    type: String,
    required: [true, 'Game format is required'],
    enum: ['5v5', '7v7', '11v11', 'Other'],
  },
  events: [GameEventSchema],
}, {
  timestamps: true,
});

// Index for efficient querying
GameSchema.index({ meetup: 1, startTime: 1 });

export const Game = mongoose.model<IGame>('Game', GameSchema);