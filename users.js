const users = [];

function userJoin (id, room) {
    const user = { id, room };

    users.push(user);
}

function getCurrentUser (id) {
    return users.find(user => user.id === id);
}

function userLeave (id) {
    const idx = users.find(user => user.id === id);

    if (idx !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers (room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}