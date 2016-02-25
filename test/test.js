var chai = require('chai')
var spies = require('chai-spies');
var should = chai.should(),
	expect = chai.expect;
chai.use(spies);

var model = require('../models');
var Page = model.Page;
var User = model.User;

describe("Validation", function(){
	var page;
	beforeEach(function(){
		page = new Page( {status:"LOL"} );
	})

	it("Prevents page without title from being saved", function(done){
		page.validate(function(err){
			expect(err.errors).to.have.property("title");
			done();
		})
	})

	it("Prevents page without content from being saved", function(done){
		page.validate(function(err){
			expect(err.errors).to.have.property("content");
			done();
		})
	})

	it("Status can only be open or closed", function(done){
		page.validate(function(err){
			expect(err.errors).to.have.property("status");
			done();
		})
	})

	it("Automatically generates a url in pre-validation", function(done){
		page.validate(function(err){
			//console.log("ERROR", err);
			expect(err.errors).not.to.have.property("urlTitle");
			done();
		})
	})

})

describe("Statics", function(){

	var uniqueName = 'Unique_Name_Used_Nowhere_Else';
		uniqueEmail = 'uniqueemail@uniqueemail.com';
		uniqueTag = 'Unique_Tag_Used_Nowhere_Else';
		uniqueTagUnused = 'Unique_Tag_Used_Nowhere';
		userId = -1;

	beforeEach(function(done) {

		User.create({
			name: uniqueName,
			email: uniqueEmail
		})
		.then(function(usr){
			userId = usr._id
			Page.create({
			    title: 'Test Page',
			    content: 'Here is some content.',
			    tags: ['test', uniqueTag],
			    author: usr._id
			}, done);
		});
	})

	//Find By Tag
	it('gets pages with the search tag', function(done) {
    	Page.findByTag(uniqueTag).then(function (pages) {
        	expect(pages).to.have.lengthOf(1);
        	done();
    	}).then(null, done);
    })

    it("does not return false positives", function(done){
		Page.findByTag(uniqueTagUnused).then(function (pages) {
	    	expect(pages).to.have.lengthOf(0);
	    	done();
		}).then(null, done);
    })

    //Find or Create (User)
    it("findOrCreate returns user, if one exists", function(done){
    	User.findOrCreate(uniqueName, uniqueEmail)
    	.then(function(user){
    		expect(user._id + "").to.equal(userId + "");
    		done();
    	})
    	.then(null, done)
    })

    it("Otherwise, findOrCreate creates a new user", function(done){
    	User.findOrCreate("newName", "new@new.com")
    	.then(function(user){
    		expect(user._id + "").not.to.equal(userId + "");
    		User.remove( {email: "new@new.com"}, function(err){
    			if(err) throw err;
    		});
    		done();
    	})
    	.then(null, done)
    });
    
    afterEach(function(done){
    	Page.remove( {tags: uniqueTag}, function(err){
    		if(err) throw err;
    	})
    	.then(function(){
    		User.remove( {email: uniqueEmail}, function(err){
    			if(err) throw err;
    			done();
    		})
    	})
    });
})

describe("Schema Methods", function(){
	var a = "new_test_tag_A";
		b = "new_test_tag_B";
		c = "new_test_tag_C";
		d = "new_test_tag_D";

	var tags = [a,b,c,d,b];

	beforeEach(function(done){
		//Create pages tagged: [a,b], [b,c], [c,d], [d,b]
		for(var i = 0; i < 4; i++){
			var readableIndex = i+1;
			Page.create({
				title: "Page " + readableIndex,
				content: "This is page " + readableIndex,
				tags: [ tags[i], tags[i+1] ]
			})
		}

		done();
	})

	xit("returns the correct number of similar pages", function(){});
	xit("returns pages which have common tags", function(){});
	xit("does not return false positives", function(){});

	afterEach(function(done){
		Page.remove( { tags: {$in: tags} },  function(err){
			if(err) throw err;
			done();
		})
	})

})

describe("Virtual Attributes", function(done){

	xit("Renders markdown into html", function(){
		Page.create({
			title: "Markdown Page",
			content: "[edentem](http://haskell.org/) torpor",
			tags: [ "markdown" ] 
		})
	});

})
