import { castVote } from './services/gameService.js';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase.js';

const roomId = 'LOFD';

console.log('Testing Game Loop (Voting)...');
try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) throw new Error('Room not found');

    const players = roomSnap.data().players;
    const targetId = players[0].id; // Vote for the first player

    // Cast votes from all players
    for (const player of players) {
        await castVote(roomId, player.id, targetId);
        console.log(`Player ${player.id} voted for ${targetId}`);
    }

    // Check result
    const updatedSnap = await getDoc(roomRef);
    const status = updatedSnap.data().status;
    console.log('Game Status after voting:', status);

    if (status === 'RESOLUTION') {
        console.log('Game resolved successfully!');
        console.log('Winner:', updatedSnap.data().winner);
    } else {
        console.error('Game did not resolve to RESOLUTION');
    }

    process.exit(0);
} catch (error) {
    console.error('Error in game loop:', error);
    process.exit(1);
}
