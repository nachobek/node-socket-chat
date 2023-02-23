const { Socket } = require("socket.io");
const { validateJWT } = require("../helpers");
const { ChatInfo } = require("../models");

const chatInfo = new ChatInfo();

// Doing "socket = new Socket()" must not be done in real world programs. This is solely for education purposes and to get some "IntelliSense" help from VS Code.
const socketController = async (socket = new Socket(), io) => {
    // Since it is a custom property with a "-" in the name. I need to use square brackets to reference it.
    const token = socket.handshake.headers['x-token'];
    
    const user = await validateJWT(token);

    if (!user) {
        return socket.disconnect();
    }


    // Adding user to the list of connected users.
    chatInfo.connectUser(user);
    // Since we are also getting "io", we can do io.emit() to trigger an event to everybody, self + other users.
    // Otherwise we should have done socket.emit() as well as socket.broadcast()
    io.emit('active-users', chatInfo.usersArr);
    socket.emit('receive-message', chatInfo.last10Messages); // Once a new user connects, immediately send the chat history to it.


    // Connect the socket (user) to an additional special/private/custom room, on top of being connected to the public one and the socket.id one of course.
    // This custom room is being created/identified using the user id (which we get from the JWT).
    socket.join(user.id);


    // Clean the list when a user leaves.
    socket.on('disconnect', () => {
        chatInfo.disconnectUser(user.id);
        socket.broadcast.emit('active-users', chatInfo.usersArr);
    });


    // Listen to incoming messages.
    socket.on('send-message', ({message, targetUid}) => {
        // If the targetUid is provided, it means  the message is meant to be sent privately to that given user only.
        if (targetUid) {
            socket.to(targetUid).emit('private-message', {from: user.name, message});
        } else {
            chatInfo.sendMessage(user.id, user.name, message);
            io.emit('receive-message', chatInfo.last10Messages);
        }
    });
}

module.exports = {
    socketController
}