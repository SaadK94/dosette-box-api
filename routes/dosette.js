const express = require('express');
const router = express.Router();
const DosetteModel = require('../model/DosetteModel');

router.get('/get-by-user', async (req, res) => {
	try {
		const userId = req.user._id;
		const dosette = await DosetteModel.find({ userId });
		return res.json(dosette);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.post('/add-medicine', async (req, res) => {
	const userId = req.user._id;
	if (![ 'morning', 'midDay', 'teaTime', 'bedtime' ].includes(req.body.time)) {
		return res.status(400).send('Invalid time of day given.');
	}
	const addMed = {
		[req.body.time]: [
			{
				name: req.body.name,
				strength: req.body.strength,
				quantity: parseInt(req.body.quantity)
			}
		]
	};
	try {
		const dosette = await DosetteModel.update({ userId }, { $push: addMed });
		return res.json(dosette);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.post('/edit-medicine', async (req, res) => {
	const userId = req.user._id;
	if (![ 'morning', 'midDay', 'teaTime', 'bedtime' ].includes(req.body.time)) {
		return res.status(400).send('Invalid time of day given.');
	}
	const findQuery = {
		userId,
		[`${req.body.time}._id`]: req.body.id
	};

	const updateQuery = {
		$set: {
			[`${req.body.time}.$`]: {
				name: req.body.name,
				strength: req.body.strength,
				quantity: parseInt(req.body.quantity)
			}
		}
	};

	try {
		const dosette = await DosetteModel.update(findQuery, updateQuery);
		return res.json(dosette);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.post('/remove-medicine', async (req, res) => {
	const userId = req.user._id;
	if (![ 'morning', 'midDay', 'teaTime', 'bedtime' ].includes(req.body.time)) {
		return res.status(400).send('Invalid time of day given.');
	}
	const removeMed = {
		[req.body.time]: {
			name: req.body.name,
			_id: req.body.id,
			strength: req.body.strength,
			quantity: parseInt(req.body.quantity)
		}
	};
	try {
		const dosette = await DosetteModel.update({ userId }, { $pull: removeMed });
		return res.json(dosette);
	} catch (error) {
		return res.status(500).json(error);
	}
});

module.exports = router;
