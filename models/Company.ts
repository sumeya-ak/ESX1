import mongoose, { Schema, Document, models } from "mongoose";

export interface ICompany extends Document {
  name: string;
  industry: string;
  country: string;
  revenue: number;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    industry: { type: String, required: true },
    country: { type: String, required: true },
    revenue: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.Company || mongoose.model<ICompany>("Company", CompanySchema);
