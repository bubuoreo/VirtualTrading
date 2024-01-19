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
        // this.addUserToNotifPageQueues({ io: io, socket: socket, request: "HOME" });
        // this.addUserToNotifPageQueues({ io: io, socket: socket, request: "BTC-USD/1wk" });
        // this.addUserToNotifPageQueues({ io: io, socket: socket, request: "ETH-USD/1wk" });

        socket.on('update_page', (code) => {
            this.addUserToNotifPageQueues({ io: io, socket: socket, request: code });
        });

        socket.on('multi_participate', (data) => {
            this.addUserToMultiGameRoom({ id: idUser });
        });

        socket.on('multi_start', (data) => {

        });

        socket.on('multi_action', (data) => {

        });
    }

    disconnect({ socket, userId }) {
        this.mainService.removeUserFromAllQueues({ userSocketId: socket.id });
        this.userService.removeUser({ id: userId });
    }

    async apiRequestAllCodes({ io }) {
        const data = await this.mainService.apiRequestAllCodes();
        // console.log("MainController: apiRequestAllCodes:");
        // console.log(data);
        this.notifyUsers({ io, data });
    }

    async addUserToNotifPageQueues({ io, socket, request }) {
        const data = await this.mainService.addUserToNotifPageQueues({ socketId: socket.id, request: request });
        // console.log("MainController: addUserToNotifPageQueues:");
        // console.log(data);
        // const data = await this.mainService.apiRequestAllCodes();
        console.log(data);
        this.notifyUsers({ io, data });
    }

    addUserToMultiGameRoom({ id }) {
        this.userService.addUserToMultiGameRoom({id: id})
    }

    notifyUsers({ io, data }) {
        console.log("MainController: notifyUsers:");
        // console.log(data);
        data.forEach(item => {
            item.dest.forEach(dest => {
                const socketCode = item.code.match(/^\/finance\w*/g)[0];
                io.to(dest).emit(socketCode, JSON.stringify(item.data));
            });
        });
    }

    getConnectedUsersNumber() {
        return this.userService.getConnectedUsers().length;
    }

    resetDatabase() {
        this.mainService.resetDatabase();
    }

    analyzeSentiment({ articles }) {
        return this.mainService.analyzeSentiment({ articles });
    }
}

module.exports = MainController