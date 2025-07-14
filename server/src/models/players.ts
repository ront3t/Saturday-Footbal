import mongoose, {Schema, model, InferSchemaType} from "mongoose";

const PlayerSchema = new Schema(
  {
    name: {
      type: String, 
      required: true,
    },
    goals: {
      type: Number,
      default: 0,
    },
    assists: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
type Player = InferSchemaType<typeof PlayerSchema>

export default model<Player>("Player", PlayerSchema);