const request = require('request');

var spotify = {
    state: "",

    getToken: function(auth_code, hash, redirect_uri) {
        const options = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${hash}`
            },
            form: {
                grant_type: "authorization_code",
                code: auth_code,
                redirect_uri: redirect_uri
            }
        }
        
        let temp = []
        return request.post(options, function (err, resp, body) {
            console.log(body)
        }).on('data', (d) => {
            temp.push(d)
        }).on('end', () => {
            temp = JSON.parse(Buffer.concat(temp).toString())
        })
    },

    getMe: function(token) {
        const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': `${token.token_type} ${token.access_token}`
            }
        }
        
        return request.get(options)
    },

    getPlayer: function(token) {
        const options = {
            url: 'https://api.spotify.com/v1/me/player',
            headers: {
                'Authorization': `${token.token_type} ${token.access_token}`
            }
        }
        
        return request.get(options)
    },

    refreshToken: function(token, hash) {
        const options = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${hash}`
            },
            form: {
                grant_type: "refresh_token",
                refresh_token: `${token.refresh_token}`
            }
        }
        
        return request.post(options)

    },

    generateState: function() {
        this.state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },

    getState: function() {
        return this.state;
    }
}

module.exports = spotify;