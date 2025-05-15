const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateStatus,
  getCompletedTasks,
  getTasksCreatedByUser
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes below require authentication
router.use(protect);

// Create a task or get tasks assigned to the user
router.route('/').post(createTask).get(getTasks);

// Get completed tasks assigned to the logged-in user
router.get('/completed', getCompletedTasks);

// Get tasks created by the logged-in user
router.get('/created-by-me', getTasksCreatedByUser);

// CRUD operations and status update
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// Update task status
router.put('/:id/status', updateStatus);

module.exports = router;
