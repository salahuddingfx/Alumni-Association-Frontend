import { io } from 'socket.io-client';

let socket;

/**
 * Initializes the client-side socket connection.
 * @param {object} member Profile object containing batch and location information
 * @returns {object} Socket instance
 */
export const initClientSocket = (member) => {
  if (socket) return socket;

  socket = io('http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Connected to socket server:', socket.id);

    if (member) {
      // Join batch room
      if (member.batch) {
        socket.emit('join_room', `batch_${member.batch}`);
        console.log(`Subscribed to Socket Room: batch_${member.batch}`);
      }
      // Join chapter location room
      if (member.currentOrganization) {
        // Fallback or organization room
        socket.emit('join_room', `org_${member.currentOrganization.replace(/\s+/g, '_').toLowerCase()}`);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  return socket;
};

/**
 * Returns the active socket instance.
 * @returns {object|null}
 */
export const getClientSocket = () => socket;
