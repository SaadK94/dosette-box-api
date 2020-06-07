const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/passport-jwt', { useMongoClient: true });
mongoose.connection.on('error', (error) => console.log(error));
mongoose.Promise = global.Promise;

require('./middleware/auth');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const authRoutes = require('./routes/auth');
const secureRoutes = require('./routes/secure-routes');
const dosetteRoutes = require('./routes/dosette');

app.use('/', authRoutes);

//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/user', passport.authenticate('decode-jwt', { session: false }), secureRoutes);
app.use('/dosette', passport.authenticate('decode-jwt', { session: false }), dosetteRoutes);
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({ error: err });
});

app.listen(3000, () => {
	console.log('Server started');
});
