const users = {};

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join personal room for notifications
    socket.on('join', (userId) => {
      users[userId] = socket.id;
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined`);
    });

    socket.on('send_message', ({ senderId, receiverId, message }) => {
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', {
          senderId,
          message,
          timestamp: new Date(),
        });
      }
    });

    socket.on('typing', ({ senderId, receiverId }) => {
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', { senderId });
      }
    });

    socket.on('stop_typing', ({ senderId, receiverId }) => {
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('stop_typing', { senderId });
      }
    });

    socket.on('disconnect', () => {
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
      console.log('User disconnected:', socket.id);
    });
  });
};