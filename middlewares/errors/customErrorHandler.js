const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler =(err,req,res,next) => {
    let customError = err;

    console.log(err)

    if (err.name === "CastError") {
        customError = new CustomError("Yanlış id değeri gönderilmiştir",400);
        
    }


    if (err.name=== "SyntaxError") {
        customError = new CustomError("Unexpected Syntax",400);
    }

    if (err.name === "ValidationError") {
        customError = new CustomError(err.message,400);
    }

    if (err.code === 11000) {
        //duplicate key
        customError = new CustomError("Duplicate key found : check your input",400)
    }

    res.status(customError.status || 500)
    .json({
        success : false,
        message : customError.message
    })
}

module.exports = customErrorHandler;