define(function (require) {
	var $ = require("jquery");
	require("app/config/routes");
	require("app/config/disableDragging");
	/*
	var artistSearch = require("./views/artist/artistSearch");
	var artSearch = require("./views/art/artSearch");
	var artTypeSearch = require("./views/arttype/artTypeSearch");
	var propertyTypeSearch = require("./views/propertytype/propertyTypeSearch");
	var userSearch = require("./views/user/userSearch");
	var exhibitionSearch = require("./views/exhibition/exhibitionSearch");
	var home = require("./views/home/home");
	var subjectSearch = require("./views/types/subject/subjectSearch");
	var mediumSearch = require("./views/types/medium/mediumSearch");
	*/
	var kudu = require("kudu/kudu");
	//var globals = require("./util/globals");

	/*  Below we are manually navigating the menus instead of using the href tag. The advantage of this is clicking on the link will force
	 * a page reload, while using the href tag on the second click won't, since the hash value does not change. */

	$("#menu-home").on('click', function (e) {
		e.preventDefault();
		kudu.route({ctrl: home});
	});

	$("#menu-subject").on('click', function (e) {
		e.preventDefault();
		kudu.route({ctrl: subjectSearch});
	});
	
	$("#menu-medium").on('click', function (e) {
		e.preventDefault();
		kudu.route({ctrl: mediumSearch});
	});

	$("#menu-artist").on('click', function (e) {
		e.preventDefault();
		kudu.route({ctrl: artistSearch});
	});

	$("#menu-art").on('click', function (e) {
		e.preventDefault();
		kudu.route({ctrl: artSearch});
	});

	$("#menu-artType").on('click', function (e) {
		e.preventDefault();
		kudu.route({ctrl: artTypeSearch});
	});

	$("#menu-propertyType").on('click', function (e) {
		e.preventDefault();
		kudu.route({ctrl: propertyTypeSearch});
	});

	$("#menu-user").on('click', function (e) {
		e.preventDefault();
		kudu.route({ctrl: userSearch});
	});
	
	$("#menu-exhibition").on('click', function (e) {
		e.preventDefault();
		kudu.route({ctrl: exhibitionSearch});
	});
});