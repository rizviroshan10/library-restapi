const mongoose = require('mongoose')
const dataSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    nama_lapangan: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    foto: {
        type: String,
        required: true    
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    modified_date: {
        type: Date,
        default: null
    }
},{
    versionKey:false
})

module.exports = mongoose.model('Data', dataSchema,'data')
