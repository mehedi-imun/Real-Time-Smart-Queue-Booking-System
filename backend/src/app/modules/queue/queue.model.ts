// modules/queue/queue.model.ts
import { Schema, model } from "mongoose";
import { IQueue } from "./queue.interface";

const queueSchema = new Schema<IQueue>(
  {
    title: { type: String, required: true },
    description: { type: String },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    totalSlots: { type: Number, required: true },
    queueType: { type: String, enum: ["FIFO", "PRIORITY"], required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Queue = model<IQueue>("Queue", queueSchema);
