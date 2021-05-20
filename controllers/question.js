const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler")



const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { title, content } = req.body;

    const question = await Question.create({
        title,
        content,
        user: req.user.id
    });
    res.status(200).json({
        success: true,
        data: question
    })

});

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {

    let query = Question.find();
    const populate = true;
    const populateObject = {
        path : "user",
        select : "name profile_image"
    }
    if (req.query.search) {
        const searchObject = {};
        //title searchValue
        
        const regex = new RegExp(req.query.search,"i")
        searchObject["title"] = regex;

        query = query.where(searchObject);
    }
    if (populate) {
        query = query.populate(populateObject);
    }

    //pagination
    const page= parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page-1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = await Question.countDocuments();
    if(startIndex > 0){
        pagination.previus = {
            page : page -1,
            limit : limit
        }
    }

    if (endIndex < total) {
        pagination.next = {
            page  : page +1,
            limit : limit
        }
    }

    query = query.skip(startIndex).limit(limit);
    
    const sortKey = req.query.sortBy;
    if (sortKey === "most-answer") {
        query = query.sort("-answerCount -createdAt")
    }

    if (sortKey === "most-liked") {
        query = query.sort("-likeCount -createdAt")
    }

    else  {
        query = query.sort("-createdAt")
    }
    const questions = await query;

    return res.status(200).json({
        success: true,
        count : questions.length,
        pagination : pagination,
        data: questions,
    })

});


const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;
    const questions = await Question.findById(id);

    return res.status(200).json({
        success: true,
        data: questions
    })

});

const editQuestion = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;

    const { title, content } = req.body;

    let question = await Question.findById(id);

    question.title = title;
    question.content = content;

    question = await question.save();

    return res.status(200).json({
        success: true,
        data: question
    })


});

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    let question = await Question.findById(id);
    await question.remove()

    return res.status(200).json({
        success : true,
        message : "question delete successfuly"
    });


});


const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params;

    const question = await Question.findById(id);

    if (question.likes.includes(req.user.id)) {
        return next(new CustomError("You already liked this question",400))
    }

    question.likes.push(req.user.id);
    question.likeCount = question.likes.length

    await question.save();

    return res.status(200).json({
        success : true,
        data : question
    })

});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params;

    const question = await Question.findById(id);

    if (!question.likes.includes(req.user.id)) {
        return next(new CustomError("You Can Not undo like oparetion for this question",400))
    }

    const index = question.likes.indexOf(req.user.id);

    question.likes.splice(index,1);
    question.likeCount = question.likes.length
    await question.save();

    return res.status(200).json({
        success : true,
        data : question
    })

});
module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
};