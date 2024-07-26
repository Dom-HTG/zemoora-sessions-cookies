const express = require("express")
const dotenv = require("dotenv").config()
const session = require("express-session")
const app = express()

const PORT = process.env.PORT || 4000
const sessionKey = process.env.SESSIONKEY

//Middleware config to set cookies.
app.use(session({
    secret: sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie:{secure: false}
}))

app.get('/', (req, res) => res.status(200).json({message: "Home Page."}))

//route to set new session.
app.get('/cart', (req, res) => {

    //The session middleware creates a 'session' property in the request object.
    req.session.email = "dummymail@gmail.com"

    res.status(200).json({message: `New session data: ${req.session.email}`});
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))