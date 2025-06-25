import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {Tweet} from "../models/tweet.model.js"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    
    //TODO: toggle like on video
    //check if videoId is valid
    //chech if video exists
    //check if user has already liked the videeo
    //if user has already liked the video then remove like
    //if user has not liked the video then add like
    const {videoId}= req.params
    if(!isValidObjectId(videoId)){
         throw new ApiError(400,"Invalid video id")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    const userId=req.user._id
    const existingLike=await Like.findOne({
        video:videoId,
        user:userId
    })
    if(existingLike){
        // User has already liked the video, remove like
        await Like.deleteOne({ _id: existingLike._id })
        return res.status(200).json(
            new ApiResponse(200, null, "Like removed from video")
        )
    } else {
        // User has not liked the video, add like
        const newLike = await Like.create({
            video: videoId,
            user: userId
        })
        return res.status(201).json(
            new ApiResponse(201, newLike, "Video liked successfully")
        )
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    //check if commentId is valid
    // check if comment exists
    // check if user has already liked the comment
    // if user has already liked the comment then remove like
    // if user has not liked the comment then add like
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"Comment not found")
    }
    const userid=req.user._id
    const existingLike=await Like.findOne({
        comment:commentId,
        user:userid
    })
    if(existingLike){
        await Like.deleteOne({_id:existingLike._id})
        return res.status(200).json(
            new ApiResponse(200,null,"unlike your comment successfully")
        )
    }else{
        const newLike=await Like.create({
            comment:commentId,
            user:userid
        })
        return res.status(201).json(
            new ApiResponse(201,newLike,"like your comment successfully")
        )
    }


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    //check if tweetId is valid
    // check if tweet exists
    // check if user has already liked the tweet
    // if user has already liked the tweet then remove like
    // if user has not liked the tweet then add like
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }
    const tweet=Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"tweet not found")
    }
    const userId=req.user._id
    const existingLike=await Like.findOne({
        tweet:tweetId,
        user:userId
    })
    if(existingLike){
        // User has already liked the tweet, remove like
        await Like.deleteOne({ _id: existingLike._id })
        return res.status(200).json(
            new ApiResponse(200, null, "Like removed from tweet")
        )
    } else {
        // User has not liked the tweet, add like
        const newLike = await Like.create({
            tweet: tweetId,
            user: userId
        
        })
        return res.status(201).json(
            new ApiResponse(201, newLike, "Tweet liked successfully")
        )
    }
        

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    //get userId from req.user
    //find all likes by userId
    //populate video field
    // return success response with liked videos
    const userId=req.user._id
    const likes = await Like.find({ user: userId, video: { $exists: true } })
        .populate('video', 'title description createdAt')
        .sort({ createdAt: -1 });
    if(likes.length === 0) {
        return res.status(404).json(
            new ApiResponse(404, null, "No liked videos found")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, likes, "Liked videos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}