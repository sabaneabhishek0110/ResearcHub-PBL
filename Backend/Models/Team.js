const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    Team_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    Admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    accessControl: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        accessLevel: { type: String, enum: ["read", "write", "admin"] }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: { 
        type: Date, 
        default: null 
    }
}, {
    timestamps: true
});

teamSchema.pre('save', function(next) {
    if (!this.members.includes(this.Admin)) {
        this.members.push(this.Admin);
    }
    next();
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;