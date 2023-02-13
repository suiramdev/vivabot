import { model, Schema } from "mongoose";

const schema = new Schema({
  name: { type: String, required: true },
  data: { type: String, required: true },
  guild: { type: String, required: true },
});

export default model("Setup", schema);
