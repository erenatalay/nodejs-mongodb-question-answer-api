const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/database/connectDatabase");
const routers = require("./routers");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path");
//database environment


dotenv.config({
    path :"./config/env/config.env"
});

//MONGODB CONNECTİON
connectDatabase();
const app = express();

//express -body middleware
app.use(express.json());


//PORT 
const PORT = process.env.PORT;


//Routers

app.use("/api",routers);



//Error Handling
app.use(customErrorHandler)

//Static file
app.use(express.static(path.join(__dirname,"public")));


app.listen(PORT,() => {
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
})
