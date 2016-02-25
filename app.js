var express = require("express");
var app = express();
var swig = require("swig");
require("./filters")(swig);
var path = require("path");
var morgan = require("morgan");
var bodyParser = require("body-parser")
var models = require("./models/");
     
var Page = models.Page;
var User = models.User;

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "html");
app.engine("html", swig.renderFile);
swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, '/public')));

app.use("/wiki", require("./routes/wiki"));
app.use("/search", require("./routes/search"));
app.use("/users", require("./routes/users"));

app.get("/", function(req, res, next) {
	Page.find({})
	.exec()
	.then(function(pages) {
		console.log(pages);
		res.render("index", {pages: pages} )
	})
})

app.use(function(err, req, res, next){
	console.error(err);
	res.status(500).send(err.message); //For development only
});

app.listen(process.env.PORT || 1337, function() {
	console.log("server is running");
})