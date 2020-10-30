const error  = require('http-errors');
const User   = require('../models/User');
const client = require('../helpers/init_redis');
const { authSchema } = require('../helpers/validation_schema');
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
} = require('../helpers/jwt');

exports.login = async (req, res, next) => {
    try {
        const reqValidate = await authSchema.validateAsync(req.body);
        const user = await User.findOne({email: reqValidate.email});

        if (!user) throw error.NotFound('User not registered.');

        const isMatch = await user.isValidPassword(reqValidate.password);
        if (!isMatch) throw error.Unauthorized('email or password not valid.');
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        return res.status(200).send({ accessToken, refreshToken });
    } catch (e) {
        if (e.isJoi) next(error.BadRequest('Invalid email or password'));
        next(e);
    }
};

exports.register = async (req, res, next) => {
    try {
        const reqValidate = await authSchema.validateAsync(req.body);

        const candidate = await User.findOne({email: reqValidate.email});
        if (candidate) throw error.Conflict(`${reqValidate.email} is already been registered.`);

        const user = new User(reqValidate);
        const savedUser = await user.save();

        const accessToken = await signAccessToken(savedUser.id);
        const refreshToken = await signRefreshToken(savedUser.id);
        return res.status(201).json({ accessToken, refreshToken });
    } catch (e) {
        if (e.isJoi) e.status = 422;
        next(e);
    }
};

exports.refreshToken = async (req, res, next) => {
    console.log('http://localhost/auth/api/refresh-token ');
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw error.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);

        const accessToken = await signAccessToken(userId);
        const refToken = await signRefreshToken(userId);
        return res.send({ accessToken: accessToken, refreshToken: refToken });
    } catch (e) {
        return next(e);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw error.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);
        client.DEL(userId, (err, value) => {
           if (err) {
               console.log('esim-inch error: ', err.message());
               throw error.InternalServerError();
           }
           console.log(value);
           res.sendStatus(204);
        });
    } catch (e) {
        next(e);
    }
}
