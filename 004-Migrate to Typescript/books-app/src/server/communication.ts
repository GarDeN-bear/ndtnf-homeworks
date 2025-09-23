export default function initChatHandlers(io) {
  io.on('connection', (socket) => {
      const {id} = socket;
      console.log(`Socket connected: ${id}`);

      socket.on('message-to-me', (msg) => {
          msg.type = 'me';
          socket.emit('message-to-me', msg);
      });

      socket.on('message-to-all', (msg) => {
          msg.type = 'all';
          io.emit('message-to-all', msg);
      });

      const {roomName} = socket.handshake.query;
      console.log(`Socket roomName: ${roomName}`);
      socket.join(roomName);
      socket.on('message-to-room', (msg) => {
          msg.type = `room: ${roomName}`;
          io.to(roomName).emit('message-to-room', msg);
      });

      socket.on('disconnect', () => {
          console.log(`Socket disconnected: ${id}`);
      });
  });
}
