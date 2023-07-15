require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
mongoose.connect(process.env.MONGOCONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
 
  
app.use(express.json())

app.use(express.static(path.join(__dirname,'public')))
app.use(cors())
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const docotRoute = require('./routes/doctorRoute')
app.use('/',userRoute)
app.use('/admin',adminRoute)
app.use('/doctor',docotRoute)

app.listen(4001,()=>{
    console.log(`port running at ${4001} port`);
})