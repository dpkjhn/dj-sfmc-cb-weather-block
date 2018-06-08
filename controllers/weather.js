const path = require('path');
const {
    promisify
} = require('util');
const fs = require('fs');
const rp = require('request-promise-native');
const ci = require('../lib/createImage');
const st = require('../lib/createMarkup');

const readFileAsync = promisify(fs.readFile);

const locationInfo = {
    location: 'London',
    country: 'UK',
    type: '1day',
    units: 'metric',
    weather: {}
};




let fetchWeather = async(location, country, units) => {
    const url = `http://api.openweathermap.org/data/2.5/weather`;

    let queryByCityName = `q=${location},${country}&units=${units}&appid=${process.env.OPENWEATHER_API}`;
    let queryByCityId = `q=${location},${country}&units=${units}&appid=${process.env.OPENWEATHER_API}`;
    let queryByZip = `zip=${location},${country}&units=${units}&appid=${process.env.OPENWEATHER_API}`;

    // console.log(queryByCityName);

    let weatherRequest = url.concat('?', queryByCityName);
    let weather = {};

    try {
        weather = await rp(weatherRequest);
        // console.log(weather);

        return JSON.parse(weather);
        // return weather;
    } catch (err) {
        console.log(err.message);
        return {};
    }
}

let parseTemplate = (template, attr) => {

    return readFileAsync(path.join(__dirname, `../public/${template}.html`), 'utf8').then((text) => {
        return st.createMarkup(text, attr);
    });
}


exports.index = async(req, res) => {
    let str = 'Error fetching weather!!';

    try {
        let weather = await fetchWeather(req.query.location, req.query.country, 'metric');
        // str = `<html><body>Weather for <b>${weather.name} </b> is <b>${weather.main.temp} </b></body></html>`;

        str = await parseTemplate('template1', weather);

        console.log(str);


        let img = await ci.createHtmlImage(str, 200, 200);

        res.contentType('image/png');
        res.contentLength = img.length;
        res.end(img);

    } catch (err) {
        console.log(err);
    }
};