const express = require('express');
const dotenv = require('dotenv').config();
const cookie = require('cookie-parser');
const session = require('express-session');
const redis = require('redis');
const connect_redis = require('connect-redis');

const app = express();

const PORT = process.env.PORT || 4000
const sessionKey = process.env.SESSIONKEY
const cookieKey = process.env.COOKIEKEY
const redisPass = process.env.REDISPASS

//create and connect redis client.
const RedisStore = connect_redis(session);

const redisClient = redis.createClient({
    password: redisPass,
    socket: {
        host: 'redis-14601.c10.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 14601
    }
});

redisClient.on('error', (err) => console.error("unable to connect to redis", err))
redisClient.on('connect', () => console.log("redis connected successfully"))

//Middleware to parse cookies with secret-key to the browser.
app.use(cookie(cookieKey))

//Middleware config to set cookies.
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie:{secure: false}
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