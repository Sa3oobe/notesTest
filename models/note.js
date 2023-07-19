const mongoose = require('mongoose')
require('dotenv').config()


mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
//note schema dose not have date and id
const noteSchema = new mongoose.Schema({
  content: {
    type:String,
    minlength : [5,'content should be at least five characters long'],
    required: true,
  },
  important: Boolean,
  //date: new Date(),
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Note', noteSchema)