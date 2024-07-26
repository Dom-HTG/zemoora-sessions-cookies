const express = require("express")
const dotenv = require("dotenv").config()
const cookie = require("cookie-parser")
const session = require("express-session")
const app = express()

const PORT = process.env.PORT || 4000

const sessionKey = process.env.SESSIONKEY
const cookieKey = process.env.COOKIEKEY

//Middleware to parse cookies with secret-key to the browser.
app.use(cookie(cookieKey))

//Middleware config to set cookies.
app.use(session({
    secret: sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie:{secure: false}
}))

app.get('/', (req, res) => res.status(200).json({message: "Home Page."}))

//Route to set new session.
app.get('/session', (req, res) => {

    //The session middleware creates a 'session' property in the request object.
    req.session.email = "dummymail@gmail.com"

    res.status(200).json({message: `New session data: ${req.session.email}`});
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