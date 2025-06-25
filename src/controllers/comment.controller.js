import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }
    const comments=await Comment.find({video:videoId})
    .populate("owner","username profilePicture")
    .sort({createdAt:-1})
    .skip((page -1)* limit)
    .Limit(limit)
    .select("content createdAt owner")
    if(comments.length === 0){
        return res.status(404).json(
            new ApiResponse(404,null,"No comments found for this video")
        )
    }
    return res.status(200).json(
        new ApiResponse(200,comments,"video comments fetched successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    // check if videoId is valid
    // check if video exists

    const {content}=req.body
    const {videoId} = req.params
    if(!isValidobjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    if(!content || content.trim() === ""){
        throw new ApiError(400,"Content is required")
    }
    const comment=await Comment.create({
        content,
        video:videoId,
        owner:req.user._id
    })
    return res.status(201).json(
        new ApiResponse(201,comment,"commment added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    // check if commentId is valid
    // check if comment exists
    // check if user is the owner of the comment
    // if user is not the owner then return error
    // if user is the owner then update comment
    // return success response with updated comment
    const userId=req.user._id
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id")
    }
    const {commentId}=req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }
    const comment = await Comment.findOneAndUpdate(
        { _id: commentId, owner: userId },
        { content: req.body.content },
        { new: true }
    )
    if(!comment){
        throw new ApiError(404,"Comment not found or you are not the owner of this comment")
    }
    return res.status(200).json(
        new ApiResponse(200,comment,"comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    // check if commentId is valid
    // check if comment exists
    // check if user is the owner of the comment
    // if user is not the owner then return error
    // if user is the owner then delete comment
    // return success response with deleted comment
    const userId=req.user._id
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id")
    }
    const {commentId}=req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }
    const existingcomment=await Comment.findOneAndDelete({
        _id:commentId,
        owner:userId
    })
    if(!existingcomment){
        throw new ApiError(404,"Comment not found or you are not the owner of this comment")
    }
    return res.status(200).json(
        new ApiResponse(200,null,"comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
