import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// GET /api/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    isRead: false,
  });

  res.json({ success: true, notifications, unreadCount });
});

// PUT /api/notifications/mark-all-read
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );
  res.json({ success: true, message: 'All marked as read' });
});

// PUT /api/notifications/:id/read
export const markOneRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

// DELETE /api/notifications/clear
export const clearAll = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ user: req.user._id });
  res.json({ success: true, message: 'Cleared all notifications' });
});