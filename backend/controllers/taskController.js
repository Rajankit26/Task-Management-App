import Task from "../models/Task.js";

/*************************
@desc Get all tasks (Admin: all, User : only assigned tasks)
@route GET/api/tasks
@access Private
*************************/
export const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if(status){
            filter.status = status;
        }
        let tasks;

        if(req.user.role === "admin"){
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }
        else{
            tasks = await Task.find({
                ...filter, 
                assignedTo : req.user._id
            }).populate(
                "assignedTo", 
                "name email profileImageUrl"
            );
        }

            // Add completed todoChecklist count to each task
            tasks = await Promise.all(
                tasks.map( async (task) => {
                    const completedCount = task.todoCheckList.filter(
                        (item) => item.completed
                    ).length;
                    return {...task._doc,
                        completedTodoCount : completedCount
                    };
                })
            );

            // Status summary counts
            const allTasks = await Task.countDocuments(
                req.user.role === "admin" ? {} : {assignedTo : req.user._id}
            );

            const pendingTasks = await Task.countDocuments({
                ...filter,
                status : "Pending",
                ...Task(req.user.role != "admin" && { assignedTo : req.user._id}),
            });

            const inProgressTasks = await Task.countDocuments({
                ...filter,
                status : "In Progress",
                ...Task(req.user.role != "admn" && {assignedTo : req.user._id}),
            })
            
            const completedTasks = await Task.countDocuments({
                ...filter,
                status : "Completed",
                ...Task(req.user.role != "admn" && {assignedTo : req.user._id}),
            });

            res.status(201).json({
                tasks,
                statusSummary : {
                    all : allTasks,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
                }
            })
    } catch (error) {
        res.status(500).json({
            message : "Server error", 
            error : error.message
        });
    }
};


/*************************
@desc Get task by ID
@route GET /api/tasks/:id
@access Private
*************************/

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if(!task)return res.status(404).json({
            message : "Task not found"
        });
        res.status(201).json(task);
    } catch (error) {
         res.status(500).json({
            message : "Server error", 
            error : error.message
        });
    }
}

/*************************
@desc Create a new task (Admin only)
@route POST /api/tasks
@access Private
*************************/
export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body;

        if(!Array.isArray(assignedTo)){
            return res.status(400).json({
                message : "assignedTo must be an array of user IDs"
            });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy : req.user._id,
            attachments,
            todoChecklist,
        });
        res.status(201).json({
            message : "Task created sucessfully!",
            task
        });
    } catch (error) {
        res.status(500).json({
            message : "Server error",
            error : error.message
        })
    }
}


/*************************
@desc Update task details
@route PUT /api/tasks
@access Private (admin)
*************************/
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task)return res.status(404).json({
            message : "TAsk not found"
        });

        task.title = req.body.title ||task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority 
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
        task.attachments = req.body.attachments || task.attachments;

        if(req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return res.status(400).json({
                    message : "assignedTo must be an array of user IDs"
                })
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.json({
            message : "Task updated sucessfully",
            updatedTask
        });
    } catch (error) {
         res.status(500).json({
            message : "Server error", 
            error : error.message
        });
    }
}

/*************************
@desc Delete a task (Admin Only)
@route DELETE /api/tasks/:id
@access Private(Admin)
*************************/
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({
            message : "Task not found"
        })

        await task.deleteOne();
        res.status(201).json({
            message : "Task delete sucessfully"
        })
    } catch (error) {
        res.status(500).json({
            message : "Server error", 
            error : error.message
        });
    }
}

/*************************
@desc Update task status
@route PUT /api/tasks/:id/status
@access Private
*************************/
export const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({
            message : "Task not found"
        })

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if(!isAssigned && req.user.role !== "admin"){
            return res.status(403).json({
                message : "Not authorised"
            })
        }

        task.status = req.body.status || task.status;

        if(task.status === "Completed"){
            task.todoCheckList.forEach( (item) => (item.completed == true));
            task.progress = 100;
        }
        await task.save();
        res.statu(201).json({
            message : "Task status updated sucessfully!",
            task
        })
    } catch (error) {
        res.status(500).json({
            message : "Server error", 
            error : error.message
        });
    }
}


