import mongoose, {Schema, model, InferSchemaType} from "mongoose";

const GameDaySchema = new Schema(
  {
    games: {
        type: [Schema.Types.ObjectId],
        ref: 'Game',
        default: [],
    },
    teams: {
        type: [Schema.Types.ObjectId], 
        ref: 'Team',
        default: [],
    },
  },
  { timestamps: true }
);
type GameDay = InferSchemaType<typeof GameDaySchema>

export default model<GameDay>("GameDay", GameDaySchema);