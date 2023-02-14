import { model, Schema, Types } from "mongoose";

const schema = new Schema({
  feed: { type: Types.ObjectId, required: true },
  item: { type: String, required: true },
});

export default model("FeedItem", schema);
