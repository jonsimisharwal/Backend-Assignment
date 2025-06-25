import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    
    // TODO: get video, upload to cloudinary, create video
    // check if user exists
    // check if title and description are provided
    // if title or description is not provided then return error
    // upload video to cloudinary
    // create video with title, description, thumbnail and owner
    // return success response with created video
     const { title, description} = req.body
     const { videoFile}= req.files
    const userId=req.user._id
     if(!isValidObjectId(userId)){
         throw new ApiError(400,"Invalid user id")
     }
     const user=await Video.findById(userId)
        if(!user){
            throw new ApiError(404,"User not found")
        }
        if(!title || title.trim() === ""){
            throw new ApiError(400,"Video title is required")
        }
        if(!description || description.trim() === ""){
            throw new ApiError(400,"Video description is required")
        }
        if(!videoFile || !videoFile.path){
            throw new ApiError(400,"Video file is required")
        }
        const videoUploadResponse =await uploadOnCloudinary(videoFile.path,"video")
        if(!videoUploadResponse || !videoUploadResponse.secure_url){
            throw new ApiError(500,"Video upload failed")
        }
        const thumbnailUploadResponse = await uploadOnCloudinary(videoFile.path, "image")
        if(!thumbnailUploadResponse || !thumbnailUploadResponse.secure_url){
            throw new ApiError(500,"Thumbnail upload failed")
        }
        const video = await Video.create({
            title,
            description,
            videoUrl: videoUploadResponse.secure_url,
            thumbnailUrl: thumbnailUploadResponse.secure_url,
            owner: userId
        })
        return res.status(201).json(
            new ApiResponse(201, video, "Video published successfully")
        )

})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id
    // check if videoId is valid
    // check if video exists
    // return success response with video
     const { videoId } = req.params
     if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
     }
     const video= await  Video.find({_id :videoId})
     .populate('owner','username profilePicture')
     .select('title description videoUrl thumbnailUrl createdAt owner')
     
        if(!video){
            throw new ApiError(404,"Video not found")
        }
    return res.status(200).json(
        new ApiResponse(200,video,"Video fetched successfully")
    )
    

})

const updateVideo = asyncHandler(async (req, res) => {
//TODO: update video details like title, description, thumbnail
    // check if videoId is valid
    // check if video exists
    // check if user is the owner of the video
    // if user is not the owner then return error
    // if user is the owner then update video details
    // return success response with updated video
    const { videoId } = req.params
    const {title,description,thumbnailUrl} = req.body
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    if(!title || title.trim() === ""){
        throw new ApiError(400,"Video title is required")
    }
    if(!description || description.trim() === ""){
        throw new ApiError(400,"Video description is required")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You are not authorized to update this video")
    }
    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        title,
        description,
        thumbnailUrl
    }, { new: true })
    if(!updatedVideo){
        throw new ApiError(500,"Video update failed")
    }
    return res.status(200).json(
        new ApiResponse(200,updateVideo,"video updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    // check if videoId is valid
    // check if video exists
    // check if user is the owner of the video
    // if user is not the owner then return error
    // if user is the owner then delete video
    // return success response with deleted video
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You are not authorized to delete this video")
    }
    const deletedVideo = await Video.findByIdAndDelete(videoId)
    if(!deletedVideo){
        throw new ApiError(500,"Video deletion failed")
    }
    return res.status(200).json(
        new ApiResponse(200,deletedVideo,"video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    //TODO: toggle publish status of video
    // check if videoId is valid
    // check if video exists
    // check if user is the owner of the video
    // if user is not the owner then return error
    // if user is the owner then toggle publish status
    // return success response with updated video
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You are not authorized to toggle publish status of this video")
    }
    video.isPublished = !video.isPublished
    const updatedVideo = await video.save()
    if(!updatedVideo){
        throw new ApiError(500,"Video publish status toggle failed")
    }
    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video publish status toggled successfully")
    )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
