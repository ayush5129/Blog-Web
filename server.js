const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
// env config 
dotenv.config();

// router import
const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')
// mongodb connection
connectDB();

// res object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// route
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/blog",blogRoutes);

// static files
app.use(express.static(path.join(__dirname,"./client/build")))
app.get('*', function(req,res){
 res.sendFile(path.join(__dirname, "./client/build/index.html"))
});
// port
const PORT = process.env.PORT || 8080

// listen
app.listen(PORT, () => {
   console.log(`server is listening on port no ${PORT}`.bgCyan.white);
})
