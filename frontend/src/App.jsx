import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PreserveStoryPage from './pages/PreserveStoryPage';
import ArchivePage from './pages/ArchivePage';
import AskHeritageAIPage from './pages/AskHeritageAIPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      {/* Standalone Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Main App Layout Routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/preserve" element={<PreserveStoryPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/ask-ai" element={<AskHeritageAIPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
