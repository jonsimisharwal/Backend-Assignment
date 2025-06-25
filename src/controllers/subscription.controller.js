import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    // check if channelId is valid
    // check if channel exists
    // check if user is already subscribed to the channel
    // if user is already subscribed then unsubscribe
    // if user is not subscribed then subscribe
    // return success response with subscription status
     const {channelId} = req.params
     if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
     }
     const channel=await User.findById(channelId)
     if(!channel){
        throw new ApiError(404,"channel not found")
     }
     const existingSubscription =await Subscription.findOne({
        channel:channelId,
        subscriber:req.user._id
     })
     if(existingSubscription){
        await Subscription.deleteOne({
            _id:existingSubscription._id
        })
      return res.status(200).json(
        new ApiResponse(200,null,"Unsubscribed from channel successfully")
      )
     }else{
        const newSubscription=await Subscription.create({
            channel:channelId,
            subscriber:req.user._id
        })
        return res.status(201).json(
            new ApiResponse(201,newSubscription,"channel subscribed successfully") )

     }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    // check if channelId is valid
    // check if channel exists
    // get subscribers of the channel
    // return success response with subscribers
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
    }
    const channel=await User.findById(channelId)
    if(!channel){
        throw new ApiError(404,"channel not found")
    }
    const subscribers=await Subscription.find({channel:channelId})
    .populate("subscriber","name profile picture")
    .select("subscriber createdAt")
    if(subscribers.length === 0){
        return res.status(404).json(
            new ApiResponse(404,null,"No subscribers found for this channel")
        )
    }
    return res.status(200).json(
        new ApiResponse(200,subscribers,"channel subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    // check if subscriberId is valid
    // check if subscriber exists
    // get channels to which user has subscribed
    // return success response with channels
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalid subscriber id")
    }
    const subscriber =await User.findById(subscriberId)
    if(!subscriber){
        throw new ApiError(404,"Subscriber not found")
    }
    const channels =await Subscription.find({subscriber:subscriberId})
    .populate("channel","name profile picture")
    .select("channel createdAt")
    .sort({createdAt:-1})
    if(channels.length ===0){
        return res.status(404).json(
            new ApiResponse(404,null,"No channels found for this subscriber")
        )
    }
    return res.status(200).json(
        new ApiResponse(200,channels,"Subscribed channels fetched successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}