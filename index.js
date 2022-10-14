require('dotenv').config();
const express =  require("express")
let app = express()
const cors = require("cors")
const { Server } = require("socket.io")
const http = require("http")


app.use(cors())

const server = http.createServer(app)

const io = new Server(server , {
    cors : {
        origin : process.env.ORIGIN,
        methods : [ "GET" , "POST"]
    }
})

io.on("connection" , (socket) => {
  console.log(`User Connected : ${socket.id}`)

  //* listening the emit content which get from frontend(1st)(app.js file) to backend
  socket.on("join_room", (roomId) => {
    socket.join(roomId)
  })

  //* listening the emit content from frontend(2nd)(chat.js) to backend
  socket.on("sendMessage" , ( messageData) => {

    //* emit the content backend to frontend at specific roomId
    socket.to(messageData.room).emit("receiveMessage", messageData)
  })

  socket.on("disconnect" , () => {
    console.log(`User Disconnected : ${socket.id}` );
  })
})

server.listen(process.env.PORT , () =>{
    console.log(`server running on ${process.env.PORT}`);
})