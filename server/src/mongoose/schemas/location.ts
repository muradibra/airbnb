import mongoose, { Schema, Document, Types } from "mongoose";

interface ILocation extends Document {
  street: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
}

const locationSchema: Schema = new Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
  },
});

const Location = mongoose.model<ILocation>("Location", locationSchema);

export default Location;
