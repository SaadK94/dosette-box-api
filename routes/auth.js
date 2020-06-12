const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const signUp = async (req, res, next) => {
	passport.authenticate('signup', async (err, user, info) => {
		try {
			if (err || !user) {
				const error = new Error('An Error occurred');
				return res.status(400).json({ message: info.message });
			}
			res.json({
				message: info.message,
				user: user.user,
				dosette: user.dosette
			});
		} catch (error) {
			return next(error);
		}
	})(req, res, next);
};

router.post('/signup', signUp);

const signJWT = async (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {
		try {
			if (err || !user) {
				const error = new Error('An Error occurred');
				return res.status(400).json({ message: info.message });
			}
			req.login(user, { session: false }, async (error) => {
				if (error) return next(error);
				//We don't want to store the sensitive information such as the
				//user password in the token so we pick only the email and id
				const body = { _id: user._id, email: user.email };
				//Sign the JWT token and populate the payload with the user email and id
				const token = jwt.sign({ user: body }, 'top_secret');
				//Send back the token to the user
				return res.json({
					token,
					message: info.message
				});
			});
		} catch (error) {
			return next(error);
		}
	})(req, res, next);
};

router.post('/login', signJWT);

module.exports = router;
