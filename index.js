const express = require("express");
const cors = require('cors');
const app = express();
const {dbConnect} = require('./db');
const rootRouter = require("./routes");
const jwt = require('jsonwebtoken');




app.use(cors());
app.use(express.json());
app.use('/api/v1', rootRouter);





app.listen(3000, ()=>{
    console.log("Server started at the port 3000");
})

dbConnect();




