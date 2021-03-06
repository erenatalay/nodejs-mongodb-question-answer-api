const asyncErrorWrapper = require("express-async-handler");
const { searchHelper,pupulateHelper, questionSortHelper, paginationHelper } = require("./queryMiddlewareHelpers");



const questionQueryMiddleware = (model , options) => {

    return asyncErrorWrapper (async function (req,res,next){

        let query = model.find();

        query = searchHelper("title",query,req);

        if (options && options.population) {
            query = pupulateHelper(query,options.population)
        }

        query = questionSortHelper(query,req);

        const total = await model.countDocuments();
       const paginationResult =  await paginationHelper(total,query,req);

       query = paginationResult.query;
       const pagination = paginationResult.pagination;

       const queryResult = await query;

       res.queryResults = {
           success : true,
           count : queryResult.length,
           pagination : pagination,
           data : queryResult
       }
       next();
    });
}

module.exports = questionQueryMiddleware
