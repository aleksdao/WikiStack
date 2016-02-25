var marked = require("marked");
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
	tags: {type: [String]}
});

var userSchema = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true}
})

pageSchema.pre("validate", function(next) {
	this.urlTitle = generateUrlTitle(this.title);
	next();
})

pageSchema.virtual("route").get(function() {
	return "/wiki/" + this.urlTitle;
})

pageSchema.virtual("renderedContent").get(function(){
	return marked(this.content);
})

pageSchema.statics.findByTag = function(tag) {
	return this.find({ tags: tag }).exec();
}

pageSchema.methods.findSimilar = function(){
	return this.model("Page").find( {tags: { $in: this.tags }, 
									  _id: { $ne: this._id} }).exec();
}

userSchema.statics.findOrCreate = function(name, email){
	var self = this;
	var user = self.findOne( {email: email}).exec().
	then(function(foundUser){
		if(foundUser){
			console.log("Found User")
			return foundUser;
		}else{
			console.log("Did not find user.")
			// var newUser = new User({ name: name, email: email});
			return self.create({ name: name, email: email});
		}
	})
	return user;
}

module.exports = {
	Page: mongoose.model("Page", pageSchema),
	User: mongoose.model("User", userSchema)
};

//Helper Functions

function generateUrlTitle(title) {
	if(title) {
		var urlTitle = title.replace(/ /g, "_").replace(/[^a-z0-9_]/ig, "");
		return urlTitle;
	}

	return Math.random().toString(36).substring(2,7);
}