import { model, Schema } from "npm:mongoose";

const MovementSchema = new Schema({
  name: String,
  amount: Number,
  category: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

MovementSchema.path("amount").required(true, "cant' be null");
export default model("Movement", MovementSchema);
