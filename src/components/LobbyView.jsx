import React from 'react';
import { Button } from './ui/button';

import { ScrollArea } from './ui/scroll-area';
import { Users, Play, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LobbyView({ roomCode, players, isHost, onStart, onLeave }) {




    return (
        <div
            className="flex flex-col flex-1 h-full bg-violet-950 w-full"
        >
            {/* Header */}
            <div className="p-6 bg-violet-900 pb-8 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>

                <p className="text-center text-violet-300 text-sm font-bold tracking-widest mb-2 uppercase">Room Code</p>
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-white px-10 py-4 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform border-b-8 border-violet-200">
                        <h1 className="text-6xl font-black tracking-[0.2em] text-violet-900 font-mono">{roomCode}</h1>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <div className="bg-violet-950/50 px-4 py-2 rounded-full flex items-center gap-2 border border-violet-700">
                        <Users className="w-4 h-4 text-pink-400" />
                        <span className="text-white font-bold">{players.length} Players Ready</span>
                    </div>
                </div>
            </div>

            {/* Player List */}
            <ScrollArea className="flex-1 px-6 py-6">
                <div className="grid grid-cols-3 gap-2 pb-4">
                    {players.map((player, index) => (
                        <motion.div
                            key={player.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, type: "spring" }}
                            className={`relative flex items-center justify-center p-4 rounded-xl border-b-4 transition-all hover:scale-[1.02] min-h-[80px] ${player.isHost
                                ? 'bg-yellow-400 border-yellow-600'
                                : 'bg-white border-violet-200'
                                }`}
                        >
                            <div className="w-full text-center relative z-10">
                                <p className={`font-black text-lg uppercase tracking-wider ${player.isHost ? 'text-yellow-900' : 'text-violet-900'}`}>
                                    {player.name}
                                </p>
                                {player.isHost && (
                                    <div className="absolute -top-6 -right-2">
                                        <Crown className="w-5 h-5 text-yellow-700 fill-current" />
                                    </div>
                                )}
                            </div>

                            {/* Status Dot */}
                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${player.isHost ? 'bg-white/50' : 'bg-green-400'} shadow-sm`} />
                        </motion.div>
                    ))}
                </div>
            </ScrollArea>

            {/* Footer Action */}
            <div className="p-6 bg-violet-950 border-t border-violet-900/50 space-y-3">
                {isHost ? (
                    <Button
                        className="w-full h-16 text-xl font-black bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-white shadow-[0_8px_0_rgb(6,95,70)] rounded-2xl transition-all active:translate-y-[4px] active:shadow-none"
                        onClick={onStart}
                    >
                        START GAME <Play className="w-6 h-6 ml-2 fill-current" />
                    </Button>
                ) : (
                    <div className="text-center space-y-3 p-4 bg-violet-900/50 rounded-2xl border border-violet-800">
                        <p className="text-violet-300 font-bold text-sm uppercase tracking-wide">Host is setting up...</p>
                        <div className="flex justify-center gap-2">
                            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}

                <Button
                    variant="ghost"
                    className="w-full text-violet-400 hover:text-red-400 hover:bg-red-950/30 font-bold"
                    onClick={onLeave}
                >
                    LEAVE GAME
                </Button>
            </div>
        </div>
    );
}
