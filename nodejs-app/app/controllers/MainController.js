const UserServiceClass = require("../services/UserService.js")
const MainServiceClass = require("../services/MainService.js")

class MainController {

    constructor() {
        this.userService = new UserServiceClass();
        this.mainService = new MainServiceClass();
    }

    init({ io, socket, idUser }) {
        console.log(`MainController: init: ${idUser}`);
        this.userService.addUser({ id: idUser, socketId: socket.id });
        this.mainService.addUserToNotifPageQueues({socketId: socket.id, page: 'home'})

        socket.on('update_page', (page) => {
            this.mainService.addUserToNotifPageQueues({socketId: socket.id, page: page})
        });
    }
    disconnect({socket, userId}) {
        // TODO
        this.mainService.removeUserFromAllQueues({socketId: socket.id})
        this.userService.removeUser({id: userId})
    }
}

module.exports = MainController