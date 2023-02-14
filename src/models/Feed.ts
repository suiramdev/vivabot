import { model, Schema } from "mongoose";

const schema = new Schema({
  guild: { type: String, required: true },
  url: { type: String, required: true },
  channel: { type: String, required: true },
  lastUpdate: { type: Date, default: Date.now },
});

export default model("Feed", schema);
