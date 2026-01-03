import React, { useEffect, useState } from 'react';
import { useApp, AppProvider } from './store/AppContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { IncidentFeed } from './pages/IncidentFeed';
import { CreateIncident } from './pages/CreateIncident';
import { IncidentDetail } from './pages/IncidentDetail';
import { AuditLogs } from './pages/AuditLogs';
import { UserManagement } from './pages/UserManagement';
import { ProfilePage } from './pages/ProfilePage';

const Router: React.FC = () => {
  const { currentUser } = useApp();
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (!currentUser) return <LoginPage />;

  const renderContent = () => {
    // Standardize path parsing: remove leading # and split
    const path = hash.replace(/^#\/?/, '');
    const parts = path.split('/');
    const page = parts[0] || 'dashboard';
    const id = parts[1];

    switch (page) {
      case 'dashboard': 
        return <Dashboard />;
      case 'incidents':
        if (id === 'new') return <CreateIncident />;
        if (id) return <IncidentDetail id={id} />;
        return <IncidentFeed />;
      case 'audit-logs': 
        return <AuditLogs />;
      case 'users': 
        return <UserManagement />;
      case 'profile': 
        return <ProfilePage />;
      default: 
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
};

export default App;