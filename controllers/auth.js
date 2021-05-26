const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtClient } = require("../helpers/auth/tokenHelpers");
const { validateUserInput, comparePassword } = require("../helpers/input/inputHelpers")
const sendEmail = require("../helpers/libraries/sendEmail");


const register = asyncErrorWrapper(async (req, res, next) => {

    const activationEmail = req.body.email;
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role,
    });


    const activationToken = user.getActivationTokenFromUser();

    await user.save();

    const activasyonUrl = `http://localhost:3000/api/auth/registerUser?activationToken=${activationToken}`;

    const emailTemplate = `
   <h3>Activation Your Account</h3>
   <p>this <a href='${activasyonUrl}' target = '_blank'>LİNK </a> will expire in 1 hour </p>`;


    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: activationEmail,
            subject: "Activation your Account",
            html: emailTemplate
        });

        return res.status(200).json({
            success: true,
            message: "Token Sent Your Email"
        });
    }
    catch (err) {
        user.activationToken = undefined;
        user.activationExpire = undefined;
        await user.save();

        return next(new CustomError("Email Zaman Aşımına Uğradı", 500))
    }



});

const registerUser = asyncErrorWrapper(async (req, res, next) => {
    const { activationToken } = req.query;

    if (!activationToken) {
        return next(new CustomError("Pleaseprovide a valid token", 400));
    }

    let user = await User.findOne({
        activationToken: activationToken,
        activationExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new CustomError("Invalid Token or Session Expired"), 400)
    }

    user.activationExpire = undefined;
    user.activationToken = undefined;
    user.status = "Active";


    await user.save();


    return res.status(200)
        .json({
            success: true,
            message: "your account has been activated"
        });



});

const login = asyncErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!validateUserInput(email, password)) {
        return next(new CustomError("place check your input", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (user.status != "Active") {
        return next(new CustomError("Pending Account. Please Verify Your Email!", 400))
    }

    if (!comparePassword(password, user.password)) {
        return next(new CustomError("Şifreniz yanlış girdiniz", 400))
    }
    sendJwtClient(user, res)

});

const logout = asyncErrorWrapper(async (req, res, next) => {

    const { NODE_ENV } = process.env;

    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true
    }).json({
        success: true,
        message: "logout successfuly"
    })

});

const getUser = asyncErrorWrapper(async (req, res, next) => {

    const id = req.user.id
    const user = await User.findById(id);


    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name,
            email: user.email
        }
    })
});

const imageUpload = asyncErrorWrapper(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image": req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    });

    res.status(200)
        .json({
            success: true,
            message: "Image Upload Successfully",
            data: user
        })


});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email;

    const user = await User.findOne({ email: resetEmail });

    if (!user) {
        return next(new CustomError("Böyle bir email adresi yoktur.", 400))
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:3000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>this <a href='${resetPasswordUrl}' target = '_blank'>LİNK </a> will expire in 1 hour </p>
    
    `;

    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate
        });

        return res.status(200).json({
            success: true,
            message: "Token Sent Your Email"
        });
    }
    catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Email Zaman Aşımına Uğradı", 500))
    }




});



const resetPassword = asyncErrorWrapper(async (req, res, next) => {

    const { resetPasswordToken } = req.query;
    const { password } = req.body;

    if (!resetPasswordToken) {
        return next(new CustomError("Pleaseprovide a valid token", 400));
    }

    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new CustomError("Invalid Token or Session Expired"), 400)
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200)
        .json({
            success: true,
            message: "Reset Password Process Successfuly"
        })
});


const editDetails = asyncErrorWrapper(async (req, res, next) => {
    const editUser = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, editUser, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        success: true,
        data: user
    })


});

module.exports = {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    registerUser,
    editDetails
}