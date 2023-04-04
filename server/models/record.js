
const mongoose = require('mongoose');

const Recordchema = new mongoose.Schema({
        // id: {
        //         type: Number,
        //         required: true,
        //         unique: true
        // },
        name: {
                type: String,
                required: true,
                trim: true,
        },
        position: {
                type: String,
                required: true
        },
        level: {
                type: String,
                required: false,
        }

})

      
module.exports = mongoose.model('Task', Recordchema);
