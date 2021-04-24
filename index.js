const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const router = require('./router')
const http = require('http')
const { addUser, getRoomUsers, deleteUser } = require('./Users')
const app = express();
const ss = require('socket.io-stream');
const path = require('path')

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

io.on('connection', (socket) => {
    // console.log(socket.client)

    socket.on("join_room", (data) => {
        addUser(data.room, data.username)
        const total_user = getRoomUsers(data.room)
        console.log("total user", total_user)

        socket.join(data.room)
        socket.to(data.room).emit("user_joined", {
            notif: `${data.username} has joined the room`
        })

    })

    ss(socket).on("image" , (data) => {
        const file = path.basename(data.img)
        
        socket.to(data.room).emit("get_image", data.img)
    })

    // get all user inside room
    socket.on("total_user", (room) => {
        const total_user = getRoomUsers(room)
        console.log("total user", total_user)

        socket.to(room).emit("get_total_user", total_user )
    })

    // plays a new video
    socket.on("play_video", (data) => {
        console.log({url: data})
        socket.to(data.room).emit("url", data)
    })

    // direct link
    socket.on("direct_link", (data) => {
        socket.to(data.room).emit("direct_url", data)
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
    socket.on('leave_room', (data) => {
        // const user_room = users.filter( i => i.room === rooom )
        // if (deleted_users.length !== 0) users.push(deleted_users)
        const newarr = deleteUser(data.user)
        console.log(newarr)

        socket.leave(data.room)
        socket.to(data.room).emit("user_left", {
            notif: `${data.user} has left the room.`
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