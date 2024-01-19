class GameService {

    constructor(userManager) {
        this.userManager = userManager;
        this.gameRooms = {};
        this.waitingUsersId = {};
        this.moneyPrice = 20;
        this.baseGamePoints = 2;
        this.gamePointsIncrement = 1;
    }

    init({ id, cards, money }) {
        this.addUserToWaitingList({ id: id, cards: cards, wallet: money });
        const userIdWaitingList = Object.keys(this.waitingUsersId);
        console.log(`GameService : init: taille waiting list ${userIdWaitingList.length}`);
        if (userIdWaitingList.length >= 2) {
            const Player1 = this.waitingUsersId[userIdWaitingList.shift()];
            delete this.waitingUsersId[Player1.id];

            const Player2 = this.waitingUsersId[userIdWaitingList.shift()];
            delete this.waitingUsersId[Player2.id];

            const roomKey = this.createRoom({ infoPlayer1: Player1, infoPlayer2: Player2 });
            console.log(`GameService: init: Création de la room ${roomKey} avec les players ${Player1.id} et ${Player2.id}`);
            console.log(`GameService: init:`);
            console.log(this.gameRooms[roomKey]);

            const infoPlayer1 = { "myDetails": this.gameRooms[roomKey].player1, "opponentDetails": this.gameRooms[roomKey].player2 };
            const infoPlayer2 = { "myDetails": this.gameRooms[roomKey].player2, "opponentDetails": this.gameRooms[roomKey].player1 };

            // Faire remonter au controller les infos des deux joueurs
            return { infoPlayer1, infoPlayer2 };
        }
        else {
            console.log(`GameService: init: Pas assez de joueurs disponibles`);
        }
    }

    addUserToWaitingList({ id, cards, wallet }) {
        const playerInfo = {
            "id": id,
            "cards": JSON.parse(cards),
            "wallet": wallet
        }
        this.waitingUsersId[id] = playerInfo;
        console.log(`GameService: addUserToWaitingList:`);
        console.log(this.waitingUsersId);
    }

    createRoom({ infoPlayer1, infoPlayer2 }) {
        const roomKey = getRandomInt(1, 100);
        const socketPlayer1 = this.userManager.getSocket({ id: infoPlayer1.id });
        const socketPlayer2 = this.userManager.getSocket({ id: infoPlayer2.id });
        const roomInfo = {
            "player1": {
                "id": infoPlayer1.id,
                "socketId": socketPlayer1.id,
                "wallet": infoPlayer1.wallet,
                "gamePoints": this.baseGamePoints + 20,
                "canAttack": true,
                "cards": infoPlayer1.cards
            },
            "player2": {
                "id": infoPlayer2.id,
                "socketId": socketPlayer2.id,
                "wallet": infoPlayer2.wallet,
                "gamePoints": this.baseGamePoints,
                "canAttack": false,
                "cards": infoPlayer2.cards
            }
        };
        this.gameRooms[roomKey] = roomInfo;
        return roomKey;
    }



    getRoomDetails({ userId }) {
        for (const room of Object.keys(this.gameRooms)) {
            const playersInRoom = Object.values(this.gameRooms[room]);
            const player1 = playersInRoom.find(player => player.id === userId);
            if (player1) {
                const player2 = playersInRoom.find(player => player.id !== userId);
                return [room, player1, player2];
            }
        }
    }

    getPlayerLabeling({ roomId, userId }) {
        const room = this.gameRooms[roomId];
        const labels = Object.keys(room);
        if (room[labels[0]].id === userId) {
            return labels;
        } else {
            return [labels[1], labels[0]]
        }
    }

    attaque({ userId, cardId, opponentCardId }) {
        console.log("GameService: attaque: On va attaquer");
        var [roomId, attackPlayer, defensePlayer] = this.getRoomDetails({ userId: userId });
        const room = this.gameRooms[roomId];
        if (attackPlayer.canAttack) {
            if (attackPlayer.gamePoints > 0) {
                const cardAttack = attackPlayer.cards[cardId];
                const cardDefense = defensePlayer.cards[opponentCardId];
                if (cardAttack && cardDefense && cardAttack.hp > 0 && cardDefense.hp > 0) {
                    cardDefense.hp = cardDefense.hp - (cardAttack.att - cardDefense.def);
                    // TODO: Ajout CC, esquive, etc...
                    if (cardDefense.hp < 0) {
                        cardDefense.hp = 0;
                    }

                    // MAJ dans les cartes du défenseur des hp de la carte visée
                    defensePlayer.cards[opponentCardId].hp = cardDefense.hp;
                    // Vérifier si l'attaque qui vient d'être lancée signe la fin du jeu
                    if (this.isEndGame({ player: defensePlayer })) {

                        attackPlayer = this.updateWallet({ player: attackPlayer, amount: this.moneyPrice })
                        defensePlayer = this.updateWallet({ player: defensePlayer, amount: -this.moneyPrice })

                        // MAJ de la room
                        const [labelAttackPlayer, labelDefensePlayer] = this.getPlayerLabeling({ roomId: roomId, userId: attackPlayer.id })
                        room[labelAttackPlayer] = attackPlayer;
                        room[labelDefensePlayer] = defensePlayer;
                        console.log(`GameService: attaque: ${room}`);

                        const infoPlayers = { "winner": attackPlayer, "looser": defensePlayer };

                        return ["end", infoPlayers];
                    }
                    // Enlever un gamePoint au joueur
                    attackPlayer.gamePoints -= 1;

                    // MAJ de la room
                    const [labelAttackPlayer, labelDefensePlayer] = this.getPlayerLabeling({ roomId: roomId, userId: attackPlayer.id })
                    room[labelAttackPlayer] = attackPlayer;
                    room[labelDefensePlayer] = defensePlayer;
                    console.log(`GameService: attaque: ${room}`);

                    const infoPlayer1 = { "self": attackPlayer, "opponent": defensePlayer };
                    const infoPlayer2 = { "self": defensePlayer, "opponent": attackPlayer };
                    if (attackPlayer.gamePoints <= 0) {
                        return ["success_endTurn", { infoPlayer1, infoPlayer2 }];
                    } else {
                        return ["success", { infoPlayer1, infoPlayer2 }];
                    }
                } else {
                    return ["failure", 'Card invalid']
                }
            } else {
                return ["failure", 'No game points left. Press the button "End turn".']
            }
        } else {
            return ["failure", 'It is not your turn to attack, wait for the end of your opponent turn.']

        }
    }


    endTurn({ userId }) {
        console.log(`GameService: endTurn: ${userId}`);
        console.log(`GameService: endTurn: ${this.getRoomDetails({ userId: userId })}`);
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
            console.log(`GameService: endTurn:`);
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

module.exports = GameService;