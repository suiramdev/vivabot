import { model, Schema } from "mongoose";

const schema = new Schema({
  guild: { type: String, required: true },
  member: { type: String, required: true },
  message: { type: String, required: true },
  code: { type: String, required: true },
});

export default model("Captcha", schema);
