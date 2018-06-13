const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const chalk = require('chalk');
const config = require('dotenv').config();
const homeController = require('./controllers/home');
const weatherController = require('./controllers/weather');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', homeController.index);
app.get('/weather/:country/:location?', weatherController.index);
app.get('/weather.png?', weatherController.index);
app.use('*', (req, res) => {
    res.sendStatus(404);
});

app.use('/public', express.static(path.join(__dirname, 'public')));


app.listen(app.get('port'), () => {
    console.log(`${chalk.green('✓')} App is running on Port ${app.get('port')}`);
});