const { body, validationResult } = require('express-validator');
const express = require('express');
const userSchema = require('../schema/user')
const canvasSchema = require('../schema/canvas')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET
const fetchUser = require('../middleware/fetchUser')

// Create fetchedCanvas - POST request
router.post('/createcanvas', fetchUser, async (req, res) => {
    let success = false
    try {
        const fetchedUserId = req.userId
        const { fetchedCanvas, name, userId } = req.body
        // check if fetchcedUserId and userId are same
        if (fetchedUserId !== userId) {
            return res.status(401).json({ success, message: "Unauthorized - Cannot create" })
        }
        // create fetchedCanvas
        const newCanvas = await canvasSchema.create({ fetchedCanvas, name, userId })

        success = true
        res.send({
            success, message: "Canvas created successfully", data: {
                id: newCanvas.id,
                fetchedCanvas: newCanvas.fetchedCanvas,
                name: newCanvas.name,
                userId: newCanvas.userId,
                timestamp: newCanvas.timestamp
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success, message: "Internal server error" })
    }
}
)

// Delete fetchedCanvas by id - post request
router.post('/deletecanvas/:canvasid', fetchUser, async (req, res) => {
    let success = false
    try {
        const canvasId = req.params.canvasid
        const userId = req.userId
        // check if fetchedCanvas id exists
        if (!canvasId) {
            return res.status(404).json({ success, message: "Canvas id required" })
        }
        // check if fetchedCanvas exists
        const fetchedCanvas = await canvasSchema.findById(canvasId)
        if (!fetchedCanvas) {
            return res.status(404).json({ success, message: "Canvas not found" })
        }
        // check if userId and fetchedCanvas.userId are same
        if (userId !== fetchedCanvas.userId.toString()) {
            return res.status(401).json({ success, message: "Unauthorized - Cannot delete" })
        }

        // delete fetchedCanvas
        const deletedCanvas = await canvasSchema.findByIdAndDelete(canvasId)
        success = true
        res.send({ success, message: "Canvas deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success, message: "Internal server error" })
    }
}
)

// Fetch fetchedCanvas by id - GET request
router.get('/getcanvas/:canvasid', async (req, res) => {
    let success = false
    try {
        const canvasId = req.params.canvasid
        // check if fetchedCanvas id exists
        if (!canvasId) {
            return res.status(404).json({ success, message: "Canvas id required" })
        }
        // fetch fetchedCanvas
        const fetchedCanvas = await canvasSchema.findById(canvasId)
        // check if fetchedCanvas exists
        if (!fetchedCanvas) {
            return res.status(404).json({ success, message: "Canvas not found" })
        }
        success = true
        res.send({
            success, message: "Canvas fetched successfully", data: {
                id: fetchedCanvas.id,
                fetchedCanvas: fetchedCanvas.fetchedCanvas,
                name: fetchedCanvas.name,
                userId: fetchedCanvas.userId,
                timestamp: fetchedCanvas.timestamp
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success, message: "Internal server error" })
    }
}
)

// Fetch all canvases - GET request
router.get('/getallcanvases', fetchUser, async (req, res) => {
    let success = false
    try {
        const userId = req.userId
        // fetch all canvases
        const fetchedCanvases = await canvasSchema.find({ userId })
        .select('name _id userId timestamp')
        //if canvases not found
        if (fetchedCanvases.length <= 0) {
            return res.status(404).json({ success, message: "Canvases not found" })
        }
        success = true
        res.send({
            success, message: "Canvases fetched successfully", data: fetchedCanvases
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success, message: "Internal server error" })
    }
}
)

// Update fetchedCanvas name by id - POST request
router.post('/updatecanvasname/:canvasid', fetchUser, async (req, res) => {
    let success = false
    try {
        const canvasId = req.params.canvasid
        const userId = req.userId
        const { name } = req.body
        // check if fetchedCanvas id exists
        if (!canvasId) {
            return res.status(404).json({ success, message: "Canvas id required" })
        }
        // check if fetchedCanvas exists
        const fetchedCanvas = await canvasSchema.findById(canvasId)
        if (!fetchedCanvas) {
            return res.status(404).json({ success, message: "Canvas not found" })
        }
        // check if userId and fetchedCanvas.userId are same
        if (userId !== fetchedCanvas.userId.toString()) {
            return res.status(401).json({ success, message: "Unauthorized - Cannot update" })
        }

        // check if previous name and new name are same
        if (name === fetchedCanvas.name) {
            return res.status(401).json({ success, message: "Same name - cannot update" })
        }

        // update fetchedCanvas name
        fetchedCanvas.name = name
        await fetchedCanvas.save()

        success = true
        res.send({ success, message: "Canvas name updated successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success, message: "Internal server error" })
    }
}
)

// Update canvas by id - POST request
router.post('/updatecanvas/:canvasid', fetchUser, async (req, res) => {
    let success = false
    try {
        const userId = req.userId
        const canvasId = req.params.canvasid
        const { canvas } = req.body
        // check if canvas id exists
        if (!canvasId) {
            return res.status(404).json({ success, message: "Canvas id required" })
        }
        // check if canvas exists
        const fetchedCanvas = await canvasSchema.findById(canvasId)
        if (!fetchedCanvas) {
            return res.status(404).json({ success, message: "Canvas not found" })
        }
        // check if userId and fetchedCanvas.userId are same
        if (userId !== fetchedCanvas.userId.toString()) {
            return res.status(401).json({ success, message: "Unauthorized - Cannot update" })
        }
        // check if canvas is an array
        if (!Array.isArray(canvas)) {
            return res.status(400).json({ success, message: "Invalid canvas format" })
        }
        // update canvas
        fetchedCanvas.canvas = canvas
        await fetchedCanvas.save()
        success = true
        res.send({ success, message: "Canvas updated successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success, message: "Internal server error" })
    }
}
)

module.exports = router; 