const UserServiceClass = require("../services/UserService.js")
const MainServiceClass = require("../services/MainService.js")

class MainController {

    constructor() {
        this.userService = new UserServiceClass();
        this.mainService = new MainServiceClass();
    }

    async init({ io, socket, idUser }) {
        console.log(`MainController: init: ${idUser}`);
        this.userService.addUser({ id: idUser, socketId: socket.id });
        this.addUserToNotifPageQueues({io, socket})

        socket.on('update_page', (page) => {
            this.mainService.addUserToNotifPageQueues({ socketId: socket.id, page: page })
        });
    }
    
    disconnect({ socket, userId }) {
        this.mainService.removeUserFromAllQueues({ userSocketId: socket.id })
        this.userService.removeUser({ id: userId })
    }

    async apiRequestAllCodes({io}) {
        const data = await this.mainService.apiRequestAllCodes()
        console.log("MainController: apiRequestAllCodes:");
        console.log(data);
        data.forEach(item => {
            item.dest.forEach(dest => {
                const socketCode = item.code.match(/^\/finance\w*/g)[0]
                io.to(dest).emit(socketCode, JSON.stringify(item.data));
            });
        });
    }

    async addUserToNotifPageQueues({io, socket}) {
        const data = await this.mainService.addUserToNotifPageQueues({ socketId: socket.id, page: 'home' })
        console.log("MainController: addUserToNotifPageQueues:");
        console.log(data);
        // const data = await this.mainService.apiRequestAllCodes();
        data.forEach(item => {
            item.dest.forEach(dest => {
                const socketCode = item.code.match(/^\/finance\w*/g)[0]
                io.to(dest).emit(socketCode, JSON.stringify(item.data));
            });
        });
    }

    getConnectedUsersNumber() {
        return this.userService.getConnectedUsers().length
    }

    resetDatabase() {
        this.mainService.resetDatabase();
    }
}

module.exports = MainController