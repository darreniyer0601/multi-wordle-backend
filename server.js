const http = require("http");
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
require('dotenv').config();

const users = require("./users");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = socketio(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("socket connected");
	socket.on("createRoom", (room) => {
		const roomUsers = users.getRoomUsers(room);

		if (roomUsers.length !== 0) {
            console.log('room exists');
			socket.emit("roomExists", 'Room already exists');
		} else {
			users.userJoin(socket.id, room);

			socket.join(room);

			console.log(`room ${room} created`);

			socket.emit("roomCreated", {
				room,
				players: 1,
                id: socket.id
			});
		}
	});

	socket.on("joinRoom", (room) => {
		const roomUsers = users.getRoomUsers(room);

		if (roomUsers.length === 0) {
			socket.emit("noSuchRoom");
		}
		else if (roomUsers.length === 2) {
			socket.emit("roomFull");
		} else {
            users.userJoin(socket.id, room);

			socket.join(room);

            console.log(`${socket.id} joined room ${room}`);

			socket.emit("roomJoined", {
                room,
                players: 2,
                playerId: socket.id
            });
		}
	});

    socket.on('move', (input) => {
        const user = users.getCurrentUser(socket.id);

		console.log(`${socket.id} enter "${input}"`);

        socket.broadcast.to(user.room).emit('moveMade', {
            room: user.room,
            id: socket.id,
            input: input
        })
    })
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log("server started..."));
