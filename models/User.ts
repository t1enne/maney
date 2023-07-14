import { model, Schema } from "npm:mongoose";

const UserSchema = new Schema({
  name: { type: String, unique: true },
  phoneNr: { type: String, unique: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.path("name").required(true, "User name cannot be blank.");
UserSchema.path("phoneNr").required(true, "User phone number cannot be blank.");
UserSchema.path("password").required(true, "User password cannot be blank.");

export default model("User", UserSchema);
