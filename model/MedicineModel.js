const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicineSchema = new Schema({
	name: String
});

const MedicineModel = mongoose.model('medicine', MedicineSchema, 'medicines');
module.exports = MedicineModel;
