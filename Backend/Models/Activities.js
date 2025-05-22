const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema({
  // Reference to the user who performed the activity
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Type of activity (team_join, team_create, task_assigned, etc.)
  activityType: {
    type: String,
    required: true,
    enum: [
      'team_join',
      'team_create',
      'task_assigned',
      'task_delete',
      'task_completed',
      'stage_update',
      'document_create',
      'document_update',
      'comment_added',
      'collab_request',
      'paper_submitted',
      'dataset_uploaded'
    ]
  },
  
  // Activity timestamp
  timestamp: {
    type: Date,
    default: Date.now
  },
  
  // Dynamic reference to the related entity (team, task, document, etc.)
  entityType: {
    type: String,
    required: true,
    enum: ['Team', 'Task', 'Document', 'Stage', 'Dataset', 'Paper', 'Comment']
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'entityType'
  },
  
  // Additional metadata for different activity types
  metadata: {
    // For team activities
    teamName: String,
    
    // For task activities
    taskTitle: String,
    previousStage: String,
    newStage: String,
    
    // For document activities
    documentTitle: String,
    documentType: String,
    
    // For paper/dataset activities
    title: String,
    journalOrRepo: String,
    
    // For assignment activities
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Project context (if applicable)
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  
  // Visibility scope
  visibility: {
    type: String,
    enum: ['public', 'team', 'private'],
    default: 'team'
  }
});

// Indexes for faster queries
activitySchema.index({ user: 1, timestamp: -1 });
activitySchema.index({ entityType: 1, entityId: 1 });
activitySchema.index({ project: 1 });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;