/*************************
@desc Update Task checklist
@route PUT /api/tasks/:id/todo
@access Private
*************************/
export const updateTaskCheckList = async (req, res) => {
    try {
        const { todoCheckList } = req.body;
        const task = await Task.findById(req.params.id);

        if(!task)return res.statis(404).json({
            message : "Task not found"
        })

        if(!task.assignedTo.includes(req.user._id) && req.user.role !== "admin"){
            return res.status(403).json({
                message : "Not authorized to update checklist"
            })
        }

        task.todoCheckList = todoCheckList;

        // Auto update progress based on checklist completion
        const completedCount = task.todoCheckList.filter(
            (item) => item.completed
        ).length;
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        // Auto-mark task as completed if all items are checked
        if(task.progress === 100){
            task.status = "Completed"
        }
        else if(task.progress > 0){
            task.status = "In Progress"
        }
        else{
            task.status = "Pending"
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        res.statud(200).json({
            message : "Task checklist updated",
            task : updatedTask
        })
    } catch (error) {
         res.status(500).json({
            message : "Server error", 
            error : error.message
        });
    }
}

/*************************
@desc Dashboard data (Admin only)
@route GET /api/tasks/dashboard-data
@access Private
*************************/
export const getDashboardData = async (req, res) => {
    try {
        // Fetch statistics
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({status: 'Pending'});
        const completedTasks = await Task.countDocuments({status: 'Completed'});
        const overdueTasks =  await Task.countDocuments({
            status: { $ne : "Completed"},
            dueDate : { $lt : new Date()},
        });

        // Ensure all possible statuses are included
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id : "$status",
                    count : { $sum : 1},
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce(
            (acc, status) => {
                const formattedKey = status.replace(/\s+/g, ""); //Remove spaces for response keys
                acc[formattedKey] = taskDistributionRaw.find( (item) => item._id === status) ?.count || 0;
                return acc;
             },  {}
        );

        // Add total count to totalDistribution
        taskDistribution["All"] = totalTasks;

        // Ensure all priority levels are included
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id : "$priority",
                    count : { $sum: 1},
                }
            }
        ]);
        const taskPriorityLevels = taskPriorities.reduce(
            (acc, priority) => {
                acc[priority] = taskPriorityLevelsRaw.find( (item) => item._id === priority)?.count || 0;
                return acc;
            }, {}
        );

        // Fetch recent 10 tasks
        const recentTasks = await Task.find().sort({
            createdAt : -1
        }).limit(10).select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics : {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
         res.status(500).json({
            message : "Server error", 
            error : error.message
        });
    }
}

/*************************
@desc Dashboard data (User-specific)
@route GET /api/tasks/user-dashboard-data
@access Private
*************************/
export const getUserDashboardData = async (req, res) => {
    try {
        // Only fetch data for logged in user
        const userId = req.user._id;

        // Fetch Statistics for user-specific tasks
        const totalTasks = await Task.countDocuments({assignedTo: userId});
        const pendingTasks = await Task.countDocuments({assignedTo : userId, status: 'Pending'});
        const completedTasks = await Task.countDocuments({assignedTo : userId, status: 'Completed'});
        const overdueTasks =  await Task.countDocuments({
            assignedTo : userId,
            status: { $ne : "Completed"},
            dueDate : { $lt : new Date()},
        });

        // Task distribution by status
        const taskStatuses = ["Pending", "In Progress", "Completed"];

        const taskDistributionRaw = await Task.aggregate([
            {
                $match : {assignedTo : userId}
            },
            {
                $group: {_id : "$status", count: {$sum: 1}}
            },
        ]);

        const taskDistribution = taskStatuses.reduce(
            (acc, status) => {
                const formattedKey = status.replace(/\s+/g, ""); //Remove spaces for response keys
                acc[formattedKey] = taskDistributionRaw.find( (item) => item._id === status) ?.count || 0;
                return acc;
             },  {}
        );

        taskDistribution["All"] = totalTasks;

         const taskPriorities = ["Low", "Medium", "High"];
         const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $match : {assignedTo : userId}
            },
            {  
                $group: {
                    _id : "$priority",
                    count : { $sum: 1},
                }
            }
        ]);
        const taskPriorityLevels = taskPriorities.reduce(
            (acc, priority) => {
                acc[priority] = taskPriorityLevelsRaw.find( (item) => item._id === priority)?.count || 0;
                return acc;
            }, {}
        );

        // Fetch recent 10 taskes for logged in user
        const recentTasks = await Task.find({ assignedTo: userId }).sort({
            createdAt : -1
        }).limit(10).select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics : {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error", 
            error : error.message
        })
    }
}