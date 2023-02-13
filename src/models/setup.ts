import { model, Schema, SchemaType } from "mongoose";

const schema = new Schema({
  name: { type: String, required: true },
  data: { type: Object, required: true },
  guild: { type: String, required: true },
});

export default model("Setup", schema);
