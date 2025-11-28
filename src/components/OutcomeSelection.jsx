import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { castVote, skipVote } from '../services/gameService';
import { Fingerprint, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';


const OutcomeSelection = () => {
    const { roomData, currentPlayer, roomId } = useGame();

    if (!currentPlayer) return <div className="text-white p-10">Loading player...</div>;

    const { players } = roomData;
    const [selectedId, setSelectedId] = useState(null);

    const handleVote = () => {
        if (selectedId) {
            castVote(roomId, currentPlayer.id, selectedId);
        }
    };

    const handleSkip = () => {
        skipVote(roomId, currentPlayer.id);
    };

    return (
        <motion.div
            className="flex flex-col h-full bg-violet-950 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="text-center mb-8 space-y-4 mt-4">
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500 border-4 border-white shadow-xl mb-2"
                >
                    <Fingerprint className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg leading-none">
                    Who is the<br /><span className="text-red-400">Imposter?</span>
                </h2>
                <p className="text-violet-200 font-bold">Tap a player to accuse them!</p>
            </div>

            <div className="grid grid-cols-3 gap-2 flex-1 overflow-y-auto content-start pb-28 no-scrollbar">
                {players.map((player) => (
                    <motion.button
                        key={player.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedId(player.id)}
                        className={`relative flex items-center justify-center p-4 rounded-xl border-b-4 transition-all min-h-[80px] ${selectedId === player.id
                            ? 'bg-red-500 border-red-700 shadow-[0_0_30px_rgba(239,68,68,0.6)] z-10 scale-105'
                            : 'bg-white border-violet-200 shadow-sm'
                            }`}
                    >
                        <span className={`font-black text-lg uppercase tracking-wider text-center w-full leading-tight ${selectedId === player.id ? 'text-white' : 'text-violet-900'}`}>
                            {player.name}
                        </span>

                        {selectedId === player.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full text-red-600 flex items-center justify-center font-black border-2 border-red-600 shadow-sm text-xs"
                            >
                                !
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-violet-950 via-violet-950 to-transparent pt-12">
                <div className="flex flex-col gap-3">
                    <Button
                        className="w-full h-16 text-xl font-black bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white shadow-lg rounded-2xl uppercase tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        disabled={!selectedId}
                        onClick={handleVote}
                    >
                        CAST VOTE
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full text-violet-300 hover:text-white hover:bg-white/10 font-bold"
                        onClick={handleSkip}
                    >
                        <SkipForward className="w-5 h-5 mr-2" /> SKIP VOTING
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default OutcomeSelection;
