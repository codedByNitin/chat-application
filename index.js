const io = require("socket.io")(8000, {
    cors: {
        origin: "*",   // CORS issue avoid karne ke liye
    }
});

const users = {};

// Jab bhi koi naya socket connect kare
io.on('connection', socket => {

    // New user join
    socket.on('new-user-joined', (name) => {
        if (!name) name = "Anonymous";   // null/undefined fix
        users[socket.id] = name;         // map user with socket.id
        console.log("New user:", name);
        socket.broadcast.emit('user-joined', name);
    });

    // Message bhejna
    socket.on('send', (message) => {
        const senderName = users[socket.id];  // hamesha fresh name uthao
        if (senderName) {
            socket.broadcast.emit('receive', { message: message, name: senderName });
        }
    });

    // User disconnect
    socket.on('disconnect', () => {
        const name = users[socket.id];
        if (name) {
            socket.broadcast.emit('left', name);
            delete users[socket.id];   // sirf disconnected user ko delete karo
        }
    });
});
