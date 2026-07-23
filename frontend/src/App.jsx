import React, { useState } from 'react';
import BoardsHome from './components/BoardsHome';
import BoardView from './components/BoardView';

export default function App() {
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {selectedBoardId ? (
        <BoardView
          boardId={selectedBoardId}
          onBack={() => setSelectedBoardId(null)}
        />
      ) : (
        <BoardsHome onSelectBoard={(id) => setSelectedBoardId(id)} />
      )}
    </div>
  );
}
