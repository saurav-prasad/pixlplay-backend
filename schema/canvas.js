const mongoose = require('mongoose')
const { Schema } = mongoose

const canvasSchema = new Schema({
    canvas: {
        type: Array,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
})
module.exports = mongoose.model('canvas', canvasSchema)