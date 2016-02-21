var express = require("express");
var app = express();
var swig = require("swig");
var path = require("path");
var morgan = require("morgan");
var bodyParser = require("body-parser")

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "html");
app.engine("html", swig.renderFile);
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json());

app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, '/public')));
swig.setDefaults({cache: false});

app.use("/wiki", require("./routes/wiki"));


app.get("/", function(req, res, next) {
	res.render("index");
})

app.listen(process.env.PORT || 1337, function() {
	console.log("server is running");
})