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
                const roomId = result.pop()
                result.forEach(info => {
                    io.to(info.socketId).emit(code, JSON.stringify(result));
                });
                this.deleteGameRoom({roomId: roomId});
            } else {
                result.forEach(info => {
                    io.to(info.socketId).emit(code, JSON.stringify(result));
                });
            }
        });
        socket.on('chat message', (msg) => {
            console.log("reception message");
            var parsedMsg = JSON.parse(msg);
            console.log(parsedMsg);
            if (parsedMsg.dest !== '-1' ) {
                var idDestUser = parsedMsg.dest;
                parsedMsg["emit"] = userId;
                console.log(parsedMsg);
                try {
                    this.userService.getSocketId({ id: idDestUser }).emit('chat message', JSON.stringify(parsedMsg));
                } catch (error) {
                    console.log(error);
                }
                try {
                    this.userService.getSocketId({ id: userId }).emit('chat message', JSON.stringify(parsedMsg));
                } catch (error) {
                    console.log(error);
                }
            } else {
                parsedMsg["emit"] = userId;
                io.emit('chat message', JSON.stringify(parsedMsg));
            }
        });
    }

    disconnect({ socket, userId }) {
        this.mainService.removeUserFromAllQueues({ userSocketId: socket.id });
        this.userService.removeUser({ id: userId });
    }

    async apiRequestAllCodes({ io }) {
        const data = await this.mainService.apiRequestAllCodes();
        this.notifyUsers({ io, data });
    }

    async addUserToNotifPageQueues({ userId, io, socket, request }) {
        const data = await this.mainService.addUserToNotifPageQueues({ userId: userId, socketId: socket.id, request: request });
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
                io.to(info.socketId).emit('multi_wait_update', null);
                io.to(info.socketId).emit(code, JSON.stringify(result));
            });
        }
    }
}

module.exports = MainController