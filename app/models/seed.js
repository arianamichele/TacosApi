// seed.js is going to be the file we run, whenever we want to seed our database, we'll create a bunch of pets at once.

// we want to be careful with this, because when we run it, it'll delete all of the pets in the db. 

// we can modify this later, to only delete pets that don't have an owner already, but we'll keep it simple for now.

const mongoose = require('mongoose')
const Taco = require('./taco')
const db = require('../../config/db')

const startTacos = [
    { name: 'Ariana', type: 'carne', salsa: true},
    { name: 'Briana', type: 'pastor', salsa: true},
    { name: 'Keanu', type: 'shrimp', salsa: true},
    { name: 'Kahlua', type: 'carnitas', salsa: true}
]

// first we need to connect to the database
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        Taco.deleteMany({ owner: null })
            .then(deletedTacos => {
                console.log('deletedTacos', deletedTacos)
                Taco.create(startTacos)
                    .then(newTacos => {
                        console.log('the new tacos', newTacos)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })