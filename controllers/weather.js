const webshot = require('webshot');
const path = require('path');
const rp = require('request-promise-native');

const locationInfo = {
    location: 'London',
    country: 'UK',
    type: '1day',
    units: 'metric',
    weather: {}
};

let createImage = (htmlContent, cb) => {
    let stream = webshot(htmlContent, {
        siteType: 'html'
    });

    stream.on('data', data => {
        cb(data);
    });
};

let fetchWeather = async(location, country, units) => {
    const url = `http://api.openweathermap.org/data/2.5/weather`;

    let queryByCityName = `q=${location},${country}&units=${units}&appid=${process.env.OPENWEATHER_API}`;
    let queryByCityId = `q=${location},${country}&units=${units}&appid=${process.env.OPENWEATHER_API}`;
    let queryByZip = `zip=${location},${country}&units=${units}&appid=${process.env.OPENWEATHER_API}`;

    let weatherRequest = url.concat('?', queryByCityName);
    let weather = {};

    try {
        weather = await rp(weatherRequest);
        return weather;
    } catch (err) {
        console.log(err.message);
        return {};
    }
}

exports.index = async(req, res) => {
    let str = 'Error fetching weather!!';

    try {
        let weather = JSON.parse(await fetchWeather(req.params.location, req.params.country, 'metric'));

        str = `<html><body>Weather for <b>${weather.name} </b> is <b>${weather.main.temp} </b></body></html>`;

        createImage(str, (stream) => {
            var img = new Buffer(stream, 'base64');

            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });

            res.end(img);
        });
    } catch (err) {
        console.log(str);
    }
};