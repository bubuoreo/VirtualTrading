const SYMBOLS = ['BTC-USD', 'ETH-USD', 'CHZ-USD', 'WBNB-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD', 'DOGE-USD', 'EGLD-USD'];

const UserServiceClass = require("../services/UserService.js");
const MainServiceClass = require("../services/MainService.js");
const MultiplayerGameServiceClass = require("../services/MultiplayerGameService.js");

class MainController {

    constructor() {
        this.userService = new UserServiceClass();
        this.mainService = new MainServiceClass();
        this.multiGameService = new MultiplayerGameServiceClass(this.userService);
    }

    init({ io, socket, userId }) {
        console.log(`MainController: init: ${userId}`);
        this.userService.addUser({ userId: userId, socketId: socket.id });

        socket.on('update_page', (data) => {
            this.addUserToNotifPageQueues({ userId: userId, io: io, socket: socket, request: data });
        });

        socket.on('multi_participate', (data) => {
            this.multiplayerParticipate({ io: io, userId: userId, data: data })
        });

        socket.on('multi_action', (data) => {
            const [code, result] = this.multiGameAction({ userId: userId, transactionDetails: data });
            console.log(result);
            if (code === "failure") {
                socket.emit('multi_failure', result)
            } else if (code === "multi_end") {
                result.forEach(info => {
                    io.to(info.socketId).emit(code, JSON.stringify(result));
                });
                // TODO: delete gameRoom
                this.deleteGameRoom({roomId: result[-1]});
            } else {
                result.forEach(info => {
                    io.to(info.socketId).emit(code, JSON.stringify(result));
                });
            }
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

    async addUserToNotifPageQueues({ userId, io, socket, request }) {
        const data = await this.mainService.addUserToNotifPageQueues({ userId: userId, socketId: socket.id, request: request });
        // console.log("MainController: addUserToNotifPageQueues:");
        // console.log(data);
        // const data = await this.mainService.apiRequestAllCodes();
        console.log(data);
        this.notifyUsers({ io, data });
    }

    async multiGameInit({ userId, nickname }) {
        const result = await this.multiGameService.init({ userId: userId, nickname: nickname });
        return result;
    }

    multiGameAction({ userId, transactionDetails }) {
        const result = this.multiGameService.action({ userId: userId, transactionDetails: transactionDetails });
        return result;
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

    deleteGameRoom({roomId}) {
        this.multiGameService.deleteGameRoom({roomId: roomId});
    }

    analyzeSentiment({ articles }) {
        return this.mainService.analyzeSentiment({ articles });
    }

    async multiplayerParticipate({ io, userId, data }) {
        console.log(`MainController: init: Nickname = ${data}`);
        const [code, result] = await this.multiGameInit({ userId: userId, nickname: data });
        console.log(result);
        if (code == 'multi_wait_update') {
            result.forEach(socketId => {
                io.to(socketId).emit(code, result.length);
            });
        } else if (code == 'multi_start') {
            result.forEach(info => {
                io.to(info.socketId).emit('multi_wait_update', result.length -1);
                io.to(info.socketId).emit(code, JSON.stringify(result));
            });
        }
    }
}

module.exports = MainController