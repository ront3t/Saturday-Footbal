import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
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
  managers: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
  rules?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [100, 'Group name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Group description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  privacy: {
    type: String,
    enum: ['public', 'private', 'invite-only'],
    default: 'public',
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  managers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  rules: {
    type: String,
    maxlength: [1000, 'Rules cannot exceed 1000 characters'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for searching groups
GroupSchema.index({ name: 'text', description: 'text' });
GroupSchema.index({ 'location.city': 1 });

export const Group = mongoose.model<IGroup>('Group', GroupSchema);
