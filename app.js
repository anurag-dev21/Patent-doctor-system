require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB   Connected...');
})
.catch(err => {
    console.error(err.message);   

});

const express = require('express');
const app = express();
const path = require('path');
const cookie = require('cookie-parser');
const passport = require('passport');
const passLocal = require('./middlewares/passwpord_loc');
const session = require('express-session');

app.use(express.json());
app.use(express.static('public'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded());

app.use(cookie());

app.use(session({
    name: 'rnw',
    secret: 'rnw',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 100,
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuth);

// authentication
const authRoute = require('./routes/authRoutes');
app.use('/api', authRoute);
app.use('/', ( req, res )=>{
    res.send('welcome and hello');
});

const PORT = process.env.PORT || 8001

app.listen(PORT, ()=>{
    console.log('server is runnig on port :- '+PORT);
});