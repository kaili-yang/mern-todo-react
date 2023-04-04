
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
        // id: {
        //         type: Number,
        //         required: true,
        //         unique: true
        // },
        content: {
                type: String,
                required: true,
                trim: true,
        },
        status: {
                type: Number,
                default: 0,
                required: true
        },
        description: {
                type: String,
                required: false,
        }

})

module.exports = mongoose.model('Task', TaskSchema);
