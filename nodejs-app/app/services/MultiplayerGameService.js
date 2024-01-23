const SYMBOLS = ['BTC-USD', 'ETH-USD', 'CHZ-USD', 'WBNB-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD', 'DOGE-USD', 'EGLD-USD'];
const SCENARIOS = [
    {
        "symbol": "BTC-USD",
        "from": new Date(2021, 3, 12),
        "to": new Date(2021, 11, 12),
        "granularity": "1mo"
    }
]
const ROOM_SIZE = 2;
const WALLET_AMOUNT = 1000;

const yahooFinance = require('yahoo-finance2').default;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class MultiplayerGameService {

    constructor(userService) {
        this.userService = userService;
        this.gameRooms = {};
        this.waitingUsersInfo = {};
    }

    async init({ userId, nickname }) {
        this.addUserToWaitingList({ id: userId, nickname: nickname });
        var userIdWaitingList = Object.keys(this.waitingUsersInfo);
        console.log(`MultiplayerGameService : init: taille waiting list ${userIdWaitingList.length}`);
        if (userIdWaitingList.length >= ROOM_SIZE) {
            var tmp = {};
            for (let index = 0; index < ROOM_SIZE; index++) {
                const playerInfo = this.waitingUsersInfo[userIdWaitingList[index]];
                delete this.waitingUsersInfo[playerInfo.id];
                tmp[userIdWaitingList[index]] = playerInfo;
            }

            const roomKey = await this.createRoom({ playersInfo: tmp });

            console.log(`MultiplayerGameService: init: Création de la room ${roomKey} avec les joueurs ${Object.keys(tmp)}`);
            console.log(`MultiplayerGameService: init:`);
            console.log(this.gameRooms[roomKey]);

            return ['multi_start', [...Object.values(this.gameRooms[roomKey]).filter(info => info.id).map(info => ({
                "socketId": info.socketId,
                "nickname": info.nickname
            }))], this.gameRooms[roomKey].Chart.quotes[0]];
        }
        else {
            console.log(`MultiplayerGameService: init: Pas assez de joueurs disponibles`);
            return ['multi_wait_update', Object.values(this.waitingUsersInfo).map(info => info.socketId)]
        }
    }

    addUserToWaitingList({ id, nickname }) {
        const userSocketId = this.userService.getSocketId({ id: id });
        const playerInfo = {
            "id": id,
            "socketId": userSocketId,
            "nickname": nickname,
            "wallet": WALLET_AMOUNT,
            "actionEnabled": true,
            "assetQuantity": 0.00,
            "transactions": [],
        }
        this.waitingUsersInfo[id] = playerInfo;
        console.log(`MultiplayerGameService: addUserToWaitingList:`);
        console.log(this.waitingUsersInfo);
    }

    async createRoom({ playersInfo }) {
        var roomKey = 0;
        while (roomKey == 0 || Object.keys(this.gameRooms).includes(roomKey)) {
            roomKey = getRandomInt(1, 100);
        }
        playersInfo['Chart'] = await this.createRandomScenario();
        this.gameRooms[roomKey] = playersInfo;
        console.log(this.gameRooms[roomKey]);
        return roomKey;
    }

    getRoomDetails({ userId }) {
        for (const room of Object.keys(this.gameRooms)) {
            const playersInRoom = Object.values(this.gameRooms[room]);
            const player = playersInRoom.find(player => player.id === userId);
            if (player) {
                const otherPlayers = playersInRoom.filter(player => player.id !== userId);
                return [room, player, otherPlayers];
            }
        }
    }

    action({ userId, transactionDetails }) {
        console.log("MultiplayerGameService: action: On se positionne sur le marché");

        // obtain details about the room
        var [roomId, player, otherPlayers] = this.getRoomDetails({ userId: userId });
        const room = this.gameRooms[roomId];

        if (!player.actionEnabled) {
            return ["failure", "You already submitted your action for this round"];
        }

        const performTransaction = () => {
            player.transactions.push(transactionDetails);
            player.actionEnabled = false;
            this.gameRooms[roomId][player.id] = player;
        };

        const handleEndRound = () => {
            const transactionArrays = Object.values(this.gameRooms[roomId]).filter(info => info.transactions).map(info => info.transactions);
            const transactionLengths = transactionArrays.map(transactions => transactions.length);

            if (transactionLengths.every(length => length === transactionLengths[0])) {
                Object.values(this.gameRooms[roomId]).forEach(entry => {
                    if (entry.id) {
                        entry.actionEnabled = true;
                    }
                });

                if (transactionLengths[0] == this.gameRooms[roomId].Chart.quotes.length) {
                    const result = Object.values(this.gameRooms[roomId]).filter(info => info.id);
                    delete this.gameRooms[roomId];
                    console.log(this.gameRooms);
                    return ['multi_end', [...result, roomId]];
                } else {
                    return ['multi_end_round', [...Object.values(this.gameRooms[roomId]).filter(info => info.id), this.gameRooms[roomId].Chart.quotes[transactionLengths[0]]]];
                }
            } else {
                return ['multi_update', Object.values(this.gameRooms[roomId]).filter(info => info.id)];
            }
        };

        const handleBuyAction = () => {
            console.log("MultiplayerGameService: action: It is a BUY action");

            if (player.wallet >= transactionDetails.price * transactionDetails.quantity) {
                player = this.updateWallet({ player, amount: -(transactionDetails.price * transactionDetails.quantity) });
                player = this.updateAssetQuantity({ player, quantity: transactionDetails.quantity });
                performTransaction();
                return handleEndRound();
            } else {
                return ["failure", "Not enough money for the BUY action"];
            }
        };

        const handleSellAction = () => {
            console.log("MultiplayerGameService: action: It is a SELL action");

            if (player.assetQuantity >= transactionDetails.quantity) {
                player = this.updateWallet({ player, amount: transactionDetails.price * transactionDetails.quantity });
                player = this.updateAssetQuantity({ player, quantity: -transactionDetails.quantity });
                performTransaction();
                return handleEndRound();
            } else {
                return ["failure", "Not enough asset to perform your SELL request"];
            }
        };

        const handleStayAction = () => {
            console.log("MultiplayerGameService: action: It is a STAY action");
            performTransaction();
            return handleEndRound();
        };

        switch (transactionDetails.type) {
            case "BUY":
                return handleBuyAction();
            case "SELL":
                return handleSellAction();
            default:
                return handleStayAction();
        }
    }

    updateWallet({ player, amount }) {
        player.wallet += amount;
        return player;
    }

    updateAssetQuantity({ player, quantity }) {
        player.assetQuantity += quantity;
        return player;
    }

    async createRandomScenario() {
        // Calculate the difference in milliseconds between January 1, 2020, and today
        const startDate = new Date('2020-10-01');
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const timeDifference = sixMonthsAgo.getTime() - startDate.getTime();

        // Generate a random number of milliseconds within the date range
        const randomMilliseconds = Math.floor(Math.random() * timeDifference);

        // Create a random date between January 1, 2020, and today
        const randomDate = new Date(startDate.getTime() + randomMilliseconds);
        const randomDatePlus6Months = new Date(randomDate.getTime());
        randomDatePlus6Months.setMonth(randomDate.getMonth() + 6)
        const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

        console.log(randomSymbol);
        console.log(randomDate);
        console.log(randomDatePlus6Months);

        try {
            const result = await yahooFinance.chart(randomSymbol, {
                period1: randomDate.toISOString().split('T')[0],
                period2: randomDatePlus6Months.toISOString().split('T')[0],
                interval: "1mo",  // Timeframe granularity passed as a parameter
            });
            return result;
        } catch (error) {
            throw new Error("Error fetching data: " + error);
        }
    }

    deleteGameRoom({roomId}) {
        delete this.gameRooms[roomId];
        console.log(this.gameRooms);
    }
}

module.exports = MultiplayerGameService;