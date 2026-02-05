import mongoose, { Schema, Document, models } from "mongoose";

export interface ISectionScores {
  financial: number;
  governance: number;
  operational: number;
  legal?: number;
  business?: number;
  market?: number;
  equityStory?: number;
}

export interface IQuestionnaireResponse extends Document {
  company: mongoose.Types.ObjectId;
  answers: Record<string, any>; // raw answers keyed by section.questionId
  sectionScores: ISectionScores;
  overallScore: number;
  readinessLevel: string;
  recommendation: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionnaireResponseSchema = new Schema<IQuestionnaireResponse>(
  {
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    answers: { type: Schema.Types.Mixed, required: true },
    sectionScores: {
      financial: { type: Number, required: true },
      governance: { type: Number, required: true },
      operational: { type: Number, required: true },
      legal: Number,
      business: Number,
      market: Number,
      equityStory: Number,
    },
    overallScore: { type: Number, required: true },
    readinessLevel: { type: String, required: true },
    recommendation: { type: String, required: true },
  },
  { timestamps: true }
);

export default
  (models.QuestionnaireResponse as mongoose.Model<IQuestionnaireResponse>) ||
  mongoose.model<IQuestionnaireResponse>(
    "QuestionnaireResponse",
    QuestionnaireResponseSchema
  );
