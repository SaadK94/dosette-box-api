const express = require('express');
const router = express.Router();
const MedicineModel = require('../model/MedicineModel');

router.get('/search', async (req, res) => {
	try {
		const search = req.query.search;
		const results = await MedicineModel.find({ name: { $regex: search, $options: 'i' } }).limit(10);
		return res.json(results);
	} catch (error) {
		return res.status(500).json(error);
	}
});

module.exports = router;
