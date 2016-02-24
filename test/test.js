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

	var uniqueName = 'UniqueNameUsedNowhereElse',
		uniqueEmail = 'uniqueemail@uniqueemail.com'
		uniqueTag = 'UniqueTagUsedNowhereElse';
		uniqueTagUnused = 'UniqueTagUsedNowhere';
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

	//Finy By Tag
	it('gets pages with the search tag', function(done) {
    	Page.findByTag('UniqueTagUsedNowhereElse').then(function (pages) {
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