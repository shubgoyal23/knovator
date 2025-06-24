import mongoose from "mongoose";

const importLogSchema = new mongoose.Schema(
   {
      taskId: { type: String },
      source: { type: String },
      totalFetched: { type: Number },
      totalImported: { type: Number },
      newJobs: { type: Number },
      updatedJobs: { type: Number },

      failedJobs: [
         {
            jobId: { type: String },
            reason: { type: String },
         },
      ],
   },
   {
      timestamps: true,
   }
);

export const ImportLog =
   mongoose.models.ImportLog || mongoose.model("import_logs", importLogSchema);
