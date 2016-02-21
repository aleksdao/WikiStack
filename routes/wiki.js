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
	var page = new Page({
		title: req.body.title,
		content: req.body.content
	})
	page.save().then(function(savedPage) {
		res.redirect(data.route);
	}).then(null, next);

	// function(err, data) {
	// 	if(err) {
	// 		return console.log("error:", err);
	// 	}
	// 	console.log("Yo", data);
	// })
})

router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({ urlTitle: req.params.urlTitle }).exec()
  .then(function(foundPage){
    console.log(foundPage);
    res.render("wikipage", foundPage);
  })
  .catch(next); // assuming you replaced mpromise
});


module.exports = router;

	


