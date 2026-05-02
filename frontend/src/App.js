import React, { useState } from 'react';
import './index.css';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Predictor from './pages/Predictor';
import PredictionLog from './pages/PredictionLog';

export default function App() {
  const [page, setPage] = useState('dashboard');

  const renderPage = () => {
    if (page === 'dashboard') {
      return <Dashboard />;
    } else if (page === 'students') {
      return <Students />;
    } else if (page === 'predictor') {
      return <Predictor />;
    } else if (page === 'log') {
      return <PredictionLog />;
    } else {
      return <Dashboard />;
    }
  };

  let dashboardClass = "nav-item";
  if (page === 'dashboard') {
    dashboardClass = "nav-item active";
  }

  let studentsClass = "nav-item";
  if (page === 'students') {
    studentsClass = "nav-item active";
  }

  let predictorClass = "nav-item";
  if (page === 'predictor') {
    predictorClass = "nav-item active";
  }

  let logClass = "nav-item";
  if (page === 'log') {
    logClass = "nav-item active";
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Student Performance Predictor</h1>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={dashboardClass} 
            onClick={() => setPage('dashboard')}
          >
            Dashboard
          </button>
          
          <button 
            className={studentsClass} 
            onClick={() => setPage('students')}
          >
            Students
          </button>
          
          <button 
            className={predictorClass} 
            onClick={() => setPage('predictor')}
          >
            AI Predictor
          </button>
          
          <button 
            className={logClass} 
            onClick={() => setPage('log')}
          >
            Prediction Log
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}