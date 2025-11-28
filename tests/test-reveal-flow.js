import { createRoom, joinRoom, startGame, markPlayerReady } from './services/gameService.js';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase.js';

console.log('Testing Reveal Flow...');

try {
    // 1. Create Room
    const { roomId, playerId: hostId } = await createRoom('Host', 2);
    console.log(`Room created: ${roomId}, Host: ${hostId}`);

    // 2. Join Player
    const { playerId: player2Id } = await joinRoom(roomId, 'Player2');
    console.log(`Player 2 joined: ${player2Id}`);

    // 3. Start Game
    const roomRef = doc(db, 'rooms', roomId);
    let roomSnap = await getDoc(roomRef);
    const players = roomSnap.data().players;

    await startGame(roomId, players, { targetPlayers: 2 });
    console.log('Game started. Status should be SETUP.');

    roomSnap = await getDoc(roomRef);
    if (roomSnap.data().status !== 'SETUP') {
        throw new Error(`Expected status SETUP, got ${roomSnap.data().status}`);
    }

    // 4. Mark Players Ready
    console.log('Marking Host ready...');
    // Fetch fresh players
    let currentPlayers = roomSnap.data().players;
    await markPlayerReady(roomId, currentPlayers, hostId);

    roomSnap = await getDoc(roomRef);
    if (roomSnap.data().status !== 'SETUP') {
        console.log('Status changed prematurely:', roomSnap.data().status);
    } else {
        console.log('Status is still SETUP (correct).');
    }

    console.log('Marking Player 2 ready...');
    currentPlayers = roomSnap.data().players;
    await markPlayerReady(roomId, currentPlayers, player2Id);

    // 5. Check Status
    roomSnap = await getDoc(roomRef);
    const status = roomSnap.data().status;
    console.log('Final Status:', status);

    if (status === 'DISCUSSION') {
        console.log('SUCCESS: Game transitioned to DISCUSSION.');
    } else {
        console.error('FAILURE: Game stuck in', status);
    }

    process.exit(0);
} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
