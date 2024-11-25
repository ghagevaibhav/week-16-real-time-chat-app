import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8081});

interface User{
    socket: WebSocket,
    roomId: string
}

let allSockets : User[] = [];

wss.on('connection', (socket: WebSocket) => {

    socket.on('message', (message) => {
        // @ts-ignore
        const parsedMessage = JSON.parse(message);

        if(parsedMessage.type === 'join'){
            console.log('User joined room ' + parsedMessage.payload.roomId);
            allSockets.push({
                socket, 
                roomId: parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type === 'chat'){
            console.log('User wants to chat');
            const currentRoom = allSockets.find(x => x.socket === socket)?.roomId;

           for(let i = 0; i < allSockets.length; i++){
               if(allSockets[i].roomId === currentRoom){
                   allSockets[i].socket.send(parsedMessage.payload.message);
               }
            }
        }
    }) 

    socket.on('disconnect', () => {
        allSockets = allSockets.filter(s => s.socket != socket);
    })

    socket.send('Connected to server');
})