# weathercompanyapi-node
`weathercompanyapi-node` is a chainable Node client for accessing The Weather Company API

# Getting Started
```shell
    npm install weathercompanyapi-node
```
## Instantiate
```js
const WeatherAPI = require('weathercompanyapi-node');
const apiKey = '12312314';
var weatherApi = new WeatherAPI(apiKey);
```

## Examples
To get location information for atlanta:
```js
weatherApi.search('atlanta', 'city', function (err, data) {
    console.log('atlanta addresses', data);
);
```

To retrieve current conditions for Sydney, Australia:
```js
weatherApi.location('2020', 'AU').call('observations/current', function (err, data) {
    console.log('conditions', data);
});
```

You can change settings such as `units` and `language` (currently only supports JSON result format).
```js
weatherApi.units('m').language('de-DE').location('2020', 'AU').call('observations/current', function (err, data) {
    console.log('conditions', data);
});
```
The above example results in metric units and German.

## Compatibility
Currently this library is compatible with the `Enhanced Current Conditions` and `Enhanced Forecast` APIs.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
0.0.1 Initial Release

## License
Copyright (c) 2017 Dan Wilson &amp; Skydrop, LLC. Licensed under the MIT license.