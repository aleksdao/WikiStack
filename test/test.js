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