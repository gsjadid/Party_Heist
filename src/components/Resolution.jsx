import React from 'react';
import { useGame } from '../context/GameContext';
import { updateRoomStatus } from '../services/roomService';
import { Trophy, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';


const Resolution = () => {
    const { roomData, roomId, currentPlayer } = useGame();
    const { winner } = roomData;
    const { imposterId } = roomData.gameConfig;
    const isHost = currentPlayer.isHost;

    const imposterName = roomData.players.find(p => p.id === imposterId)?.name || 'Unknown';
    const isImposterWin = winner === 'IMPOSTER';

    const handlePlayAgain = async () => {
        // Reset game state
        await updateRoomStatus(roomId, 'LOBBY', {
            'gameConfig.word': null,
            'gameConfig.hint': null,
            'gameConfig.imposterId': null,
            'gameConfig.round': 1,
            votes: {},
            winner: null,
            votedOutId: null,
            players: roomData.players.map(p => ({ ...p, role: null, isReady: false }))
        });
    };

    return (
        <motion.div
            className={`flex flex-col h-full items-center justify-center p-6 relative overflow-hidden ${isImposterWin ? 'bg-[#450a0a]' : 'bg-[#064e3b]'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Animated Background Rays */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`w-[800px] h-[800px] bg-[conic-gradient(var(--tw-gradient-stops))] ${isImposterWin ? 'from-red-500 via-transparent to-transparent' : 'from-emerald-500 via-transparent to-transparent'}`}
                />
            </div>

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.6 }}
                className="z-10 flex flex-col items-center text-center space-y-8 w-full"
            >
                <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(0,0,0,0.5)] border-8 border-white/20 ${isImposterWin ? 'bg-red-500' : 'bg-emerald-500'}`}>
                    {isImposterWin ? (
                        <AlertTriangle className="w-16 h-16 text-white" />
                    ) : (
                        <Trophy className="w-16 h-16 text-white" />
                    )}
                </div>

                <div className="space-y-2 relative">
                    <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-xl">
                            {isImposterWin ? 'Imposter' : 'Civilians'}
                            <br />
                            <span className={`text-transparent bg-clip-text bg-gradient-to-b ${isImposterWin ? 'from-red-300 to-red-500' : 'from-emerald-300 to-emerald-500'}`}>Win!</span>
                        </h1>
                    </motion.div>
                </div>

                <div className="bg-black/30 backdrop-blur-md p-8 rounded-[2rem] w-full border border-white/20 transform rotate-1 shadow-2xl">
                    <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-6">The Imposter Was</p>
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-5xl font-black text-white tracking-wide uppercase drop-shadow-lg">{imposterName}</span>
                    </div>
                </div>

                {isHost && (
                    <Button
                        className="w-full h-16 text-xl font-black bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all shadow-xl rounded-2xl"
                        onClick={handlePlayAgain}
                    >
                        <RotateCcw className="w-6 h-6 mr-2" /> PLAY AGAIN
                    </Button>
                )}
            </motion.div>

            {/* Confetti mockup */}
            {!isImposterWin && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -50, x: Math.random() * 400, rotate: 0 }}
                            animate={{ y: 900, rotate: 720 }}
                            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3, ease: "linear" }}
                            className={`absolute w-4 h-4 rounded-sm opacity-80 ${['bg-yellow-400', 'bg-pink-500', 'bg-cyan-400', 'bg-white'][Math.floor(Math.random() * 4)]}`}
                            style={{ left: Math.random() * 100 + '%' }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Resolution;
