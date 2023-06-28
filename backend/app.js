const express =require('express');
const app = express();

const errorMiddleware = require('./middlewares/errors')

app.use(express.json());

//Import all routes
const products = require('./routes/product');
const userRoute = require('./routes/userRoute')

app.use('/api/v1', products)
app.use('/api/v1', userRoute)

//Middlewares to handle errors
app.use(errorMiddleware);

module.exports = app