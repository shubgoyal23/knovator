import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      id: { type: String, required: true, unique: true },
      link: { type: String },
      pubDate: { type: Date },
      description: { type: String },
      encoded: { type: String },
      url: { type: String },
      location: { type: String },
      job_type: { type: String },
      company: { type: String },
      isDeleted: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
   },
   {
      timestamps: true,
   }
);

export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
