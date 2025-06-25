import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    //check if user exist
    // content from req.body
    //if content does not exist then return error
    //return success response with created tweet
    const {content, owner}= req.body
    const user=await User.findById(owner) 
    if(!user){
        throw new ApiError(404,"User not found")
    }
    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }
     // Create and save the tweet
    const tweet = await Tweet.create({
        content,
        owner
    });

    return  res.status(201).json(
        new ApiResponse(200,tweet, "tweet created Successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    //id from req.params
    //if id is not valid return error
    //select only content and createdAt
    //return success response with tweets
    const {id} =req.params
    if(!isValidObjectId(id)){
        throw new ApiError(400,"Invalid user ID")
    }
    const user =await User.findById(id)
    if(!user){
        throw new ApiError(404,"User not found")
    }
    const tweets= await Tweet.find({owner:id})
    .select("content createdAt")
    .sort({ createdAt: -1 }); 

    if(tweets.length === 0){
        return res.status(404).json(
            new ApiResponse(404, null, "No tweets found for this user")
        )
    }
    return res.status(200).json(
        new ApiResponse(200,tweets,"user tweets fetched successfully")
    )
    
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    //id from req.params
    //content and owner from req.body
    //if user find by id and update tweet
    const {id}=req.params
    if(!isValidObjectId(id)){
        throw new ApiError(400,"Invalid tweet ID")
    }
    const {content,owner}= req.body
    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }
    const user =await User.findById(owner)
    if(!user){
        throw new ApiError(404,"User not found")
    }
    const tweet=await Tweet.findByIdAndUpdate(id,{ $set:{content:content}},{new:true})
      if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    return res.status(200).json(
        new ApiResponse(200,tweet,"tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    //id from req.params
    
    //tweet find by id and delete
    const {id}=req.params
    if(!isValidObjectId(id)){
        throw new ApiError(400,"Invalid Tweet Id")
    }
    const tweet=await Tweet.findByIdAndDelete(id)
    if(!tweet){
        throw new ApiError(404,"tweet not found")

    }
    return res.status(200).json(
        new ApiResponse(200,null,"tweet deleted successfully")
    )
    
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
