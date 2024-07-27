const express = require("express");
const dotenv = require("dotenv").config();
const cookie = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose")
const app = express();

const PORT = process.env.PORT || 4000

const sessionKey = process.env.SESSIONKEY
const cookieKey = process.env.COOKIEKEY
const MONGOURL = process.env.MONGOURL

mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("connected to mongodb")).catch((err)=>{console.error("unable to connect to mongodb cluster")})

//Middleware to parse cookies with secret-key to the browser.
app.use(cookie(cookieKey))


//Middleware config to set cookies.
app.use(session({
    secret: sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie:{secure: false},
    store: new MongoStore({
        mongoUrl: MONGOURL,
        collectionName: 'sessions'
    })
}))

app.get('/', (req, res) => res.status(200).json({message: "Home Page."}))

//Route to set new session.
app.get('/session', (req, res) => {

    //The session middleware creates a 'session' property in the request object.
    req.session.user = {
        UUID: '12234-2345-2323423',
        name: "John Doe"
    }
    req.session.email = "dummymail@gmail.com"

    req.session.save((err) => {
        if(err){
            console.error(err)
        } else {
            res.status(200).json({message: `New session data: ${req.session.email}`});
        }
    })
})

//Route to set cookie.
app.get('/cookie', (req, res) => {
    res.cookie('email', 'samplemail@hotmail.com', {
        maxAge: 900000,
        httpOnly: true
    })
    res.status(200).json({message: "cookie set successfully!"})
})

//Route to get cookie.
app.get('/get-cookie', (req, res) => {
    const email = req.cookies.email
    res.status(200).send(`cookie: ${email}`)
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))