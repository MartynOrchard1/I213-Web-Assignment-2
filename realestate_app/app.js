const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Connect To DB
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'realestate'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MYSQL');
});

// Setup handlebars
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

// Stat Folder
app.use(express.static('public'));

// Parse To Body
app.use(express.urlencoded({ extended: true }));

// Setup The Routes
app.use('/', require('./routes/index.js'));

// PORT 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});