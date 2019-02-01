require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = require('../models');

// Add a new drink to your list
router.post('/new', (req, res) => {
	db.Drink.create(req.body)
	.then(drink => {
		res.status(200).send(drink)
	})
	.catch(err => {
		console.log('Error!', err);
		res.status(404).send('ERROR!')
	})
});

// We don't need GET routes on the server. We use fetch in the client instead, duh.
router.get('/', (req, res) => {
	db.Drink.find()
	.then(drinks => {
		res.status(200).send(drinks)
	})
	.catch(err => {
		console.log('Error!', err);
		res.status(404).send('ERROR!')
	})
});

// Edit a single drink
router.put('/:id', (req, res) => {
	req.body.drink = JSON.parse(req.body.drink)
	db.Drink.findOneAndUpdate({_id: req.params.id}, req.body, { new: true })
	.then(editedDrink => {
		res.status(200).send(editedDrink)
	})
	.catch(err => {
		console.log('Error!', err);
		res.status(404).send('ERROR!')
	})
});

// Delete route
router.delete('/:id', (req, res) => {
	db.Drink.findOneAndDelete({_id: req.params.id})
	.then(() => {
    	res.status(204).send({ message: 'Successful Deletion' });
  	})
  	.catch(err => {
    	console.log(err);
    	res.status(500).send({ message: 'Server Error' });
  	});
});


module.exports = router;