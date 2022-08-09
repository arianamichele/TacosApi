const express = require('express')
const passport = require('passport')

const Taco = require('../models/taco')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// ROUTES GO HERE
// we only need three, and we want to set them up using the same conventions as our other routes, which means we might need to refer to those other files to make sure we're using our middleware correctly

// POST 
// POST 
router.post('/salsas/:tacoId', removeBlanks, (req, res, next) => {
    const salsa = req.body.salsa
    const tacoId = req.params.tacoId
    Taco.findById(tacoId)
        .then(handle404)
        .then(taco => {
            console.log('this is the taco', taco)
            console.log('this is the salsa', salsa)
            taco.salsas.push(salsa)
            return taco.save()
            
        })
        .then(taco => res.status(201).json({ taco: taco }))
        .catch(next)
})

// UPDATE 
// PATCH 
router.patch('/salsas/:tacoId/:salsaId', requireToken, removeBlanks, (req, res, next) => {
    const tacoId = req.params.tacoId
    const salsaId = req.params.salsaId

    Taco.findById(tacoId)
        .then(handle404)
        .then(taco => {
            const theSalsa = taco.salsas.id(salsaId)
            requireOwnership(req, taco)
            theSalsa.set(req.body.salsa)
            return taco.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DELETE 
// DELETE 
router.delete('/salsas/:tacoId/:salsaId', requireToken, (req, res, next) => {
    const tacoId = req.params.tacoId
    const salsaId = req.params.salsaId
    Taco.find(tacoId)
        .then(handle404)
        .then(taco => {
            const theSalsa = taco.salsas.id(salsaId)
            requireOwnership(req, taco)
            theSalsa.remove()
            return taco.save()
        })
        // send 204 no content status
        .then(() => res.sendStatus(204))
        // handle errors
        .catch(next)
})

// export the router
module.exports = router