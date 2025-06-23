import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import { Music } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
const MusicApp = React.lazy(() => import('musicLibrary/App'));

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function Dashboard() {
  const { user, logout } = useAuth();
  
  const handleLikedChange = (likedList) => {
    console.log('Liked songs updated:', likedList);
  };

  return (
    <div className="flex full-screen bg-green-80 flex-col h-screen overflow-hidden">
      <div className="bg-white border-radius-xl rounded-2xl shadow-lg p-4 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Music className="text-green-500" size={28} />
          <h1 className="text-2xl font-bold text-green-700">Yapple Music</h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 rounded-full border border-green-300 text-green-700 text-xs font-semibold bg-green-50">
                {user.role === 'admin' ? 'admin' : 'user'}
              </span>
              <div className="w-9 h-9 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                {user.role === 'admin' ? 'A' : 'U'}
              </div>
              <button 
                className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 font-semibold ml-2" 
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <React.Suspense fallback={<div className="flex justify-center items-center h-64">Loading Music App...</div>}>
          {user && (
            <MusicApp 
              userRole={user.role}
              authToken={user.jwt}
              onLikedChange={handleLikedChange}
            />
          )}
        </React.Suspense>
      </div>
    </div>
  );
}

function MainApp() {
  const { user, login, logout } = useAuth();

  const handleLikedChange = (likedList) => {
    console.log('Liked songs updated:', likedList);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage onLogin={login} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error loading micro frontend:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

