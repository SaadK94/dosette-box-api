const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/UserModel');
const DosetteModel = require('../model/DosetteModel');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
	'signup',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const existingUser = await UserModel.findOne({ email });
				if (existingUser) {
					return done(null, false, { message: 'Email already in use' });
				}
				const user = await UserModel.create({ email, password });
				const dosette = await DosetteModel.create({ userId: user._id });
				return done(null, { user, dosette }, { message: 'Signup successful' });
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	'login',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const user = await UserModel.findOne({ email });
				if (!user) {
					return done(null, false, { message: 'Email not found' });
				}
				const validate = await user.isValidPassword(password);
				if (!validate) {
					return done(null, false, { message: 'Incorrect password' });
				}
				return done(null, user, { message: 'Logged in Successfully' });
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.use(
	'decode-jwt',
	new JWTstrategy(
		{
			secretOrKey: 'top_secret',
			jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
		},
		async (token, done) => {
			try {
				return done(null, token.user);
			} catch (error) {
				done(error);
			}
		}
	)
);
