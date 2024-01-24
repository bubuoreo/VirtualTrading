class UserService {

    constructor() {
        this.socketsMap = new Map();
    }

    addUser({ userId, socketId }) {
        this.socketsMap.set(userId, socketId);
    }

    removeUser({ id }) {
        this.socketsMap.delete(id);
    }

    getSocketId({ id }) {
        console.log(`UserService: ${id}`);
        var ret = null;
        if (this.socketsMap.has(id)) {
            ret = this.socketsMap.get(id);
        }
        return ret;
    }

    getConnectedUsers() {
        return [...this.socketsMap.keys()];
    }
}

module.exports = UserService;