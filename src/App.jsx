import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './components/Layout';
import Lobby from './components/Lobby';

import RoleReveal from './components/RoleReveal';
import CluePhase from './components/CluePhase';
import DiscussionPhase from './components/DiscussionPhase';
import OutcomeSelection from './components/OutcomeSelection';
import Resolution from './components/Resolution';

import { AnimatePresence, motion } from 'framer-motion';

const GameRouter = () => {
  const { roomData, loading } = useGame();

  const content = (() => {
    if (loading) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-[50vh] space-y-4"
        >
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-violet-300 font-bold animate-pulse">Connecting to Lobby...</p>
        </motion.div>
      );
    }

    if (!roomData) return <Lobby key="lobby" />;

    switch (roomData.status) {
      case 'LOBBY': return <Lobby key="lobby" />;
      case 'SETUP': return <RoleReveal key="setup" />;
      case 'CLUE': return <CluePhase key="clue" />;
      case 'DISCUSSION': return <DiscussionPhase key="discussion" />;
      case 'VOTING': return <DiscussionPhase key="voting" />;
      case 'OUTCOME': return <OutcomeSelection key="outcome" />;
      case 'RESOLUTION': return <Resolution key="resolution" />;
      default: return <Lobby key="default" />;
    }
  })();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={loading ? 'loading' : (roomData?.status || 'lobby')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full flex-1 flex flex-col"
        style={{ width: '100%' }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<GameRouter />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
