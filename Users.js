let users = []
const playlist = []
let videoUrl ;

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

const storeVideoUrl = (data) => {
    const { url, title, direct } = data
    if (!direct) {
        let newUrl = {
            url: `${url}?rel=0&vq=360p`,
            title: title
        }
        videoUrl = newUrl
    } else {
        let directUrl = {
            url: url,
            title: title
        }
        videoUrl = directUrl
    }
    // videoUrl = url
    return videoUrl
}

const getUrl = () => {
    return videoUrl
}

const getRoomUsers = (room) => {
    let user = users.filter( i => i.room === room )
    return user
}

const deleteUser = (user) => {
    let index = users.filter( i => i.user !== user)
    // if (index !== -1) return users.splice(index, 1)[0];
    users = index
    return users
}


module.exports = { addUser, getRoomUsers, deleteUser, storeVideoUrl, getUrl }