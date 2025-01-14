import Task from "../models/Task.js";
import User from "../models/User.js";

/* CREATE TASK */
export const createTask = async (req, res) => {
  try {
    const { userId, taskDescription, voucherRequest, dateCompleted } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ msg: "User not found." });
    }

    const newTask = new Task({
      userId,
      taskDescription,
      voucherRequest,
      dateCompleted,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* APPROVE TASK */
export const approveTask = async (req, res) => {
    try {
      const { taskId } = req.params; // The ID of the task to approve/reject
      const { approval } = req.body; // Whether the task is approved (true) or rejected (false)
  
      // Find the task by ID
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ msg: "Task not found." });
      }
  
      // Check if the task has already been processed
      if (task.approval || task.rejected) {
        return res.status(400).json({ msg: "Task has already been screened for approval/rejection." });
      }
  
      // Update task based on approval status
      if (approval) {
        task.approval = true;
        const user = await User.findById(task.userId);
        if (!user) {
          return res.status(404).json({ msg: "User not found." });
        }
  
        // Add voucher to user's balance
        user.voucher += task.voucherRequest;
        await user.save();
      } else {
        task.rejected = true;
      }
  
      await task.save();
  
      // Respond with the updated task
      res.status(200).json({
        msg: `Task has been ${approval ? "approved" : "rejected"}.`,
        task,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

/* GET ALL TASKS (Admin) */
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET USER TASKS */
export const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
