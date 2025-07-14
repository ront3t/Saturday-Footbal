import mongoose, {Schema, model, InferSchemaType} from "mongoose";

const TeamSchema = new Schema(
  {
    players: {
      type: [Schema.Types.ObjectId],
      ref: 'Player',
      default: [],
    }
  },
  { timestamps: true }
);
type Team = InferSchemaType<typeof TeamSchema>

export default model<Team>("Team", TeamSchema);