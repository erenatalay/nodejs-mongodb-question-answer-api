const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);


    return res.status(200)
        .json({
            success: true,
            data: user
        })
});



const getAllUser = asyncErrorWrapper(async(req,res,next) => {
    const user = await User.find();

    return res.status(200)
    .json({
        success:true,
        data: user
    })
});


module.exports = {
    getSingleUser,
    getAllUser
}