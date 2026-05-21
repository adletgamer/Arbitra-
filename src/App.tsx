import { useState } from 'react';
import Home from './views/Home';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import { getStoredStartups, saveStoredStartups, resetStoredStartups } from './data/mockDb';
import { UserRole } from './types';
import type { StartupProject, UserSession } from './types';
import './styles.css';

export default function App() {
  // Navigation Router: 'home' | 'auth' | 'dashboard'
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'dashboard'>('home');

  // Loaded database from localStorage with active sync
  const [startups, setStartups] = useState<StartupProject[]>(() => getStoredStartups());

  // User session state
  const [session, setSession] = useState<UserSession>({
    role: UserRole.STARTUP,
    isLoggedIn: false,
    activeStartupId: 'wayki'
  });

  // Connect Wallet from Landing Hero/Navbar
  const handleConnectWalletLanding = () => {
    setSession({
      role: UserRole.STARTUP,
      isLoggedIn: true,
      activeStartupId: 'wayki',
      walletAddress: '0x3A1b...F4e2'
    });
  };

  // Connect Wallet during Auth/Onboarding flow
  const handleConnectWalletAuth = (address: string) => {
    setSession(prev => ({
      ...prev,
      walletAddress: address
    }));
  };

  // Complete Onboarding signup wizard
  const handleOnboardingComplete = (newStartup: StartupProject) => {
    const updatedList = [newStartup, ...startups];
    setStartups(updatedList);
    saveStoredStartups(updatedList);

    setSession({
      role: UserRole.STARTUP,
      isLoggedIn: true,
      activeStartupId: newStartup.id,
      walletAddress: newStartup.walletAddress
    });

    setCurrentView('dashboard');
  };

  // Dashboard role quick-switch controller
  const handleChangeRole = (role: UserRole, activeStartupId?: string) => {
    setSession(prev => ({
      ...prev,
      role,
      activeStartupId: activeStartupId || prev.activeStartupId || 'wayki'
    }));
  };

  // Update startup state (e.g. milestones completed, Pause toggled)
  const handleUpdateStartup = (updated: StartupProject) => {
    const exists = startups.some(s => s.id === updated.id);
    const finalStartups = exists 
      ? startups.map(s => s.id === updated.id ? updated : s)
      : [updated, ...startups];
      
    setStartups(finalStartups);
    saveStoredStartups(finalStartups);
  };

  // Reset database back to factory mock settings
  const handleResetDb = () => {
    const freshStartups = resetStoredStartups();
    setStartups(freshStartups);
    setSession({
      role: UserRole.STARTUP,
      isLoggedIn: true,
      activeStartupId: 'wayki',
      walletAddress: '0x3A1b...F4e2'
    });
  };

  // Logout session handler
  const handleLogout = () => {
    setSession({
      role: UserRole.STARTUP,
      isLoggedIn: false,
      activeStartupId: 'wayki'
    });
    setCurrentView('home');
  };

  return (
    <div className="app-container">
      {currentView === 'home' && (
        <Home 
          onNavigate={setCurrentView}
          isConnected={session.isLoggedIn}
          walletAddress={session.walletAddress || ''}
          onConnectWallet={handleConnectWalletLanding}
        />
      )}

      {currentView === 'auth' && (
        <Auth 
          onNavigate={setCurrentView}
          onOnboardingComplete={handleOnboardingComplete}
          onConnectWallet={handleConnectWalletAuth}
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard 
          session={session}
          startups={startups}
          onChangeRole={handleChangeRole}
          onUpdateStartup={handleUpdateStartup}
          onResetDb={handleResetDb}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
