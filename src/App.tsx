import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResizerPage from './pages/ResizerPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/resizer" element={<ResizerPage />} />
    </Routes>
  );
};

export default App;
