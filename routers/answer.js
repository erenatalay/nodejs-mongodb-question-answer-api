const express = require("express");
const {getAccesToRoute,getAnswerOwnerAccess} = require("../middlewares/auth/auth")
const {
    addNewAnswerToQuestion,
    getAllAnswersByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    undoLikeAnswer


} = require("../controllers/answer")
const {checkQuestionAndAnswerExist} = require("../middlewares/database/databaseErrorHelpers")
const router = express.Router({mergeParams : true});

router.post("/",getAccesToRoute,addNewAnswerToQuestion)
router.get("/",getAllAnswersByQuestion)
router.get("/:answer_id",checkQuestionAndAnswerExist,getSingleAnswer)
router.get("/:answer_id/like",[checkQuestionAndAnswerExist,getAccesToRoute],likeAnswer)
router.get("/:answer_id/unlike",[checkQuestionAndAnswerExist,getAccesToRoute],undoLikeAnswer)
router.put("/:answer_id/edit",[checkQuestionAndAnswerExist,getAccesToRoute,getAnswerOwnerAccess],editAnswer)
router.delete("/:answer_id/delete",[checkQuestionAndAnswerExist,getAccesToRoute,getAnswerOwnerAccess],deleteAnswer)



module.exports = router;