import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { joinRoom, createRoom } from '../services/gameService';
import { Home } from './Home';
import LobbyView from './LobbyView';

const Lobby = () => {
    const {
        roomId,
        playerId,
        roomData,
        leaveGame,
        startGame
    } = useGame();

    // --- RENDER: IN LOBBY ---
    if (roomId && roomData) {
        const isHost = roomData.players.find(p => p.id === playerId)?.isHost;
        const target = roomData.gameConfig.targetPlayers;

        return (
            <LobbyView
                roomCode={roomId}
                players={roomData.players}
                isHost={isHost}
                onStart={() => startGame(target)}
                onLeave={leaveGame}
            />
        );
    }

    // --- RENDER: HOME SCREEN ---
    return <Home />;
};

export default Lobby;
