import {Schema, model, InferSchemaType} from "mongoose";

const UserSchema = new Schema(
  {
    username:{	
      type: String,
      required: true,
      unique:true,
      min: 2,
      max: 50,
    },
    fullname:{
      type: String,
    },
    email: {
      type: String,
      max: 50,
      unique: true,
      select: false
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
  },
  { timestamps: true }
);
type User = InferSchemaType<typeof UserSchema>

export default model<User>("User", UserSchema);