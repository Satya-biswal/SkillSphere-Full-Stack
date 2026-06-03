import Notification from '../models/Notification.js';

export const sendNotification = async (io, { userId, type, title, message, link = '' }) => {
  // Save to DB
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    link,
  });

  // Emit real-time via socket
  if (io) {
    io.to(`user_${userId}`).emit('new_notification', {
      _id: notification._id,
      type,
      title,
      message,
      link,
      isRead: false,
      createdAt: notification.createdAt,
    });
  }

  return notification;
};