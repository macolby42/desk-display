require('dotenv').config()
const express = require('express')
const cors = require('cors')
const spotify = require('./spotify-services')
const app = express()
const port = 5000

var token = null;
var hash = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')

var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));
  

function refreshToken() {
    req = spotify.refreshToken(token, hash)
    updateToken(req)
}

function updateToken(req) {
    req.on('data', (d) => {
        token = JSON.parse(d.toString())
    })
}

//
// Entry Point
//

app.get('/', (req, res) => {
    if(token == null || token == undefined) {
        res.redirect('/code')
    }
    else {
        res.redirect('/spotify')
    }
})

//
// API Methods
//

app.get('/spotify', (req, res) => {
    if(token == null) {
        return res.redirect('/code')
    }
    req = spotify.getMe(token)

    if(req.statusCode == 401) {
        refreshToken()
        return res.redirect('/spotify')
    }

    req.pipe(res);
})

app.get('/spotify/current', (req, res) => {
    if(token == null) {
        return res.redirect('/code')
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

app.get('/code', (req, res) => {
    spotify.generateState()
    scope = "user-read-private%20user-read-email%20user-read-currently-playing%20user-read-playback-state"
    url =`https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=${scope}&state=${spotify.getState()}`;
    res.redirect(url);
})

app.get('/token', (req, res) => {
    req = spotify.getToken(req.query.code, hash, process.env.REDIRECT_URI);
    updateToken(req)
    res.redirect('/spotify');
})

app.listen(port, () => console.log(`${process.env.APP_NAME} listening on port ${port}!`))
