import { createRoom } from './services/roomService.js';

console.log('Testing createRoom...');
try {
    const result = await createRoom('TestHost', 8);
    console.log('Room created successfully:', result);
    process.exit(0);
} catch (error) {
    console.error('Error creating room:', error);
    process.exit(1);
}
