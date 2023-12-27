const { createComment, getCommentsByParentId, deleteComment } = require("../services/comment.service");
const { CREATED, OK } = require("../core/success.response");

class CommentController {
    createComment = async (req, res, next) => {
        const result = await createComment(req.body)

        new CREATED({
            message: "add comment sucessfull",
            metadata: result
        }).send(res);
    }

    getCommentsByParentId = async (req, res, next) => {
        const result = await getCommentsByParentId(req.query)

        new OK({
            message: "get comments sucessfull",
            metadata: result
        }).send(res);
    }

    deleteCommand = async (req, res, next) => {
        const result = await deleteComment(req.body)

        new OK({
            message: "delete comments sucessfull",
            metadata: result
        }).send(res);
    }
}

module.exports = new CommentController;