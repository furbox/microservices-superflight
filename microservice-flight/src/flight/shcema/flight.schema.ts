import * as mongoose from 'mongoose';

export const flightSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    airplane: {
      type: String,
      require: true,
    },
    destinationCity: {
      type: String,
      require: true,
    },
    flightDate: {
      type: Date,
      require: true,
    },
    passengers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'passengers',
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
