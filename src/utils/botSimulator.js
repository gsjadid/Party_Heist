import { joinRoom } from '../services/roomService';

export const addBots = async (roomId, count = 3) => {
    const botNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Jamie', 'Morgan'];

    for (let i = 0; i < count; i++) {
        const name = `${botNames[i % botNames.length]} (Bot)`;
        try {
            await joinRoom(roomId, name);

        } catch (error) {
            console.error(`Failed to add bot ${name}:`, error);
        }
    }
};
