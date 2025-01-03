const mongoose = require('mongoose')
const { Schema } = mongoose

const canvasSchema = new Schema({
    canvas: {
        type: Array,
        required: true,
        default: []
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: () => Date.now()
    }
})
module.exports = mongoose.model('canvas', canvasSchema)