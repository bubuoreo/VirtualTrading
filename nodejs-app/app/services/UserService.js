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
        console.log(this.socketsMap);
        var ret = null;
        console.log(this.socketsMap.has(id) || this.socketsMap.has(String(id)) || this.socketsMap.has(Number(id)));
        if (this.socketsMap.has(id) || this.socketsMap.has(String(id)) || this.socketsMap.has(Number(id))) {
            ret = this.socketsMap.get(id) || this.socketsMap.get(String(id)) || this.socketsMap.get(Number(id));
        }
        return ret;
    }

    getConnectedUsers() {
        return [...this.socketsMap.keys()];
    }
}

module.exports = UserService;