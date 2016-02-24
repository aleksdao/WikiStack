var router = require("express").Router();
var models = require("../models/");
var Promise = require("bluebird");
var mongoose = require("mongoose");

Promise.promisifyAll(mongoose);

var Page = models.Page;
var User = models.User;

router.get("/", function(req, res, next) {
	res.render("search");
})

// router.get("")

router.get("/query", function(req, res, next) {
	var tagsArray = req.query.tags.split(" ");
	// tagsArray.map()
	Promise.map(tagsArray, function(tag) {
		return Page.findByTag(tag)
	})
	.then(function(pages) {
		res.render("taggedPages", { pages: pages[0],
					  mode: "query" });
	})
	.catch(next);
})

module.exports = router;
