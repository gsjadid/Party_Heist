import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { updateRoomStatus } from '../services/roomService';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const DiscussionPhase = () => {
    const { roomData, currentPlayer, roomId } = useGame();
    const { players, gameConfig } = roomData;
    const { role } = currentPlayer || {};
    const { word } = gameConfig;
    const isImposter = role === 'IMPOSTER';
    const isHost = currentPlayer?.isHost;

    if (!currentPlayer) return <div className="text-white p-10">Loading player...</div>;

    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Auto-trigger voting if time runs out? 
                    // For now, just let it sit at 0 until host clicks.
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEmergencyMeeting = async () => {
        await updateRoomStatus(roomId, 'VOTING');
    };

    const [hasVoted, setHasVoted] = useState(false);
    const { castVote } = useGame();

    const handleVote = async (targetId) => {
        if (hasVoted) return;
        setHasVoted(true);
        await castVote(targetId);
    };

    return (
        <motion.div
            className="flex flex-col h-full bg-violet-950 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Top Info Card */}
            <div className="pt-6 px-4 pb-4 z-10">
                <div className="bg-white rounded-3xl p-4 shadow-xl flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YOUR ROLE</span>
                        <span className={`font-black text-xl ${isImposter ? 'text-red-500' : 'text-cyan-600'}`}>
                            {role}
                        </span>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-black text-lg border-4 ${timeLeft < 30 ? 'bg-red-100 border-red-400 text-red-600 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Word Card */}
                <div className={`mt-4 p-4 rounded-3xl text-center shadow-lg transform rotate-1 ${isImposter ? 'bg-slate-800' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}>
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Secret Word</p>
                    <p className="text-3xl font-black text-white tracking-wide">
                        {isImposter ? '???' : word}
                    </p>
                </div>
            </div>

            {/* Main Game Area */}
            <ScrollArea className="flex-1 px-4 pb-24">
                <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg">
                        <h3 className="text-yellow-300 text-sm font-black uppercase mb-2 tracking-wider">
                            {roomData.status === 'VOTING' ? 'Voting in Progress' : 'Discussion Phase'}
                        </h3>
                        <p className="text-white font-medium leading-relaxed">
                            {roomData.status === 'VOTING'
                                ? 'Who is the Imposter? Cast your vote now!'
                                : 'Join the Discord channel to discuss! Take turns describing the word.'}
                        </p>
                    </div>

                    {/* Voting Progress Summary */}
                    {roomData.status === 'VOTING' && (
                        <div className="bg-violet-900/50 rounded-xl p-3 flex items-center justify-between border border-violet-500/30">
                            <span className="text-violet-200 text-sm font-bold">Votes Cast</span>
                            <span className="text-white font-mono font-black">
                                {Object.keys(roomData.votes || {}).length} / {players.length}
                            </span>
                        </div>
                    )}

                    {/* Player Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {players.map((player, idx) => {
                            const playerHasVoted = roomData.votes && roomData.votes[player.id];
                            return (
                                <motion.div
                                    key={player.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`bg-white rounded-xl p-4 flex items-center justify-center shadow-md border-b-4 relative min-h-[80px] ${roomData.status === 'VOTING' && !hasVoted
                                        ? 'cursor-pointer hover:scale-105 hover:border-violet-400'
                                        : 'opacity-70'
                                        } border-violet-200 transition-all`}
                                    onClick={() => roomData.status === 'VOTING' && !hasVoted && handleVote(player.id)}
                                >
                                    {/* Voted Badge */}
                                    {playerHasVoted && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm border-2 border-white z-10">
                                            VOTED
                                        </div>
                                    )}

                                    <span className="font-black text-lg text-violet-900 uppercase tracking-wider text-center break-words w-full leading-tight">
                                        {player.name}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </ScrollArea>

            {/* Floating Action Button */}
            {isHost && roomData.status === 'DISCUSSION' && (
                <div className="absolute bottom-6 left-4 right-4">
                    <Button
                        className="w-full h-16 bg-red-500 hover:bg-red-600 text-white shadow-[0_8px_20px_rgba(239,68,68,0.4)] text-xl font-black rounded-2xl uppercase tracking-wider border-b-4 border-red-700 active:translate-y-1 active:border-b-0 active:shadow-none transition-all"
                        onClick={handleEmergencyMeeting}
                    >
                        🚨 Lets Vote!
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default DiscussionPhase;
