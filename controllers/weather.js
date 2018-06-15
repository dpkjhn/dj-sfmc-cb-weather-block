const path = require('path');
const {
    promisify
} = require('util');
const fs = require('fs');
const rp = require('request-promise-native');
const ci = require('../lib/createImage');
const st = require('../lib/createMarkup');

const readFileAsync = promisify(fs.readFile);

const defaultWeatherInfo = {
    location: 'London',
    zip: 'EC2N 4AY',
    cityid: '',
    country: 'UK',
    units: 'metric',
    temp: '',
    tempStr: '',
    icon: '',
    type: '1day'
};




let fetchWeather = async(weatherInfo) => {
    const url = `http://api.openweathermap.org/data/2.5/weather`;

    let queryByCityName = `q=${weatherInfo.location}&units=${weatherInfo.units}`;
    let queryByCityId = `q=${weatherInfo.location}&units=${weatherInfo.units}`;
    let queryByZip = `zip=${weatherInfo.zip}&units=${weatherInfo.units}`;

    let query = '';

    if (weatherInfo.zip) {
        query = queryByZip;
    } else if (weatherInfo.cityid) {
        query = queryByCityId;
    } else {
        query = queryByCityName;
    }

    console.log(query);

    // console.log(queryByCityName);

    let weatherRequest = url.concat('?', query, `&appid=${process.env.OPENWEATHER_API}`);
    let weather = defaultWeatherInfo;

    try {
        let res = await rp(weatherRequest);

        let owResponse = JSON.parse(res);
        // console.log(owResponse);

        weather.country = owResponse.sys.country;
        weather.location = owResponse.name;
        weather.tempStr = `${Math.ceil(owResponse.main.temp)} ${weatherInfo.units === 'metric' ? '&#x2103': '&#8457'}`;
        weather.temp = Math.ceil(owResponse.main.temp);
        weather.icon = `http://openweathermap.org/img/w/${owResponse.weather[0].icon}.png`;
        weather.zip = weatherInfo.zip || '';
        weather.cityid = owResponse.sys.id;


        console.log(weather);

        return weather;
    } catch (err) {
        console.log('Error fetching weather: ' + err.message);
        throw err;
    }
}

let parseTemplate = (template, attr) => {

    let templatePath = path.join(__dirname, `../public/templates/${template}.html`);
    console.log('PATH: ' +
        __dirname);


    return readFileAsync(templatePath.toLowerCase(), 'utf8').then((text) => {
        return st.createMarkup(text, attr);
    });
}


exports.index = async(req, res) => {
    let str = 'Error fetching weather!!';
    let img = '';

    let weather = {
        location: req.query.loc,
        zip: req.query.zip,
        cityid: req.query.cityid,
        units: req.query.units
    };

    try {
        weather = await fetchWeather(weather);
    } catch (err) {
        console.log(err);
        str = err;
    }

    try {
        str = await parseTemplate(req.query.template, weather);
    } catch (err) {
        console.log('Error parsing template!' + err);
    }

    try {
        console.time("createHtmlImage");
        img = await ci.createHtmlImage(str, 200, 200);
        console.timeEnd("createHtmlImage");

        res.contentType('image/png');
        res.contentLength = img.length;
        res.end(img);

    } catch (err) {

        console.log('Error creating image!' + err);
    }

};