/**
 * The Weather Company Data API
 *
 * @author Dan Wilson
 * @copyright 2017 Skydrop, LLC
 * @licence MIT (see LICENCE)
 */

const request = require('request'),
	_ = require('lodash');

var WeatherAPI = function (key) {
	"use strict";

	var self = this;

	/**
	 * Location (geo or postal)
	 * @type {string}
	 */
	self.query = '';

	/**
	 * API Method Call (observations/current, forecast/daily/5day, etc)
	 * @type {string}
	 */
	self.method = '';

	/**
	 * API Version
	 * - This will be altered depending on the API call
	 * @type {string}
	 */
	self.apiVersion = 'v1';

	/**
	 * Default settings
	 *
	 * @type {{format: string, units: string}}
	 */
	self.options = {
		apiKey : key,
		format : 'json', // only support json for now
		units : 'e',
		language : 'en-US'
	};

	/**
	 * Set the unit type (e = english, m = metric, h = hybrid [UK])
	 * @param unit {string}
	 * @returns {WeatherAPI}
	 */
	self.units = function (unit) {
		if (unit === 'e' || unit === 'm' || unit === 'h') {
			self.options.units = unit;
		}
		return this;
	};

	/**
	 * Set the language
	 * @param lang {string}
	 * @returns {WeatherAPI}
	 */
	self.language = function (lang) {
		self.options.language = lang.trim();
		return this;
	};

	/**
	 * Set location as a lat/lng to geocode
	 *
	 * @param lat {string}
	 * @param [lng] {string}
	 * @returns {WeatherAPI}
	 */
	self.geocode = function (lat, lng) {
		if (lat.indexOf(',')) {
			var parts = lat.split(',');
			lat = parts[0].trim();
			lng = parts[1].trim();
		}
		self.query = 'geocode/' + lat + '/' + lng;
		return this;
	};

	/**
	 * Set location as a postal/country code
	 *
	 * @param postal {string}
	 * @param country {string}
	 * @returns {WeatherAPI}
	 */
	self.location = function (postal, country) {
		self.query = 'location/' + postal.trim() + ':4:' + country.trim();
		return this;
	};

	/**
	 * Get a specific point location
	 *
	 * @param key {string}
	 * @param value {string}
	 * @returns {WeatherAPI}
	 */
	self.point = function (key, value, cb) {
		self.query = 'point?' + key + '=' + value;
		self.apiVersion = 'v3';
		return self._request(cb);
	};

	/**
	 * Search for a location
	 *
	 * @param query {string}
	 * @param locationType {string}
	 * @param cb {function}
	 * @returns {*}
	 */
	self.search = function (query, locationType, cb) {
		self.query = 'search?query=' + query + '&locationType=' + locationType;
		self.apiVersion = 'v3';
		return self._request(cb);
	};

	/**
	 * Call the API method
	 *
	 * @param method {string}
	 * @param callback {function}
	 * @returns {*}
	 */
	self.call = function (method, callback) {
		// just a little validation
		switch (method) {
			case 'forecast/daily/15day':
			case 'observations/current':
				self.method = method;
				break;
			default:
				// console.error('invalid method call', method);
		}
		return self._request(callback);
	};

	/**
	 * Handles the actual request to the API
	 *
	 * @param callback {function}
	 * @returns {*}
	 * @private
	 */
	self._request = function (cb) {

		var url = 'https://api.weather.com/' + self.apiVersion + '/';

		if (self.apiVersion === 'v1') {
			if (!self.method) {
				cb.call(self, new Error('method is missing'), false);
				return false;
			}

			url += self.query + '/' + self.method + '.' + self.options.format + '?' + self._formatParams('format');
		} else if (self.apiVersion === 'v3') {
			url += 'location/' + self.query + '&' + self._formatParams('units');
		}

		// Request the url
		request(url, function (error, response, body) {
			var json = false;
			if (!error) {
				error = false;
				try {
					json = JSON.parse(body);
					if (_.has(json, 'success') && !json.success) {
						// console.error('HTTP Error in request', json.success, response.statusCode, json.errors);
						error = json.errors;
					}
				} catch (err) {
					// console.error('Exception caught in JSON.parse', body);
					error = err;
				}
			}
			cb.call(self, error, json);
		});

	};

	/**
	 * Format the params for the query string
	 *
	 * @param {array|string} [exclude]
	 * @returns {string}
	 * @private
	 */
	self._formatParams = function (exclude) {
		var results = [];
		if (_.isString(exclude)) {
			exclude = [exclude];
		}
		_.each(self.options, function (val, key) {
			if (!exclude || exclude.length === 0 || _.indexOf(exclude, key) < 0) {
				results.push(key + '=' + val);
			}
		});
		return results.join('&');
	}
};

module.exports = WeatherAPI;