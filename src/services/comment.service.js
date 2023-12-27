"use strict"

const Comment = require("../models/comment.model");
const { convertToObjectId } = require("../utils");
const { NotFoundError } = require("../core/error.response");
const { findProduct } = require("../models/repositories/product.repo")

/*
    key feature: Comment service
    + add comment (User, Shop)
    + get a list of comment [User, Shop]
    + delete a comment [User, shop, admin]
*/

class CommentService {
    static async createComment({ productId, userId, content, parentCommentId = null}){
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        });

        let rightValue;
        if(parentCommentId){
            const parentComment = await Comment.findById(parentCommentId)
            if(!parentComment){
                throw new NotFoundError("Parent comment not found")
            }

            rightValue = parentComment.comment_right;

            await Comment.updateMany(
                {
                    comment_productId: convertToObjectId(productId),
                    comment_right: { $gte: rightValue}
                },
                {
                    $inc: {
                        comment_right: 2
                    }
                }
            )

            await Comment.updateMany(
                {
                    comment_productId: convertToObjectId(productId),
                    comment_left: { $gt: rightValue}
                },
                {
                    $inc: {
                        comment_left: 2
                    }
                }
            )

        }else{
            const maxRightValue = await Comment.findOne(
                { comment_productId: convertToObjectId(productId) }, 
                "comment_right", 
                {sort: {comment_right: -1}}
            )

            if(maxRightValue){
                rightValue = maxRightValue.comment_right + 1
            }else{
                rightValue = 1
            }
        }

        //insert to Comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment
    }

    static async getCommentsByParentId({
        productId, 
        parentCommentId = null, 
        limit = 50, 
        offset = 0
    }){
        if(parentCommentId){
            const parent = await Comment.findById(parentCommentId);
            if(!parent){
                throw new NotFoundError("Parent comment not found")
            }

            const comment = await Comment.find({
                comment_productId: convertToObjectId(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lt: parent.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            });

            return comment;
        }

        const comment = await Comment.find({
            comment_productId: convertToObjectId(productId),
            comment_parentId: parentCommentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        });

        return comment;
    }

    static async deleteComment({ commentId, productId }){
        //check product exist in database
        const foundProduct = await findProduct({
            product_id: productId
        })
        if(!foundProduct) throw new NotFoundError("Product not found");

        //1. Xác định giá trị left right của comment
        const comment = await Comment.findById(commentId);
        if(!comment) throw new NotFoundError("Commnet not found");

        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;

        //2. Tính width
        const width = rightValue - leftValue + 1;
        
        //3.Xóa comment con
        await Comment.deleteMany({
            comment_productId: convertToObjectId(productId),
            comment_left: { $gte: leftValue, $lte: rightValue}
        })

        //4.cập nhật giá trị left và right còn lại
        await Comment.updateMany(
            {
                comment_productId: convertToObjectId(productId),
                comment_right: { $gt: rightValue }
            },
            {
                $inc: {comment_right: -width}
            }
        )

        await Comment.updateMany(
            {
                comment_productId: convertToObjectId(productId),
                comment_left: { $gt: rightValue }
            },
            {
                $inc: {comment_left: -width}
            }
        )

        return true;
    }
}

module.exports = CommentService;