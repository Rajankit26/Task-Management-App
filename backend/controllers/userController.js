import Task from "../models/Task.js"
import User from "../models/User.js"

/***********************
 @description Get Al User (Admin Only)
 @route GET /api/v1/users/
 @access Private(Admin)
 **********************/

 export const getUsers = async(req, res) => {
    try {
        const users = await User.find({role : "member"}).select("-password");

        // Add task counts to each user
        const userWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({assignedTo : user._id, status : "Pending"});
            const inProgressTasks = await Task.countDocuments({assignedTo : user._id, status : "In Progress"});
            const completedTasks = await Task.countDocuments({assignedTo : user._id, status : "Completed"});

            return {
                ...user._doc, // Include all existing user data
                pendingTasks,
                inProgressTasks,
                completedTasks 
            };
        }));

        res.status(200).json(userWithTaskCounts);
    } catch (error) {
         res.status(501).json({
            message : "Server error",
            error : error.message
        }) 
    }
 }


/***********************
 @description Get user by Id
 @route GET /api/v1/users/:id
 @access Private
 **********************/

 export const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        };
        res.json(user);
    } catch (error) {
         res.status(501).json({
            message : "Server error",
            error : error.message
        })
    }
 }


/***********************
 @description Delete a user
 @route DELETE /api/v1/users/:id
 @access Private (Admin)

export const deleteUser = async(req, res) => {
    try {
        
    } catch (error) {
         res.status(501).json({
            message : "Server error",
            error : error.message
        })
    }
}

 **********************/
