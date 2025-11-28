import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress'; // We might need to create this or use a simple div

const CluePhase = () => {
  const { roomData, currentPlayer, markReady } = useGame();

  if (!currentPlayer) return <div className="text-white p-10">Loading player...</div>;

  const { word, hint } = roomData.gameConfig;
  const isImposter = currentPlayer.role === 'IMPOSTER';
  const readyCount = roomData.players.filter(p => p.isReady).length;
  const totalPlayers = roomData.players.length;
  const progress = (readyCount / totalPlayers) * 100;

  return (
    <motion.div
      className="flex flex-col h-full bg-violet-950 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Clue Phase</h2>
          <p className="text-violet-200 font-medium">Give your clue out loud!</p>
        </div>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-white text-lg uppercase tracking-widest">
              You are: <span className={isImposter ? "text-red-400" : "text-cyan-400"}>{isImposter ? 'Imposter' : 'Citizen'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-black/30 rounded-xl p-6">
              <p className="text-sm text-white/60 font-bold uppercase tracking-widest mb-2">
                {isImposter ? 'Your Hint' : 'Secret Word'}
              </p>
              <p className="text-4xl font-black text-white">
                {isImposter ? hint : word}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-white/80">
              <span>Ready Players</span>
              <span>{readyCount} / {totalPlayers}</span>
            </div>
            <div className="h-3 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <Button
            className={`w-full h-16 text-xl font-black rounded-2xl shadow-lg transition-all ${currentPlayer.isReady
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-cyan-500/30 active:scale-95'
              }`}
            onClick={markReady}
            disabled={currentPlayer.isReady}
          >
            {currentPlayer.isReady ? 'WAITING FOR OTHERS...' : 'I GAVE MY CLUE'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CluePhase;
