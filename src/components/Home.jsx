import React, { useState } from 'react';
import { createRoom, joinRoom } from '../services/gameService';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { Gamepad2, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/imposter_logo.png';

export function Home() {
    const { joinGame } = useGame();
    const [joinCode, setJoinCode] = useState('');
    const [joinName, setJoinName] = useState('');
    const [createName, setCreateName] = useState('');
    const [error, setError] = useState('');

    const handleCreate = async (name) => {
        if (!name) return;
        setError(''); // Clear previous errors
        try {
            const { roomId, playerId } = await createRoom(name, 8);
            joinGame(roomId, playerId);
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    const handleJoin = async (code, name) => {
        if (!code || !name) return;
        setError(''); // Clear previous errors
        try {
            const { roomId, playerId } = await joinRoom(code, name);
            joinGame(roomId, playerId);
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col h-full p-6 items-center justify-center bg-gradient-to-b from-violet-900 to-fuchsia-900 min-h-screen"
        >
            <div className="text-center space-y-4 mb-10 relative">
                {/* Floating elements background */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-10 -right-10 text-yellow-400 opacity-20"
                >
                    <Sparkles size={80} />
                </motion.div>

                <div className="w-[240px] h-[240px] mx-auto flex items-center justify-center transform -rotate-6 -mb-6">
                    <img src={logo} alt="Imposter Logo" className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]" />
                </div>
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-lg transform -rotate-2">
                        IMPOSTER!<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500">ধর শালারে!</span>
                    </h1>
                </div>
                <p className="text-violet-200 font-medium text-lg">Find the imposter. Save the vibe!</p>
            </div>

            <Card className="w-full bg-white/10 border-white/20 backdrop-blur-md shadow-xl overflow-hidden">
                <CardContent className="p-0">
                    <Tabs defaultValue="join" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-black/20 p-1 h-14">
                            <TabsTrigger
                                value="join"
                                className="data-[state=active]:bg-white data-[state=active]:text-violet-900 font-bold h-full rounded-lg"
                            >
                                Join Game
                            </TabsTrigger>
                            <TabsTrigger
                                value="create"
                                className="data-[state=active]:bg-white data-[state=active]:text-violet-900 font-bold h-full rounded-lg"
                            >
                                Create Game
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-6 bg-white/5">
                            <TabsContent value="join" className="space-y-5 mt-0">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-violet-200 uppercase tracking-wider ml-1">Room Code</label>
                                    <Input
                                        placeholder="ABCD"
                                        className="bg-white/10 border-white/20 text-center text-3xl tracking-[0.5em] uppercase font-black text-white placeholder:text-white/20 focus-visible:ring-yellow-400 h-16 rounded-xl"
                                        maxLength={4}
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-violet-200 uppercase tracking-wider ml-1">Your Name</label>
                                    <Input
                                        placeholder="Enter your name"
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/20 focus-visible:ring-yellow-400 h-12 rounded-xl text-lg"
                                        value={joinName}
                                        onChange={(e) => setJoinName(e.target.value)}
                                    />
                                </div>
                                <Button
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black text-xl h-16 rounded-xl shadow-lg shadow-cyan-500/30 transform transition-transform active:scale-95"
                                    onClick={() => handleJoin(joinCode, joinName)}
                                    disabled={!joinCode || !joinName}
                                >
                                    JOIN LOBBY
                                </Button>
                            </TabsContent>

                            <TabsContent value="create" className="space-y-5 mt-0">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-violet-200 uppercase tracking-wider ml-1">Your Name</label>
                                    <Input
                                        placeholder="Host name"
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/20 focus-visible:ring-yellow-400 h-12 rounded-xl text-lg"
                                        value={createName}
                                        onChange={(e) => setCreateName(e.target.value)}
                                    />
                                </div>
                                <div className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-400/30 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4 text-yellow-900" />
                                    </div>
                                    <p className="text-xs font-bold text-yellow-100 leading-relaxed">You'll be the host and control the game settings.</p>
                                </div>
                                <Button
                                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xl h-16 rounded-xl shadow-lg shadow-pink-500/30 transform transition-transform active:scale-95"
                                    onClick={() => handleCreate(createName)}
                                    disabled={!createName}
                                >
                                    CREATE PARTY
                                </Button>
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
            {error && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold">
                    {error}
                </div>
            )}
        </motion.div>
    );
}
