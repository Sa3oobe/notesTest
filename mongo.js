const mongoose = require('mongoose')
//checks if the password to dataBase is provided or not.
/* if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} */
// accessing the password provided in comand line. not used in url variable.
const password = process.argv[2]

const url = `mongodb+srv://sab2:sab2123@cluster1.jybvkhn.mongodb.net/newApp2?retryWrites=true&w=majority` //noteApp?retryWrites=true&w=majority` this is part of the previous url to atlas database


mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')
    
    /* const note = new Note({
      content: 'new note after monthes',
      date: new Date(),
      important: true,
    }) */
    //.save() is a methode part of the model witch is inherated by note object
    return note.save()
  })
  .then(() => {
    console.log('note saved!')
    //If the connection is not closed, the program will never finish its execution.
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))
  // inside the {} is the condition for find, here it desplays all notes
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })