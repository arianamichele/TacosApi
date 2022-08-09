// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

const Taco = require('../models/taco')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /tacos
router.get('/tacos', (req, res, next) => {
	Taco.find()
		.then((tacos) => {
			return tacos.map((taco) => taco.toObject())
		})
		.then((tacos) => res.status(200).json({ tacos: tacos }))
		.catch(next)
})

// SHOW
// GET 
router.get('/tacos/:id', (req, res, next) => {
	Taco.findById(req.params.id)
		.populate('owner')
		.then(handle404)
		.then((taco) => res.status(200).json({ taco: taco.toObject() }))
		.catch(next)
})

// CREATE
// POST 
router.post('/tacos', requireToken, (req, res, next) => {
	req.body.taco.owner = req.user.id
	Taco.create(req.body.taco)
		.then((pet) => {
			res.status(201).json({ taco: Taco.toObject() })
		})
		.catch(next)
})

// UPDATE
// PATCH 
router.patch('/tacos/:id', requireToken, removeBlanks, (req, res, next) => {
	delete req.body.taco.owner

	Taco.findById(req.params.id)
		.then(handle404)
		.then((pet) => {
			requireOwnership(req, pet)
			return taco.updateOne(req.body.taco)
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

// DESTROY
// DELETE 
router.delete('/tacos/:id', requireToken, (req, res, next) => {
	Taco.findById(req.params.id)
		.then(handle404)
		.then((taco) => {
			requireOwnership(req, taco)
			taco.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router