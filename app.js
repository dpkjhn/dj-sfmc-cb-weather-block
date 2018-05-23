const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv');

const homeController = require('./controllers/home');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', homeController.index);

app.listen(app.get('port'), () => {
    console.log(`${chalk.green('✓')} App is running on Port ${app.get('port')}`);
})