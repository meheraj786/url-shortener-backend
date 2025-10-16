import mongoose, { Document, Types } from "mongoose";

export interface IUrl extends Document {
  longUrl: string;
  shortId: string;
  clicks: number;
  owner?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const urlSchema = new mongoose.Schema<IUrl>(
  {
    longUrl: { type: String, required: true },
    shortId: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const Url = mongoose.model<IUrl>("Url", urlSchema);
export default Url;
