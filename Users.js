const users = []

const addUser = (room, username) => {
    console.log("addUser",username)
    const userExist = users.find( i => i.user === username )   
    let newUser = {
        room: room,
        user: username
    }
    if (!userExist) {
        users.push(newUser)
    }

    return users
}

const getRoomUsers = (room) => {
    let user = users.filter( i => i.room === room )
    return user
}

const deleteUser = (user) => {
    let index = users.findIndex( i => i.user === user)
    if (index !== -1) return users.splice(index, 1)[0];
    // users = index
    // return users
}


module.exports = { addUser, getRoomUsers, deleteUser }