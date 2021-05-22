const asyncErrorWrapper = require("express-async-handler");
const { searchHelper, paginationHelper } = require("./queryMiddlewareHelpers");

const userQueryMiddleware = (model , options) => {

    return asyncErrorWrapper (async function (req,res,next){
        let query = model.find();

        query = searchHelper("name",query,req);
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total,query,req);

       query = paginationResult.query;

       pagination = paginationResult.pagination;

       const queryResult = await query;

       res.queryResults = {
        success : true,
        count : queryResult.length,
        pagination : pagination,
        data : queryResult
    }
    next();

       next();
    });
}

module.exports = userQueryMiddleware;