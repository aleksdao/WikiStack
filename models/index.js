var mongoose = require("mongoose");
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect("mongodb://localhost/wikistack");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "mongodb connection error:"));

var Schema = mongoose.Schema;

var pageSchema = newSchema({
	title: {type: String, required: true},
	urlTitle: {type: String, required: true},
	content: {type: String, required: true},
	status: {type: String, enum: ["open", "closed"],
	date: {type: Date, default: Date.now},
	author: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

var userSchema = newSchema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true}
})

var Page = mongoose.model("Page", pageSchema);
var User = mongoose.model("User", pageSchema);

module.exports = {
	Page: Page,
	User: User
};

pageSchema.virtual("route").get(function() {
	return "/wiki/" + this.urlTitle;
})