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

io.on('connection', (socket) => {
    // console.log(socket.client)

    socket.on("join_room", (data) => {
        socket.join(data)
        // return all Socket instances
        // const sockets = await io.in(data).fetchSockets();
        // console.log(io.sockets.clients(data).length)
    })

    // console.log(socket.rooms)

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
    socket.on('leave_room', (roomId) => {
        socket.leave(roomId)
    })

    socket.on('disconnect', () => {
        console.log("disconnect")
    })
})

server.listen(port, () => {
    console.log('Listening to port 4000');
})

module.exports = app;