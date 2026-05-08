const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route POST /api/tasks
router.post('/', protect, async (req, res) => {
  const { title, description, project, assignedTo, deadline, status } = req.body;
  try {
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      deadline,
      status: status || 'To Do',
      createdBy: req.user._id
    });

    // Create notification for assigned user
    const notification = await Notification.create({
      recipient: assignedTo,
      sender: req.user._id,
      type: 'task_assigned',
      message: `${req.user.name} assigned a task: "${title}"`,
      relatedTask: task._id
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'name');

    const io = req.app.get('io');
    if (io) {
      io.to(assignedTo.toString()).emit('new_notification', populatedNotification);
    }

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('createdBy', 'name');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/tasks/project/:projectId
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/tasks/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAssigned = task.assignedTo.toString() === req.user._id.toString();
    if (!isOwner && !isAssigned) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const oldStatus = task.status;
    const newStatus = req.body.status;

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.assignedTo = req.body.assignedTo || task.assignedTo;
    task.deadline = req.body.deadline || task.deadline;
    task.status = newStatus || task.status;

    const updatedTask = await task.save();

    // If task is marked as Done, notify the creator
    if (oldStatus !== 'Done' && newStatus === 'Done' && task.createdBy) {
      const notification = await Notification.create({
        recipient: task.createdBy,
        sender: req.user._id,
        type: 'task_completed',
        message: `${req.user.name} completed the task: "${task.title}"`,
        relatedTask: task._id
      });

      const populatedNotification = await Notification.findById(notification._id)
        .populate('sender', 'name');

      const io = req.app.get('io');
      if (io) {
        io.to(task.createdBy.toString()).emit('new_notification', populatedNotification);
      }
    }

    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('createdBy', 'name');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/tasks/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const project = await Project.findById(task.project);
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;