const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const router = require('./router')
const http = require('http')

const app = express();

var port = process.env.PORT || 4000;

const server = http.createServer(app);
const io = socket(server, { cors: { origin: '*' } });

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(router)

// const server = app.listen('4000', () => {
//     console.log('Listening to port 4000');
// })

const allowedOrigins = "http://localhost:*"

// io = socket(server, { cors: { origin: '*' } })

const users = []

io.on('connection', (socket) => {
    // console.log(socket.client)

    socket.on("join_room", (data) => {
        const { room, username } =  data;
        // const userExist = users.find( i => i.user === username )
        // if (userExist) {

        // }
        const newUser = { 
            room: room, 
            user: username
            // userID: socket.id 
        }

        users.push(newUser)
        socket.join(room)
        socket.to(room).emit("user_joined", {
            notif: `${username} has joined the room`
        })
        // return all Socket instances
        // const sockets = await io.in(data).fetchSockets();
        // console.log(io.sockets.clients(data).length)
    })

    socket.on("total_user", (room) => {
        const total_user = users.filter( i => i.room === room)
        socket.to(room).emit("get_total_user", total_user )
    })

    console.log(users)
    // let userId = socket.id; // GET USER ID
    // console.log(userId)
    // plays a new video
    socket.on("play_video", (data) => {
        // console.log({url: data})
        socket.to(data.room).emit("url", data)
    })

    // pause and play 
    socket.on("player_state", (data) => {
        console.log({ "player_state": data})
        socket.to(data.room).emit("receive_player_state", data.playerState);
    })

    // video buffering
    socket.on("buffer_state", (data) => {
        console.log({ "buffer" : data })
        if(data.bufferState) {
            socket.to(data.room).emit("receive_buffer_state", { 
                isBuffering: true
            });
        } else {
            socket.to(data.room).emit("receive_buffer_state", { 
                isBuffering: false
            });
        }

    })
    // video seek
    socket.on("seek", (data) => {
        console.log({ "seek": data })
        socket.to(data.room).emit("receive_seek_time", data.seek)
    })

    // leave room
    socket.on('leave_room', ({ room, user }) => {
        // const user_room = users.filter( i => i.room === rooom )
        users.filter( i => i.user != user )
        // if (deleted_users.length !== 0) users.push(deleted_users)
        socket.leave(room)
        socket.to(room).emit("user_left", {
            notif: `${user} has left the room.`
        })

    })

    socket.on('disconnect', () => {
        console.log("disconnect")
    })
})

server.listen(port, () => {
    console.log('Listening to port 4000');
})

module.exports = app;