import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8081});

let userCount = 0;
const allSockets : WebSocket[] = [];

wss.on('connection', (socket: WebSocket) => {

    allSockets.push(socket);      

    userCount++;
    console.log(`${userCount} Users Connected`);

    socket.on('message', (message: Buffer) => {
        console.log(message.toString());
        socket.send('Mil gaya');
        allSockets.forEach(socket => socket.send(message.toString()));  
    })

    socket.on('close', () => {
        userCount--;
        console.log(`${userCount} Users Remaining`);
    })  
})