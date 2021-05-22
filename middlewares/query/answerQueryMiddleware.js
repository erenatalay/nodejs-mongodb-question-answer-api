const asyncErrorWrapper = require("express-async-handler");
const { pupulateHelper, paginationHelper } = require("./queryMiddlewareHelpers");

const answerQueryMiddleware = (model, options) => {

    return asyncErrorWrapper(async function (req, res, next) {
        const { id } = req.params;

        const arrayName = "answers";
        const total = (await model.findById(id))["answerCount"];

        const paginationResult = await paginationHelper(total, undefined, req);
        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;

        let queryObject = {};

        queryObject[arrayName] = { $slice: [startIndex, limit] };

        let query = model.find({ _id: id }, queryObject);
        query = pupulateHelper(query,options.population);

        const queryResults = await query;

        res.queryResults = {
            success: true,
            pagination: paginationResult,
            data: queryResults
        }

        next();
    });
}

module.exports = answerQueryMiddleware;