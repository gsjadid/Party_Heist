import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { markPlayerReady } from '../services/gameService';
import { Button } from './ui/button';
import { Eye, EyeOff, Sparkles, AlertTriangle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoleReveal = () => {
    const { roomData, currentPlayer, roomId, leaveGame } = useGame();
    const { role } = currentPlayer || {};
    const { word, hint } = roomData.gameConfig;

    if (!currentPlayer) return <div className="text-white p-10">Loading player...</div>;
    const [isRevealed, setIsRevealed] = useState(false);

    const handleContinue = async () => {
        try {
            await markPlayerReady(roomId, roomData.players, currentPlayer.id);
        } catch (error) {
            console.error("Failed to mark ready:", error);

        }
    };

    const isImposter = role === 'IMPOSTER';
    // Vibrant colors for roles
    const bgColor = isImposter ? 'bg-[#450a0a]' : 'bg-[#172554]';
    const bgGradient = isImposter ? 'from-red-500 to-orange-500' : 'from-blue-400 to-cyan-400';
    const accentColor = isImposter ? 'text-red-500' : 'text-cyan-400';
    const buttonClass = isImposter
        ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-red-500/30'
        : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/30';

    return (
        <motion.div
            className={`flex flex-col h-full items-center justify-center p-6 text-center relative overflow-hidden bg-slate-950`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Fun Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-br ${isImposter ? 'from-red-900 via-black to-black' : 'from-blue-900 via-black to-black'}`} />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className={`absolute top-10 right-[-50px] w-64 h-64 rounded-full blur-[100px] ${isImposter ? 'bg-orange-600' : 'bg-cyan-600'}`}
                />
            </div>

            <AnimatePresence mode="wait">
                {!isRevealed ? (
                    <motion.div
                        key="hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="z-10 space-y-8 w-full max-w-xs"
                    >
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter transform -rotate-2">Are you ready?</h2>
                            <p className="text-white/60 font-medium">Tap the card to see your fate!</p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsRevealed(true)}
                            className="w-full aspect-[3/4] bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2rem] border-[6px] border-white/10 shadow-2xl flex flex-col items-center justify-center gap-6 mx-auto relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-inner">
                                <EyeOff className="w-12 h-12 text-white" />
                            </div>
                            <span className="font-black text-white/80 tracking-[0.2em] uppercase text-xl">Tap to Reveal</span>
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="revealed"
                        initial={{ scale: 0.5, opacity: 0, rotateX: -90 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        className="z-10 space-y-6 w-full max-w-md"
                    >
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-white/50 uppercase tracking-[0.2em]">You are the</span>
                            <h1 className={`text-6xl font-black uppercase tracking-tighter ${isImposter ? 'text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600' : 'text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-500'} drop-shadow-2xl`}>
                                {isImposter ? 'IMPOSTER' : 'CIVILIAN'}
                            </h1>
                        </div>

                        <div className={`relative overflow-hidden bg-white rounded-3xl p-8 shadow-2xl transform rotate-1 ${isImposter ? 'shadow-red-900/50' : 'shadow-cyan-900/50'}`}>
                            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${bgGradient}`} />

                            {isImposter ? (
                                <div className="space-y-6">
                                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                        <AlertTriangle className="w-10 h-10 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-800 leading-none mb-2">
                                            Stay Hidden!
                                        </p>
                                        <p className="text-slate-500 font-medium leading-relaxed mb-4">
                                            Everyone knows the word except you. Listen and bluff your way through!
                                        </p>
                                        <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                                            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">HINT</p>
                                            <p className="text-lg font-black text-red-800">{hint}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                        <Zap className="w-10 h-10 text-cyan-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-400 uppercase font-bold tracking-widest">Secret Word</p>
                                        <div className="bg-slate-100 py-4 px-6 rounded-xl transform -rotate-1 border-2 border-slate-200">
                                            <p className="text-4xl font-black text-slate-900 capitalize">{word}</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm">
                                        Describe this word without giving it away.
                                    </p>
                                </div>
                            )}
                        </div>

                        <Button
                            className={`w-full h-16 text-xl font-black text-white rounded-2xl shadow-lg transform transition-all active:scale-95 ${buttonClass} ${currentPlayer.isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleContinue}
                            disabled={currentPlayer.isReady}
                        >
                            {currentPlayer.isReady ? 'WAITING...' : "LET'S PLAY!"}
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full text-white/50 hover:text-white hover:bg-white/10"
                            onClick={leaveGame}
                        >
                            Leave Game
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default RoleReveal;
