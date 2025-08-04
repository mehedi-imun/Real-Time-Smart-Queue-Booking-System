// models/QueueEvent.model.ts

import mongoose, { Document, Schema } from "mongoose";

export interface IQueueEvent extends Document {
  title: string;
  description?: string;
  startsAt: Date;
  endsAt: Date;
  totalSlots: number;
  queueType: "FIFO" | "PRIORITY";
  image?: string | null;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QueueEventSchema = new Schema<IQueueEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startsAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    totalSlots: {
      type: Number,
      required: true,
      min: 1,
    },
    queueType: {
      type: String,
      enum: ["FIFO", "PRIORITY"],
      required: true,
    },
    image: { type: String, default: null },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model<IQueueEvent>("Event", QueueEventSchema);
