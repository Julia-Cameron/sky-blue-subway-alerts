const mongoose = require('mongoose');
const {MODES} = require('../config/Constant');

const routeSchema = new mongoose.Schema(
    {
        name : {type:String, required : true},
        mode :{type:String, required:true, trim: true,enum:MODES},
        code : {type:String, required:true, trim : true},
        color : {type:String, required: true, default: '#6B7280'}
    }
);
routeSchema.index({ mode: 1, code: 1 }, { unique: true });
module.exports = mongoose.model('Routes', routeSchema);