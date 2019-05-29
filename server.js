require('dotenv').config()
const express = require('express')
const cors = require('cors')
const spotify = require('./spotify-services')
const app = express()
const port = process.env.PORT

var token = null;
var code = null;
const hash = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');

const SITE_NAME = process.env.SITE_NAME;

const whitelist = [`http://${SITE_NAME}:3000`, `http://${SITE_NAME}:5000`, 'https://api.spotify.com', 'https://accounts.spotify.com']
app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      callback(new Error('Not allowed by CORS'))
    }

    return callback(null, true)
  }
}));
  

function refreshToken() {
    req = spotify.refreshToken(token, hash)
    updateToken(req)
}

function updateToken(req) {
    req.on('data', (d) => {
        token = JSON.parse(d.toString())
    })
}

function getToken() {
    req = spotify.getToken(code, hash, process.env.REDIRECT_URI);
    updateToken(req)
    // res.redirect('/spotify');
}

//
// Entry Point
//

app.get('/', (req, res) => {
    if(!token) {
        return res.redirect('/login')
    }
    else {
        return res.redirect('/spotify')
    }
})

//
// API Methods
//

app.get('/spotify', (req, res) => {
    if (code == null) {
        return res.redirect('/login')
    }
    if(token == null) {
        code = req.query.code;
        getToken()
    }
    req = spotify.getMe(token)

    if(req.statusCode == 401) {
        refreshToken()
        return res.redirect('/spotify')
    }

    req.pipe(res);
})

app.get('/spotify/current', (req, res) => {
    if (code == null) {
        return res.redirect('/login')
    }
    if(token == null) {
        code = req.query.code;
        getToken()
    }
    req = spotify.getPlayer(token)

    if(req.statusCode == 401) {
        refreshToken()
        return res.redirect('/spotify/current')
    }

    req.pipe(res);
})

//
// Authorization Methods
//

app.get('/login', (req, res) => {
    spotify.generateState()
    scope = "user-read-private%20user-read-email%20user-read-currently-playing%20user-read-playback-state"
    url =`https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=${scope}&state=${spotify.getState()}`;
    res.redirect(url);
})

app.listen(port, () => console.log(`${process.env.APP_NAME} listening on port ${port}!`))
