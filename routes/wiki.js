var router = require("express").Router();
var models = require("../models/");
var Page = models.Page;
var User = models.User;


router.get("/", function(req, res, next) {
	res.redirect("/");
})

router.get("/add", function(req, res, next) {
	res.render("addpage");
})


router.post("/", function(req, res, next) {

	var author = req.body.name;
	var email = req.body.email;
	var authorId;
	User.findOrCreate(author, email)
	.then(function(user){
		console.log("THE USER'S ID IS", user._id)
		var page = new Page({
			title: req.body.title,
			content: req.body.content,
			tags: req.body.tags.split(" "),
			author: user._id
		})
		
		page.save().then(function(savedPage) {
			res.redirect(savedPage.route);
		})
		
		// return user;
	})
	.then(null, next);

	

	// var page = new Page({
	// 	title: req.body.title,
	// 	content: req.body.content,
	// 	tags: req.body.tags.split(" ")
	// 	author: 
	// })

	// page.save().then(function(savedPage) {
	// 	res.redirect(savedPage.route);
	// }).then(null, next);
})

router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({ urlTitle: req.params.urlTitle }).exec()
  .then(function(foundPage){
  	User.findOne({_id: foundPage.author}).exec()
  	.then(function(user){
  	res.render("wikipage", {page: foundPage, 
  							author: user,
  							tags: foundPage.tags.join(" ") });
  	})
  })
  .catch(next); // assuming you replaced mpromise
});

router.get('/:urlTitle/similar', function(req, res, next){
	Page.findOne({urlTitle: req.params.urlTitle}).exec()
	.then(function(page){
		return page.findSimilar();
	})
	.then(function(pages){
		res.render("query", { pages: pages,
					  mode: "similar" });
	})
	.catch(next);

})


module.exports = router;

	


