import * as mongoose from 'mongoose';

export const passengerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

passengerSchema.index({ email: 1 }, { unique: true });
