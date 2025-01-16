import Task from "../models/Task.js";
import User from "../models/User.js";
import multer from 'multer';
import path from 'path';

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

/* CREATE TASK */
export const createTask = async (req, res) => {
  try {
    const { userId, taskDescription, voucherRequest, dateCompleted } = req.body;
    const taskPicturePath = req.file ? req.file.path : null;

    if (!taskPicturePath) {
      return res.status(400).json({ msg: "Task picture is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const newTask = new Task({
      userId,
      taskDescription,
      voucherRequest,
      dateCompleted,
      taskPicturePath,
      status: "pending",
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
    const { taskId } = req.params;
    const { approval } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found." });
    }

    if (task.status !== "pending") {
      return res.status(400).json({ msg: "Task has already been processed." });
    }

    if (approval) {
      task.status = "approved";
      const user = await User.findById(task.userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }

      user.voucher += task.voucherRequest;
      await user.save();
    } else {
      task.status = "rejected";
    }

    await task.save();

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
