import { model, Schema } from "mongoose";

const schema = new Schema({
  guild: { type: String, required: true },
  name: { type: String, required: true },
  data: { type: Object, required: true },
});

export default model("Setup", schema);
