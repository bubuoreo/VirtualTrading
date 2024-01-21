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

    init({ userId, nickname }) {
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

            const roomKey = this.createRoom({ playersInfo: tmp });

            console.log(`MultiplayerGameService: init: Création de la room ${roomKey} avec les joueurs ${Object.keys(tmp)}`);
            console.log(`MultiplayerGameService: init:`);
            console.log(this.gameRooms[roomKey]);

            return ['multi_start', Object.values(this.gameRooms[roomKey]).map(info => ({
                "socketId": info.socketId,
                "nickname": info.nickname
            }))];
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
            "transactions": [],
        }
        this.waitingUsersInfo[id] = playerInfo;
        console.log(`MultiplayerGameService: addUserToWaitingList:`);
        console.log(this.waitingUsersInfo);
    }

    createRoom({ playersInfo }) {
        var roomKey = 0;
        while (roomKey == 0 || Object.keys(this.gameRooms).includes(roomKey)) {
            roomKey = getRandomInt(1, 100);
        }
        this.gameRooms[roomKey] = Object.values(playersInfo);
        return roomKey;
    }

    getRoomDetails({ userId }) {
        for (const room of Object.keys(this.gameRooms)) {
            const playersInRoom = Object.values(this.gameRooms[room]);
            const player = playersInRoom.find(player => player.id === userId);
            if (player) {
                const otherPlayers = playersInRoom.find(player => player.id !== userId);
                return [room, player, otherPlayers];
            }
        }
    }

    action({ userId, transactionDetails }) {
        console.log("MultiplayerGameService: action: On se positionne sur le marché");

        var [roomId, player, otherPlayers] = this.getRoomDetails({ userId: userId });
        const room = this.gameRooms[roomId];
        
        // if () {
        //     if (attackPlayer.gamePoints > 0) {
        //         const cardAttack = attackPlayer.cards[cardId];
        //         const cardDefense = defensePlayer.cards[opponentCardId];
        //         if (cardAttack && cardDefense && cardAttack.hp > 0 && cardDefense.hp > 0) {
        //             cardDefense.hp = cardDefense.hp - (cardAttack.att - cardDefense.def);
        //             if (cardDefense.hp < 0) {
        //                 cardDefense.hp = 0;
        //             }

        //             // MAJ dans les cartes du défenseur des hp de la carte visée
        //             defensePlayer.cards[opponentCardId].hp = cardDefense.hp;
        //             // Vérifier si l'attaque qui vient d'être lancée signe la fin du jeu
        //             if (this.isEndGame({ player: defensePlayer })) {

        //                 attackPlayer = this.updateWallet({ player: attackPlayer, amount: this.moneyPrice })
        //                 defensePlayer = this.updateWallet({ player: defensePlayer, amount: -this.moneyPrice })

        //                 // MAJ de la room
        //                 const [labelAttackPlayer, labelDefensePlayer] = this.getPlayerLabeling({ roomId: roomId, userId: attackPlayer.id })
        //                 room[labelAttackPlayer] = attackPlayer;
        //                 room[labelDefensePlayer] = defensePlayer;
        //                 console.log(`MultiplayerGameService: attaque: ${room}`);

        //                 const infoPlayers = { "winner": attackPlayer, "looser": defensePlayer };

        //                 return ["end", infoPlayers];
        //             }
        //             // Enlever un gamePoint au joueur
        //             attackPlayer.gamePoints -= 1;

        //             // MAJ de la room
        //             const [labelAttackPlayer, labelDefensePlayer] = this.getPlayerLabeling({ roomId: roomId, userId: attackPlayer.id })
        //             room[labelAttackPlayer] = attackPlayer;
        //             room[labelDefensePlayer] = defensePlayer;
        //             console.log(`MultiplayerGameService: attaque: ${room}`);

        //             const infoPlayer1 = { "self": attackPlayer, "opponent": defensePlayer };
        //             const infoPlayer2 = { "self": defensePlayer, "opponent": attackPlayer };
        //             if (attackPlayer.gamePoints <= 0) {
        //                 return ["success_endTurn", { infoPlayer1, infoPlayer2 }];
        //             } else {
        //                 return ["success", { infoPlayer1, infoPlayer2 }];
        //             }
        //         } else {
        //             return ["failure", 'Card invalid']
        //         }
        //     } else {
        //         return ["failure", 'No game points left. Press the button "End turn".']
        //     }
        // } else {
        //     return ["multi_failure", 'You don\'t have enough funds to perform this action']

        // }
    }


    endTurn({ userId }) {
        console.log(`MultiplayerGameService: endTurn: ${userId}`);
        console.log(`MultiplayerGameService: endTurn: ${this.getRoomDetails({ userId: userId })}`);
        var [roomId, attackPlayer, defensePlayer] = this.getRoomDetails({ userId: userId });
        const room = this.gameRooms[roomId];
        if (attackPlayer.canAttack) {
            attackPlayer.canAttack = false;
            defensePlayer.canAttack = true;
            attackPlayer.gamePoints += 1;

            // MAJ de la room
            const [labelAttackPlayer, labelDefensePlayer] = this.getPlayerLabeling({ roomId: roomId, userId: attackPlayer.id })
            room[labelAttackPlayer] = attackPlayer;
            room[labelDefensePlayer] = defensePlayer;
            console.log(`MultiplayerGameService: endTurn:`);
            console.log(room);

            const infoPlayer1 = { "self": attackPlayer, "opponent": defensePlayer };
            const infoPlayer2 = { "self": defensePlayer, "opponent": attackPlayer };
            return ["success", { infoPlayer1, infoPlayer2 }];
        }
        else {
            return ["failure", 'It is not your turn. wait for your opponent end of turn.']
        }
    }

    isEndGame({ player }) {
        const playerCards = Object.values(player.cards);
        return playerCards.every(card => card.hp <= 0);
    }

    updateWallet({ player, amount }) {
        player.wallet += amount;
        return player;
    }
}

module.exports = MultiplayerGameService;