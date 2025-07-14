import {Schema, model, InferSchemaType} from "mongoose";

const GameSchema = new Schema(
  {
    teamA: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    teamB: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    score: {
      type: [Number],
      default: [0, 0], // Default score for team A and team B
    }
  },
  { timestamps: true }
);
type Game = InferSchemaType<typeof GameSchema>

export default model<Game>("Game", GameSchema);