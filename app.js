const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const app = express();

const mongoConnUri = process.env.MONGO_CONN_URI || 'mongodb://127.0.0.1:27017';
const databaseName = process.env.DATABASE_NAME || 'dosette-app';
const uri = `${mongoConnUri}/${databaseName}`;

mongoose.connect(uri, { useMongoClient: true });
mongoose.connection.on('error', (error) => console.log(error));

require('./lib/passport');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const authRoutes = require('./routes/auth');
const dosetteRoutes = require('./routes/dosette');
const medicineRoutes = require('./routes/medicine');

app.use('/', authRoutes);
app.use('/dosette', passport.authenticate('decode-jwt', { session: false }), dosetteRoutes);
app.use('/medicine', passport.authenticate('decode-jwt', { session: false }), medicineRoutes);

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({ error: err });
});

app.listen(3000, () => {
	console.log('Server started');
});
