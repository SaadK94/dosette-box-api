const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const app = express();
// TODO: Add config library

const mongoConnUri = process.env.MONGO_CONN_URI || 'mongodb://127.0.0.1:27017';
const databaseName = process.env.DATABASE_NAME || 'dosette-app';
const uri = `${mongoConnUri}/${databaseName}`;

mongoose.connect(uri, { useMongoClient: true });
mongoose.connection.on('error', (error) => console.log(error));

// TODO: Understand if this should sit here or elsewhere
require('./lib/passport');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const authRoutes = require('./routes/auth');
const dosetteRoutes = require('./routes/dosette');
const medicineRoutes = require('./routes/medicine');

app.use('/', authRoutes);

// TODO: Have doesette to be empty and ask the user to create a new once, which will become blank.
// - Provide it a name
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/dosette', passport.authenticate('decode-jwt', { session: false }), dosetteRoutes);
app.use('/medicine', passport.authenticate('decode-jwt', { session: false }), medicineRoutes);

// Server set up
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({ error: err });
});

app.listen(3000, () => {
	console.log('Server started');
});
