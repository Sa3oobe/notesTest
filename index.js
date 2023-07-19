/* CommonJS can be recognized by the use of the require() function and module.exports, without the ("type": "module").
 while ES modules use import and export statements for similar (though not identical) functionality. */

//const http = require('http') // deleted after installing Express
const { response, request } = require('express')
const express = require('express')
const cors = require('cors')
const app = express()
//const mongoose = require('mongoose')

/* ↓↓↓ It's important that dotenv gets imported before the note model is imported.
 This ensures that the environment variables from the .env file are available globally before the code from the other modules is imported. */
require('dotenv').config()

const Note = require('./models/note.js')

//================= RequestLogger middleware ===================================
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
//================= catching requests made to non-existent routes ==============
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

//================= ERROR handler middleware ====================================
// this has to be the last loaded middleware.
//The error handler checks if the error is a CastError exception,
//In all other error situations, the middleware passes the error forward to the default Express error handler.
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'validationError'){
        return response.status(400).json({
            error: error.message
        })
    }
    next(error) // all other error forwarded to the default error handler
}

app.use(cors())
// activate the json-parser In order to access the data easily
app.use(express.json())
// ^^^ this is the json parser, without it request.body would be undefined. we should load it from the begining
app.use(requestLogger)
//++++++++++++++++++++++++++++++
app.use(express.static('build'))
//++++++++++++++++++++++++++++++
//+++mongoos

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// Moved to notes.js in models dir↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
/* const url =
  `mongodb+srv://sab2:sab2123@cluster1.jybvkhn.mongodb.net/noteApp`
/////
mongoose.set('strictQuery', false)
/////
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
}) */

//const Note = mongoose.model('Note', noteSchema) added to note.js

//find out the largest id number in the current list and assign it to the maxId variable.
/* const generatedId = () =>{
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
} */

// hardcoded list of notes in the JSON format
/* let notes = [
    {
        id: 1,    content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2022-05-30T19:20:14.298Z",
        important: true
    }] */

//deleted after installing express
/* const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
}) */
//================we don't want to return the mongo versioning field __v to the frontend.
// ↓↓↓↓↓↓↓ one way is to modify the toJSON method of the schema BY useing set method ↓↓↓↓↓↓↓
/* Even though the _id property of Mongoose objects looks like a string, it is in fact an object.
 The toJSON method we defined transforms it into a string just to be safe. If we didn't make this change,
  it would cause more harm to us in the future once we start writing tests. */

  // Moved to notes.js in models dir↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  /* noteSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
}) */
//  ============ GET request to Root
app.get('/', (request, response) => {
    response.send('<h1>Hello World!!!</h1>')
})

// ============== Get request to api/notes ==================================
app.get('/api/notes' , (request, response) => {
    console.log('====================================');
    console.log('getting all notes');
    console.log('====================================');
    
    Note.find({}).then(notes => {
        response.json(notes)
    })
    // the problem in response== to be continue 
    //response.send(notes)
    //console.log(response.json(notes));
})

// ============== GET request for a single resource ============================
app.get('/api/notes/:id', (request, response, next) => {
    // finding the specified note (with its id)
    //console.log('type of id is: ' + typeof(id));
    Note.findById(request.params.id)
    .then(note => {
        if(note){
            response.json(note)
        } else {
            response.statusMessage = "Unable to find note"
            response.status(404).end()
        }        
    })
    //.catch(error => next(error))    
    .catch(error => {
        console.log(error)
        response.status(400).send({error: 'malformatted id'})
    })
})

// ============= DELETE request for deleting a single resource ===============
app.delete('/api/notes/:id', (request, response, next) => {
    /* const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end() */
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end() //204 No Content
        })
        .catch(error => next(error))
})
//app.use(requestLogger) // this line copied from 154 accourding to (the order of middleware loading from FullStackopen site) need more debugging

//============== POST request for a single resource ============================
app.post('/api/notes/', (request, response, next) => {
    //Without the json-parser, the body property would be undefined. That is way we need it
    const body = request.body
    
    //the content property should not be empty if it is responde with error message
    // ↓↓↓ commented out becouse we used mongoose built-in validation functionality(in schema we use required: true)
    /* if (!body.content) {
        //calling return is crucial, because otherwise the code will execute to the very end and the malformed note gets saved to the application.
        return response.status(400).json({
            error: 'content missing'
        })        
    } */
    //setting the note object
    const note = new Note({
        content: body.content,
        important: body.important || false, //If the important property is missing, we will default the value to false.
        //date: new Date(), //   commented out becouse note model dose note have date and id
        //id: generatedId(),
    })

    //notes= notes.concat(note)  this is if we use hardCoded notes array
    //↓↓The response is sent inside of the callback function for the save operation. This ensures that the response is sent only if the operation succeeded.
    note.save()
        .then(savedNote => {
            response.json(savedNote)
      })
      .catch(error => next(error))
})

//======== PUT request for a single resource for toggling the importance ======
app.put('/api/notes/:id', (request, response, next) => {
    const {content, important} = request.body
  
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id,
        {content, important},
        { new: true, runValidator: true, context: 'query'}
    )
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })

app.use(unknownEndpoint)
app.use(errorHandler)

//================= Listining to PORT ==========================================
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('====================================');
    console.log(`Server running on ${PORT}`);
    console.log('====================================');
})