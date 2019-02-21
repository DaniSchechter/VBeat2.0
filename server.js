const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");
const socket = require("socket.io");

const normalizaPort = val => {
    var port = parseInt(val, 10);

    if (isNaN(port)){
        return val;
    }
    
    if(port>=0){
        return port;
    }
    return false;
};

const onError = error => {
    if(error.syscall !== "listen")
    {
        throw error;
    }
    const bind = typeof addr === "string" ? "pipe" + addr : "port" + port;
    switch(error.code){
        case "EACCES":
            console.error(bind + " requires eleveted priviliges");
            procecss.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe" + addr : "port" + port;
    debug("Listening on " + bind);
};

const port = normalizaPort(process.env.port || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

/* 
    Server side socket.io Initialization 
*/

// Setup the socket to work with our server
const io = socket(server);

// Listen for client's browser connection
io.on("connection", socket => {
    let date = new Date();
    console.log(`${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }, Client connected: ${ socket.id }`);

    socket.on("songLikeAction", song => {
        io.emit("songLikeAction", song);
    });
});