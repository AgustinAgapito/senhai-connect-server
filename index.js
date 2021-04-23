const express = require('express');
const app = express();
const cors = require('cors');
const socket = require('socket.io');
const YouTube = require("youtube-sr").default;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.post("/search", (req, res) => {
    const { query } = req.body

    YouTube.search( query )
    .then( x => {
        return res.json({ success: true, result: x });
    })
    .catch( err => {
        return res.status(404).json({ success: false, err: err })
    });

})

app.get('/try', (req,res) => {
    return res.json({"asdf": "adsfsdf"})
})

const server = app.listen('4000', () => {
    console.log('Listening to port 4000');
})

const allowedOrigins = "http://localhost:*"

io = socket(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
    // console.log(socket.id)

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(data)
    })

    // plays a new video
    socket.on("play_video", (data) => {
        // console.log({url: data})
        socket.to(data.room).emit("url", data.url)
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


    socket.on('disconnect', () => {
        console.log("disconnect")
    })
})