const connectToMongo = require('./db')
const express = require('express')

connectToMongo()
const app = express()
const port = 5000

app.use(express.json())

//AVAILABLE ROUTES

// app.get('/', (req, res) => {
//     res.send('Hello Harshit!')
// })


app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))



app.listen(port, () => {
    console.log(`iNotebook Backend listening on port http://localhost:${port}`)
})