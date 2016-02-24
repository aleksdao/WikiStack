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
		uniqueemail = 'uniqueemail@uniqueemail.com'
		uniqueTag = 'UniqueTagUsedNowhereElse';
		uniqueTagUnused = 'UniqueTagUsedNowhere';

	beforeEach(function(done) {
	    Page.create({
	        title: 'Test Page',
	        content: 'Here is some content.',
	        tags: ['test', uniqueTag]
	    })
	    .then(function(){
	    	User.create({
	    		name: uniqueName,
	    		email: uniqueemail
	    	}, done);
	    })
	})

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
    
    afterEach(function(done){
    	Page.remove( {tags: uniqueTag}, function(err){
    		if(err) throw err;
    	})
    	.then(function(){
    		User.remove( {email: uniqueemail}, function(err){
    			if(err) throw err;
    			done();
    		})
    	})
    });

})