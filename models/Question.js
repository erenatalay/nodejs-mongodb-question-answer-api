const mongoose = require("mongoose");
const slugift = require("slugify")
const Schema = mongoose.Schema;



const QuestionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        minlength: [10, "Less than 10 characters cannot be entered"],
        unique : true
    },
    content: {
        type: String,
        required: [true, "Please a provide a content"],
        minlength: [20, "Less than 20 characters cannot be entered"],

    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    likeCount : {
        type: Number,
        default : 0
    },
    likes: [
        {
            type:mongoose.Schema.ObjectId,
            ref : "User"
        }

    ],
    answerCount :{
        type : Number ,
        default : 0
    },
    answers : [
        {
            type:mongoose.Schema.ObjectId,
            ref : "Answer"
        }
    ]
})



QuestionSchema.pre("save", function (next) {
    if (!this.isModified("title")) {
        next();
    }
    this.slug = this.makeSlug();
    next();
});

QuestionSchema.methods.makeSlug = function () {
    return slugift(this.title, {
        replacement: '-', 
        remove: /[*+~.()'"!:@]/g,
        lower: true,      
    })
}

module.exports = mongoose.model("Question", QuestionSchema);