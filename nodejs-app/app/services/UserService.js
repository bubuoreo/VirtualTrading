class UserService {

    constructor() {
        this.socketsMap = new Map();
    }

    addUser({id, socketId}) {
        this.socketsMap.set(id, socketId);
    }

    removeUser({id}) {
        this.socketsMap.delete(id);
    }

    getSocket({id}) {
        console.log(`UserManager: ${id}`);
        var ret = null;
        if (this.socketsMap.has(id)) {
            ret = this.socketsMap.get(id)
        }
        return ret;
    }

    getConnectedUsers() {
        return [...this.socketsMap.keys()];
    }
}

module.exports = UserService;