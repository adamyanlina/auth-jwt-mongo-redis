const JWT = require('jsonwebtoken');
const error = require('http-errors');
const client = require('./init_redis');
const { tokens } = require('../config/keys');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = tokens.ACCESS_SECRET_TOKEN;
            const options = {
                expiresIn: '60s',
                audience: userId,
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) reject(err);
                resolve(token);
            });
        });
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(error.Unauthorized());
        const token = req.headers['authorization'].split(' ')[1];
        JWT.verify(token, tokens.ACCESS_SECRET_TOKEN, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebToken' ? 'Unauthorized' : err.message;
                return next(error.Unauthorized(message));
            }
            req.payload = payload;
            return next();
        });
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = tokens.REFRESH_SECRET_TOKEN;
            const options = {
                expiresIn: '1y',
                audience: userId,
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message());
                    reject(error.InternalServerError());
                }
                client.set(userId, token, 'EX', 365 * 24 * 60 * 60, (err, replay) => {
                    if (err) {
                        console.log(err.message);
                        reject(error.InternalServerError());
                        return
                    }

                    resolve(token);

                });

                resolve(token);
            });
        });
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, tokens.REFRESH_SECRET_TOKEN, (err, payload) => {
                if (err) return reject(error.Unauthorized());
                const userId = payload.aud;
                client.GET(userId, (err, result) => {
                    if (err) {
                        console.log(err.message());
                        return reject(error.InternalServerError());
                    }

                    if (refreshToken === result) return resolve(userId);
                    reject(error.Unauthorized());
                });

            });
        });
    }

};
