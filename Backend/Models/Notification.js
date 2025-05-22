const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:["team_request","task_assignment","task_update","stage_update","stage_update_response","general","team_reject"],
        required:true
    },
    message : {
        type : String,
        required : true
    },
    requestedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null
    },
    relatedTeam : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Team",
        default  : null
    },
    relatedTask : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Task",
        default  : null
    },
    relatedStage: {
        type: Number, // Stage index
        default: null
    },
    isRead:{
        type:Boolean,
        default:false
    },
    updateRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Notification = mongoose.model("Notification",notificationSchema);
module.exports = Notification;