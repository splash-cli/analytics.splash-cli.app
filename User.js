const { Schema, model } = require("mongoose");
const { v4: uuid } = require("uuid");

const UserSchema = new Schema({
	name: String,
	uuid: String,
});

UserSchema.pre("save", function() {
	this.uuid = uuid();
});

module.exports = model("User", UserSchema);
