import React from "react";
import Board from "../Board";
import RightBoard from "./RightBoard";
import ApiConstants from "../../constants/ApiConstant";
import LeftBoard from "./LeftBoard";
import SockJs from "sockjs-client";
import Stomp from "stompjs";
import LoadingIndicator from "../../common/LoadingIndicator";

export default class Room extends React.Component {
    constructor(props) {
        super(props);

        this.handleLeaveRoom = props.handleLeaveRoom;
        this.ws = new SockJs(ApiConstants.SOCKET_CONNECT_URL);
        this.stompClient = Stomp.over(this.ws);
        this.subscriptions = [];

        const players = props.room.players;
        let competitor = null;
        if (players.length === 2) {
            if (players[0].username === props.user.username) competitor = players[1];
            else competitor = players[0];
        }

        this.state = {
            isSocketConnected: false,
            isGameStarted: false,
            isRedPlayer: false,
            competitor: competitor,
            gameResultCached: null,
        }
    }

    componentDidMount() {
        document.title = "Chinese Chess Game | Room";

        const roomId = this.props.room.id;
        const user = this.props.user;
        const stompClient = this.stompClient;
        stompClient.connect({}, () => {
            this.setState({
                isSocketConnected: true
            });

            const roomSub = stompClient.subscribe("/room/" + roomId, (payload) => {
                const userDto = JSON.parse(payload.body);
                if (userDto.username !== user.username) {
                    this.setState({
                        competitor: userDto
                    });
                }
            });

            const leaveSub = stompClient.subscribe("/room/" + roomId + "/leave", (payload) => {
                const userDto = JSON.parse(payload.body);
                if (userDto.username !== user.username) {
                    this.setState({
                        competitor: null
                    });
                }
            });

            const startSub = stompClient.subscribe("/room/" + roomId + "/game/start", (payload) => {
                console.log("From Room receive signal start game!");
                const gameStart = JSON.parse(payload.body);

                this.setState({
                    isGameStarted: true,
                    isRedPlayer: gameStart.redPlayerUsername === user.username,
                    gameResultCached: null
                });
            });

            const stopSub = stompClient.subscribe("/room/" + roomId + "/game/stop", (payload) => {
                console.log("From Room receive signal stop game!");
                const gameStop = JSON.parse(payload.body);

                // TODO : handle display winner and loser

                this.setState({
                    isGameStarted: false,
                    isRedPlayer: false,
                    gameResultCached: {
                        winner: gameStop.winner,
                        loser: gameStop.loser,
                        reason: gameStop.reason
                    }
                });
                this.props.updateRoom(gameStop.room);

                let userToUpdate;
                let competitorToUpdate;
                if (gameStop.winner.username === this.props.user.username) {
                    userToUpdate = gameStop.winner;
                    competitorToUpdate = gameStop.loser;
                } else {
                    userToUpdate = gameStop.loser;
                    competitorToUpdate = gameStop.winner;
                }
                this.props.updateUser(userToUpdate);
                this.setState({
                    competitor: competitorToUpdate
                });
            });

            this.subscriptions.push(roomSub, leaveSub, startSub, stopSub);
        });
    }

    componentWillUnmount() {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
        this.stompClient.disconnect();
    }

    render() {
        if (!this.state.isSocketConnected) return <LoadingIndicator/>;

        const room = this.props.room;
        const user = this.props.user;
        return (
            <div className="container vh-100">
                <div id="playing-area" className="row justify-content-center">
                    <LeftBoard room={room} user={user} isGameStarted={this.state.isGameStarted}
                               stompClient={this.stompClient}
                               handleLeaveRoom={this.handleLeaveRoom}/>
                    <Board room={room} user={user} stompClient={this.stompClient}
                           gameResultCached={this.state.gameResultCached}
                           isRedPlayer={this.state.isRedPlayer}/>
                    <RightBoard user={user} competitor={this.state.competitor} room={room}
                                isGameStarted={this.state.isGameStarted}
                                stompClient={this.stompClient}/>
                </div>
            </div>
        );
    }

}