import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './index.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import YearModal from './components/YearModal';

import Splash from './pages/Splash';
import Subjects from './pages/Subjects';
import Exam from './pages/Exam';
import Score from './pages/Score';
import Review from './pages/Review';

function AppShell() {
  const location = useLocation();
  const isSplash = location.pathname === '/';

  return (
    <>
      {!isSplash && <Navbar />}
      {!isSplash && <Sidebar />}
      {!isSplash && <YearModal />}
      <Routes>
        <Route path="/"         element={<Splash />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/exam"     element={<Exam />} />
        <Route path="/score"    element={<Score />} />
        <Route path="/review"   element={<Review />} />
      </Routes>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
