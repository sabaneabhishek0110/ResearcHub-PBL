const Activity = require('../Models/Activities');


exports.getUserActivities = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming user is authenticated
        const { page = 1, limit = 10 } = req.query;

        console.log(userId);

        // Execute query with pagination
        const activities = await Activity.find({user: userId})
            .sort({ timestamp: -1 }) // Newest first
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('user', 'name avatar') // Add user details
            .populate('entityId', 'title name') // Add entity details
            .populate('team', 'Team_name')
            .lean(); // Convert to plain JS object

        // Get total count for pagination info
        const total = await Activity.countDocuments({user: userId});
        console.log(activities);

        // Format activities for frontend
        const formattedActivities = activities.map(activity => ({
            id: activity._id,
            type: activity.activityType,
            timestamp: activity.timestamp,
            message: generateActivityMessage(activity), // Your message generator function
            user: {
                id: activity.user._id,
                name: activity.user.name,
                avatar: activity.user.avatar
            },
            entity: {
                type: activity.entityType,
                id: activity.entityId?._id,
                name: activity.entityId?.title || activity.entityId?.name
            },
            metadata: activity.metadata,
            visibility: activity.visibility
        }));

        console.log(formattedActivities);

        res.status(200).json({
            success: true,
            data: formattedActivities,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching user activities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activities',
            error: error.message
        });
    }
};

// Helper function to generate activity messages
function generateActivityMessage(activity) {
    const { activityType, metadata, entityType } = activity;
    
    switch(activityType) {
        case 'team_join':
            return `Joined team "${activity.team.Team_name}"`;
        case 'task_assigned':
            return `Assigned to task "${metadata.taskTitle}"`;
        case 'document_create':
            return `Created document "${metadata.documentTitle}"`;
        // Add more cases as needed
        default:
            return `Performed ${activityType.replace('_', ' ')} action`;
    }
}