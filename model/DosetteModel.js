const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DosetteSchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		unique: true
	},
	morning: [
		{
			name: String,
			strength: String,
			quantity: Number
		}
	],
	midDay: [
		{
			name: String,
			strength: String,
			quantity: Number
		}
	],
	teaTime: [
		{
			name: String,
			strength: String,
			quantity: Number
		}
	],
	bedtime: [
		{
			name: String,
			strength: String,
			quantity: Number
		}
	]
});

const DosetteModel = mongoose.model('dosette', DosetteSchema);
module.exports = DosetteModel;
