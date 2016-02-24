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
	console.log("Made it!")
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

//Find user in Users
	

	//If returned is null (user doesn't exist), create with info

	//Get ID of existing or new ID

	//Attach _id to page object

var Page = mongoose.model("Page", pageSchema);
var User = mongoose.model("User", userSchema);

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

	return Math.random().toString(36).substring(2,7);
}