import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name?: string;
  color?: string;
  captain?: mongoose.Types.ObjectId;
  players: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>({
  name: {
    type: String,
    trim: true,
    maxlength: [50, 'Team name cannot exceed 50 characters'],
  },
  color: {
    type: String,
    trim: true,
    validate: {
      validator: function(value: string) {
        return !value || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
      },
      message: 'Invalid color format. Use hex color format (e.g., #FF0000)',
    },
  },
  captain: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
}, {
  timestamps: true,
});

export const Team = mongoose.model<ITeam>('Team', TeamSchema);
