const express = require('express');
const answer = require("./answer")
const {getAccesToRoute,getQuestionOwnerAccess} = require("../middlewares/auth/auth")
const {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion} = require("../controllers/question")
const {checkQuestionExist} = require("../middlewares/database/databaseErrorHelpers")
const router = express.Router();
router.get("/",getAllQuestions);
router.get("/:id/like",[getAccesToRoute,checkQuestionExist],likeQuestion);
router.get("/:id/unlike",[getAccesToRoute,checkQuestionExist],undoLikeQuestion);
router.get("/:id",checkQuestionExist,getSingleQuestion);
router.post("/ask",getAccesToRoute,askNewQuestion);
router.put("/:id/edit",[getAccesToRoute,checkQuestionExist,getQuestionOwnerAccess],editQuestion);
router.delete("/:id/delete",[getAccesToRoute,checkQuestionExist,getQuestionOwnerAccess],deleteQuestion)

router.use("/:question_id/answers",checkQuestionExist,answer);


module.exports = router;