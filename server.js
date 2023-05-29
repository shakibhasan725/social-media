const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const expressLayouts = require('express-ejs-layouts');
const userRoute = require('./routers/user');
const cookieParser = require('cookie-parser');
const mongoDBConnection = require('./config/db');
const session = require('express-session');
const multer = require('multer');
const localsMiddlewares = require('./middlewares/localsMiddlewares');

//envirenment verriable

dotenv.config();

const PORT = process.env.port || 9000;






// init express




const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//express session 


app.use(session({
    secret: "i love mern",
    saveUninitialized: true,
    resave: false
}));


app.use(localsMiddlewares);


//EJS init

app.set('view engine', 'ejs');

app.use(expressLayouts);

app.set('layout', 'layouts/app');

//use static folder 

app.use(express.static('public'));





app.use(userRoute);










app.listen(PORT, () => {
    mongoDBConnection();
    console.log(`server is running on port ${PORT}`.bgGreen.black)
});