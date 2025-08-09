import mongoose, { Document, Schema } from 'mongoose';

export interface IMeetup extends Document {
  title: string;
  description: string;
  group: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  dateTime: Date;
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
    confirmed: mongoose.Types.ObjectId[];
    waitlist: mongoose.Types.ObjectId[];
    guests: {
      user: mongoose.Types.ObjectId;
      approved: boolean;
      approvedBy?: mongoose.Types.ObjectId;
    }[];
  };
  status: 'draft' | 'published' | 'full' | 'completed' | 'cancelled';
  games: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MeetupSchema = new Schema<IMeetup>({
  title: {
    type: String,
    required: [true, 'Meetup title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Meetup description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateTime: {
    type: Date,
    required: [true, 'Date and time is required'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Meetup date must be in the future',
    },
  },
  duration: {
    type: Number,
    min: [30, 'Duration must be at least 30 minutes'],
    max: [480, 'Duration cannot exceed 8 hours'],
  },
  location: {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Invalid latitude'],
        max: [90, 'Invalid latitude'],
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Invalid longitude'],
        max: [180, 'Invalid longitude'],
      },
    },
  },
  minParticipants: {
    type: Number,
    required: [true, 'Minimum participants is required'],
    min: [2, 'Minimum participants must be at least 2'],
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Maximum participants is required'],
    min: [2, 'Maximum participants must be at least 2'],
    validate: {
      validator: function(value: number) {
        return value >= this.minParticipants;
      },
      message: 'Maximum participants must be greater than or equal to minimum participants',
    },
  },
  costPerPerson: {
    type: Number,
    min: [0, 'Cost cannot be negative'],
  },
  participants: {
    confirmed: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    waitlist: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    guests: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      approved: {
        type: Boolean,
        default: false,
      },
      approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'full', 'completed', 'cancelled'],
    default: 'draft',
  },
  games: [{
    type: Schema.Types.ObjectId,
    ref: 'Game',
  }],
}, {
  timestamps: true,
});

// Indexes for efficient querying
MeetupSchema.index({ group: 1, dateTime: 1 });
MeetupSchema.index({ status: 1, dateTime: 1 });
MeetupSchema.index({ 'location.coordinates': '2dsphere' });

export const Meetup = mongoose.model<IMeetup>('Meetup', MeetupSchema);
