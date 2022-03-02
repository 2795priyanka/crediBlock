import io from 'socket.io-client'

const CON_PORT = "http://3.138.38.80:3113/";
console.log("CON_PORT", CON_PORT)
let socket;
export default socket = io(CON_PORT)