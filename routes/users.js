var router = require("express").Router();
var models = require("../models/");
var Page = models.Page;
var User = models.User;
var bluebird = require('bluebird');

router.get("/", function(req, res, next) {
	User.find().exec()
	.then(function(users){
		res.render("users", {users: users} );
	})
	.catch(next);
});

router.get("/:userId", function(req, res, next){
	var userPromise = User.findById(req.params.userId).exec();
	var pagesPromise = Page.find({author: req.params.userId}).exec();

	bluebird.join(userPromise, pagesPromise, function(user, pages){
		res.render("userpage", {user: user, pages: pages})
	}).catch(next);

})


module.exports = router;