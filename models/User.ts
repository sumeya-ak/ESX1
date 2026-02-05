import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  smeId: string;
  companyName: string;
  email: string;
  phone: string;
  password: string; // hashed
}

const UserSchema = new Schema<IUser>(
  {
    smeId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.User || mongoose.model<IUser>("User", UserSchema);
