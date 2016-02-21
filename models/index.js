var mongoose = require("mongoose");
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect("mongodb://localhost/wikistack");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "mongodb connection error:"));

var Schema = mongoose.Schema;

var pageSchema = new Schema({
	title: {type: String, required: true},
	urlTitle: {type: String, required: true},
	content: {type: String, required: true},
	status: {type: String, enum: ["open", "closed"]},
	date: {type: Date, default: Date.now},
	author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	tags: [String]
});

var userSchema = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true}
})

pageSchema.pre("validate", function(next) {

	this.urlTitle = generateUrlTitle(this.title);
	console.log("does it go into PRE")
	next();
})

pageSchema.virtual("route").get(function() {
	return "/wiki/" + this.urlTitle;
})


var Page = mongoose.model("Page", pageSchema);
var User = mongoose.model("User", pageSchema);

module.exports = {
	Page: Page,
	User: User
};


function generateUrlTitle(title) {
	if(title) {
		var spaces = / /g;
		var nonAlphaNum = /[^a-z0-9_]/ig;
		var urlTitle = title.replace(spaces, "_").replace(nonAlphaNum, "");
		return urlTitle;
	}
	else {
		return Math.random().toString(36).substring(2,7);
	}
}