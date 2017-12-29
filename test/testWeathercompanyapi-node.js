/**
 * The Weather Company Data API
 *
 * @author Dan Wilson
 * @copyright 2017 Skydrop, LLC
 * @licence MIT (see LICENCE)
 */
require('should');
const WeatherApi = require('./../lib/weathercompanyapi-node'),
	fs = require('fs');

var cachedDevKey = null;
var getDevKey = function(callback){
	"use strict";

	if (cachedDevKey){
		callback(false, cachedDevKey);
		return;
	}

	fs.readFile(__dirname+'/apikey.txt', 'utf8', function (err, data) {
		if (err) {
			callback(err, false);
			return console.error(err);
		}

		cachedDevKey = data;
		callback(false, cachedDevKey);
	});
};

describe('The Weather Company API Node Client', function() {
	"use strict";

	this.timeout(4000);

	before(function (done) {
		getDevKey(function (err, key) {
			err.should.be.false();
			key.should.be.String();

			done();
		})
	});

	it('should return data for current conditions with postal location', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.units('e').language('en-US').location('94024', 'US').call('observations/current', function (err, data) {
			data.should.be.instanceOf(Object).and.have.property('observation');
			data.metadata.language.should.equal('en-US');
			data.metadata.units.should.equal('e');
			data.metadata.status_code.should.equal(200);

			data.observation.should.have.property('imperial'); // because of units = e
			data.observation.imperial.should.have.property('temp').and.is.a.Number();
			data.observation.imperial.should.have.property('altimeter').and.is.a.Number();
			data.observation.imperial.should.have.property('wspd').and.is.a.Number();

			done();
		});

	});

	it('should return data for current conditions with australia postal location', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.units('e').language('en-US').location('2020', 'AU').call('observations/current', function (err, data) {
			data.should.be.instanceOf(Object).and.have.property('observation');
			data.metadata.language.should.equal('en-US');
			data.metadata.units.should.equal('e');
			data.metadata.status_code.should.equal(200);

			data.observation.should.have.property('imperial'); // because of units = e
			data.observation.imperial.should.have.property('temp').and.is.a.Number();
			data.observation.imperial.should.have.property('altimeter').and.is.a.Number();
			data.observation.imperial.should.have.property('wspd').and.is.a.Number();

			done();
		});

	});

	it('should return data for current conditions with latitude longitude location', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.units('e').language('en-US').geocode('37.317850,-122.035920').call('observations/current', function (err, data) {
			data.should.be.instanceOf(Object).and.have.property('observation');
			data.metadata.language.should.equal('en-US');
			data.metadata.units.should.equal('e');
			data.metadata.status_code.should.equal(200);

			data.observation.should.have.property('imperial'); // because of units = e
			data.observation.imperial.should.have.property('temp').and.is.a.Number();
			data.observation.imperial.should.have.property('altimeter').and.is.a.Number();
			data.observation.imperial.should.have.property('wspd').and.is.a.Number();

			done();
		});

	});

	it('should return data for current conditions with latitude longitude location with metric units', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.units('m').language('en-US').geocode('37.317850,-122.035920').call('observations/current', function (err, data) {
			data.should.be.instanceOf(Object).and.have.property('observation');
			data.metadata.language.should.equal('en-US');
			data.metadata.units.should.equal('m');
			data.metadata.status_code.should.equal(200);

			data.observation.should.have.property('metric'); // because of units = m
			data.observation.metric.should.have.property('temp').and.is.a.Number();
			data.observation.metric.should.have.property('altimeter').and.is.a.Number();
			data.observation.metric.should.have.property('wspd').and.is.a.Number();

			done();
		});
	});

	it('should return data for current conditions with latitude longitude location with hybrid units', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.units('h').language('en-US').geocode('37.317850,-122.035920').call('observations/current', function (err, data) {
			data.should.be.instanceOf(Object).and.have.property('observation');
			data.metadata.language.should.equal('en-US');
			data.metadata.units.should.equal('h');
			data.metadata.status_code.should.equal(200);

			data.observation.should.have.property('uk_hybrid'); // because of units = m
			data.observation.uk_hybrid.should.have.property('temp').and.is.a.Number();
			data.observation.uk_hybrid.should.have.property('altimeter').and.is.a.Number();
			data.observation.uk_hybrid.should.have.property('wspd').and.is.a.Number();

			done();
		});
	});

	it('should return data for 15 day forecast with latitude longitude location', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.units('e').language('en-US').geocode('37.317850,-122.035920').call('forecast/daily/15day', function (err, data) {
			err.should.be.false();

			data.should.be.instanceOf(Object).and.have.property('forecasts');
			data.metadata.language.should.equal('en-US');
			data.metadata.units.should.equal('e');
			data.metadata.status_code.should.equal(200);

			data.forecasts.should.be.Array();
			data.forecasts.length.should.equal(15);
			data.forecasts[0].should.have.property('dow');

			done();
		});
	});

	it('should return data for 15 days of hourly forecast', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.units('e').language('en-US').geocode('37.317850,-122.035920').call('forecast/hourly/360hour', function (err, data) {
			err.should.be.false();

			data.should.be.instanceOf(Object).and.have.property('forecasts');
			data.metadata.language.should.equal('en-US');
			data.metadata.units.should.equal('e');
			data.metadata.status_code.should.equal(200);

			data.forecasts.should.be.Array();
			data.forecasts.length.should.equal(360);
			data.forecasts[0].should.have.property('dow');
			data.forecasts[0].should.have.property('temp');
			data.forecasts[0].should.have.property('hi');
			data.forecasts[0].should.have.property('wc');
			data.forecasts[0].should.have.property('wspd');
			data.forecasts[0].should.have.property('qpf');
			data.forecasts[0].should.have.property('precip_type');
			data.forecasts[0].should.have.property('feels_like');

			done();
		});
	});

	it('should return error because of invalid call method', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.units('h').language('en-US').geocode('37.317850,-122.035920').call('invalid', function (err, data) {
			data.should.be.false();
			err.should.be.instanceOf(Error);
			err.message.should.be.String();
			err.message.should.equal('method is missing');
			done();
		});
	});

	it('should return error because of access denied for invalid api key', function (done) {
		var api = new WeatherApi('invalid');
		api.should.be.instanceOf(WeatherApi);

		api.units('e').language('en-US').geocode('37.317850,-122.035920').call('observations/current', function (err, data) {
			err.should.be.Array();
			err[0].error.message.should.equal('Invalid apiKey.');
			data.should.be.Object();
			data.success.should.Boolean().and.false();
			done();
		});
	});

	it('should return location data from city search', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.search('cupertino', 'city', function (err, data) {
			err.should.be.false();
			data.should.be.Object();
			data.should.have.property('location').and.should.be.Object();
			data.location.should.be.Object().and.have.property('address');
			data.location.address.should.be.Array();
			data.location.city.should.be.Array();

			data.location.city[0].should.equal('Cupertino');

			done();
		});
	});

	it('should return location data from address search', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.search('1 infinite loop, cupertino', 'address', function (err, data) {
			err.should.be.false();
			data.should.be.Object();
			data.should.have.property('location').and.should.be.Object();
			data.location.should.be.Object().and.have.property('address');
			data.location.address.should.be.Array();
			data.location.city.should.be.Array();

			data.location.address[0].should.equal('1 Infinite Loop, Cupertino, California 95014, United States');
			data.location.city[0].should.equal('Cupertino');

			done();
		});
	});

	it('should return point data from geocode search', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.point('geocode', '64.750387,-147.350024', function (err, data) {
			err.should.be.false();
			data.should.be.Object();
			data.should.have.property('location').and.should.be.Object();
			data.location.should.be.Object().and.have.property('city');
			data.location.city.should.be.String().and.equal('North Pole');
			data.location.adminDistrict.should.be.String().and.equal('Alaska');
			data.location.adminDistrictCode.should.be.String().and.equal('AK');
			data.location.ianaTimeZone.should.be.String().and.equal('America/Anchorage');

			done();
		});
	});

	it('should return point data from postalKey search', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.point('postalKey', '30339:US', function (err, data) {
			err.should.be.false();
			data.should.be.Object();
			data.should.have.property('location').and.should.be.Object();
			data.location.should.be.Object().and.have.property('city');
			data.location.city.should.be.String().and.equal('Atlanta');
			data.location.adminDistrict.should.be.String().and.equal('Georgia');
			data.location.adminDistrictCode.should.be.String().and.equal('GA');
			data.location.ianaTimeZone.should.be.String().and.equal('America/New_York');

			done();
		});
	});

	it('should return point data from iataCode search', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.point('iataCode', 'SFO', function (err, data) {
			err.should.be.false();
			data.should.be.Object();
			data.should.have.property('location').and.should.be.Object();
			data.location.should.be.Object().and.have.property('city');
			data.location.city.should.be.String().and.equal('San Francisco');
			data.location.adminDistrict.should.be.String().and.equal('California');
			data.location.ianaTimeZone.should.be.String().and.equal('America/Los_Angeles');

			done();
		});
	});

	it('should return point data from icaoCode search', function (done) {
		var api = new WeatherApi(cachedDevKey);
		api.should.be.instanceOf(WeatherApi);

		api.point('icaoCode', 'YSSY', function (err, data) {
			err.should.be.false();
			data.should.be.Object();
			data.should.have.property('location').and.should.be.Object();
			data.location.should.be.Object().and.have.property('city');
			data.location.city.should.be.String().and.equal('Sydney');
			data.location.adminDistrict.should.be.String().and.equal('New South Wales');
			data.location.ianaTimeZone.should.be.String().and.equal('Australia/Sydney');

			done();
		});
	});
});