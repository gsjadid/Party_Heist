import { startGame } from './services/gameService.js';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase.js';

const roomId = 'LOFD'; // Use the room created earlier

console.log('Testing startGame...');
try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) {
        throw new Error('Room not found');
    }
    const players = roomSnap.data().players;

    await startGame(roomId, players, { targetPlayers: 8 });
    console.log('Game started successfully');
    process.exit(0);
} catch (error) {
    console.error('Error starting game:', error);
    process.exit(1);
}
