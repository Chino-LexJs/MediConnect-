import {io} from 'socket.io-client'; 
const URL = "http://localhost:3001"
export const socketChat= io(URL,{ path: '/message'});
/**
 * CONEXION SOCKET PARA UNA ROOM EN PARTICULAR
 * @param {*} room identificador de una room (id/email de cada usuario)
 */
 export const initiateSocketChat = (room,socket) => {
   console.log(`Connecting socket...`);
   if (socket && room) socket.emit("join", room);
 };



/**
 * ENVIA EL MENSAJE A UNA ROOM EN PARTICULAR
 * @param {*} room  room de destino
 * @param {*} message mensaje a enviar
 */
export const sendMessage = (userSender, userReciver, message,socket) => {
  if (socket) socket.emit("chat", {
    sender: userSender.email,
    reciver: userReciver.email,
    message
   });
};
