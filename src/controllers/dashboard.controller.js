import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    // check if channelId is valid
    // check if channel exists
    // get channel stats
    // return success response with channel stats
    const {channelId}=req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
    }
     const videos = await Video.find({ owner: channelId });
    if (!videos || videos.length === 0) {
        throw new ApiError(404, "No videos found for this channel");
    }
    const totalViews = videos.reduce((acc, video) => acc + video.views, 0);
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    const totalLikes = await Like.countDocuments({ video: { $in: videos.map(video => video._id) } });
    const totalVideos = videos.length;
    return res.status(200).json(
        new ApiResponse(200, {
            totalViews,
            totalSubscribers,
            totalLikes,
            totalVideos
        }, "Channel stats fetched successfully")
    );
    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    // check if channelId is valid
    // check if channel exists
    // get all videos uploaded by the channel
    // return success response with videos
    const { channelId}=req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
    }
    const channel=await User.findById(channelId)
    if(!channel){
        throw new ApiError(404,"channel not found")
    }
      const videos = await Video.find({ owner: channelId });
      const count = videos.length;
      return res.status(200).json(
        new ApiResponse(200, { count, videos }, "Channel videos fetched successfully")
    );
})

export {
    getChannelStats, 
    getChannelVideos
    }