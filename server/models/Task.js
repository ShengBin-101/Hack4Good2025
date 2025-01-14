import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    taskDescription: {
      type: String,
      required: true,
      maxlength: 500, // Limits the description length
    },
    voucherRequest: {
      type: Number,
      required: true,
      min: 0, // Ensures no negative quantity
    },
    dateCompleted: {
      type: String,
      required: true,
    },
    approval: {
      type: Boolean,
      required: true,
      default: false, // Default value for approval
    },
    rejected: {
        type: Boolean,
        required: true,
        default: false, // Default value for rejected
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
