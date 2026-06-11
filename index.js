// IMPORTS
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

// Import CORS
const cors = require("cors");

const userRoutes = require(`./routes/user`);
const movieRoutes = require(`./routes/movie`);

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection; 

db.on("error", console.error.bind(console, "connection error"));

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.')); 

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:8000'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);


if(require.main === module){
    app.listen(process.env.PORT || 3000, () => console.log(`Server running at port ${process.env.PORT || 3000}`));
}

module.exports = {app, mongoose};