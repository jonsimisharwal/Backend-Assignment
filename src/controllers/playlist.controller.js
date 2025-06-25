import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
   //TODO: create playlist
   // check if user exists
   // check if name and description are provided
   // if name or description is not provided then return error
   // create playlist with name, description and owner
   // return success response with created playlist
    const {userId}=req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id")
    }
    const {name, description} = req.body
    if(!name || name.trim() === ""){
        throw new ApiError(400,"Playlist name is required")
    }
    if(!description || description.trim() === ""){
        throw new ApiError(400,"Playlist description is required")
    }
    const playList=await Playlist.create({
        name,
        description,
        owner:userId
    })
    return res.status(201).json(
        new ApiResponse(201,playList,"PlayList created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    // check if userId is valid
    // check if playlists exist for user
    // return success response with playlists
    const {userId}=req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id")
    }
    const playlists = await Playlist.find({owner: userId})
        .select("name description createdAt")
        .sort({createdAt: -1})
    if(playlists.length === 0){
        return res.status(404).json(
            new ApiResponse(404,null,"No playlists found for this user")
        )
    }
    return res.status(200).json(
        new ApiResponse(200,playlists,"user playlists fetched successfully")
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    // check if playlistId is valid
    // check if playlist exists
    // return success response with playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId)
        .populate('videos', 'title description createdAt')
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    return res.status(200).json(
        new ApiResponse(200,playlist,"Playlist fetched successfully")
    )
    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    //check ig playlistId and videoId are valid
    //check if playlist exists
    //check if video already exists in playlist
    //if video already exists in playlist then return error
    //if video does not exist in playlist then add video to playlist
    // return success response with updated playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlist or video id")
    }
    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    if(playlist.videos.includes(videoId)){
        throw new ApiError(400,"Video already exists in playlist")
    }
    playlist.videos.push(videoId)
    await playlist.save()
    return res.status(200).json(
        new ApiResponse(200,playlist,"Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    // check if playlistId and videoId are valid
    // check if playlist exists
    // check if video exists in playlist
    // if video does not exist in playlist then return error
    // if video exists in playlist then remove video from playlist
    // return success response with updated playlist
    
      const {playlistId, videoId} = req.params
      if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlist or video id")
      }
      const playlist=await Playlist.findById(playlistId)
      if(!playlist){
        throw new ApiError(404,"playlist not found")
      }
        if(!playlist.videos.includes(videoId)){
            throw new ApiError(404,"Video not found in playlist")
        }
        playlist.videos = playlist.videos.filter(video => video.toString() !== videoId)
        await playlist.save()
        return res.status(200).json(
            new ApiResponse(200,playlist,"Video removed from playlist successfully")
        )
})

const deletePlaylist = asyncHandler(async (req, res) => {
   // TODO: delete playlist
    // check if playlistId is valid
    // check if playlist exists
    // if playlist does not exist then return error
    // if playlist exists then delete playlist
     const {playlistId} = req.params
     if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist id")
     }
        const playlist = await Playlist.findByIdAndDelete(playlistId)
        if(!playlist){
            throw new ApiError(404,"Playlist not found")
        }
        return res.status(200).json(
            new ApiResponse(200, null, "Playlist deleted successfully")
        )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist
    // check if playlistId is valid
    // check if playlist exists
    // if playlist does not exist then return error
    // if playlist exists then update playlist with name and description
    // return success response with updated playlist
      const {playlistId} = req.params
    const {name, description} = req.body
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist id")
    }
    if(!name || name.trim() === ""){
        throw new ApiError(400,"Playlist name is required")
    }
    if(!description || description.trim() === ""){
        throw new ApiError(400,"Playlist description is required")
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        name,
        description
    }, {new: true})
    if(!playlist){
        throw new ApiError(404,"Playlist not found")
    }
    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    )

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
