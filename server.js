require('dotenv').config()
const express = require('express')
const cors = require('cors')
const spotify = require('./spotify-services')
const app = express()
const port = process.env.PORT

var token = null;
var code = null;
const hash = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');

// const SITE_NAME = process.env.SITE_NAME;

const whitelist = [`http://localhost:3000`, 'https://api.spotify.com', 'https://accounts.spotify.com']
const corsOptions = {
    origin: function (origin, callback) {
      
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) === -1) {
        callback(new Error('Not allowed by CORS'))
      }
  
      return callback(null, true)
    }
  };
app.use(cors(corsOptions));

//
// Authorization Methods
//

function login(res) {
    spotify.generateState()
    scope = "user-read-private%20user-read-email%20user-read-currently-playing%20user-read-playback-state"
    url =`https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=${scope}&state=${spotify.getState()}`;
    console.log(url)
    return res.redirect({headers: { "Access-Control-Allow-Origin": "*"}}, url);
}
  

function refreshToken() {
    req = spotify.refreshToken(token, hash)
    updateToken(req)
}

function updateToken(req) {
    let temp =[]
    req.on('data', (d) => {
        temp.push(d)
    }).on('end', () => {
        token = JSON.parse(Buffer.concat(temp).toString())
    })
}

function getToken() {
    var req = spotify.getToken(code, hash, process.env.REDIRECT_URI);
    updateToken(req)
    // res.redirect('/spotify');
}

//
// Entry Point
//

app.get('/', (req, res) => {
    if(!token) {
        console.log("Needing token...")
        return login(res)
    }
    else {
        return res.redirect('/spotify')
    }
})

//
// API Methods
//

// this method has special checks since it is the auth callback
app.get('/spotify', cors(corsOptions), (req, res) => {
    if (!req.query.code && code == null) {
        return login(res)
    }
    if (req.query.code && !token) {
        code = req.query.code;
        getToken()
    }

    req = spotify.getMe(token)

    if(req.statusCode == 401) {
        refreshToken()
        req = spotify.getMe(token)
    }

    req.pipe(res);
})

app.get('/spotify/current', (req, res) => {
    if (code == null) {
        return login(res)
    }
    if(token == null) {
        getToken()
    }
    req = spotify.getPlayer(token)

    if(req.statusCode == 401) {
        refreshToken()
        req = spotify.getPlayer(token)
    }

    req.pipe(res);
})

app.listen(port, () => console.log(`${process.env.APP_NAME} listening on port ${port}!`))
