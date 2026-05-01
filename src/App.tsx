/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';

// Pages
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import NewsDetail from './pages/NewsDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminNewsList from './pages/AdminNewsList';
import AdminEditor from './pages/AdminEditor';
import AdminAnalytics from './pages/AdminAnalytics';
import AuthorNews from './pages/AuthorNews';
import TagNews from './pages/TagNews';
import Imprint from './pages/Imprint';
import Privacy from './pages/Privacy';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function ProtectedRoute({ children, user }: { children: React.ReactElement; user: User | null | undefined }) {
  if (user === undefined) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (!user) return <Navigate to="/admin/login" />;
  return children;
}

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/yazar/:authorName" element={<AuthorNews />} />
            <Route path="/etiket/:tagName" element={<TagNews />} />
            <Route path="/kunye" element={<Imprint />} />
            <Route path="/gizlilik" element={<Privacy />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin user={user} />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute user={user}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute user={user}>
                  <AdminAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/news" 
              element={
                <ProtectedRoute user={user}>
                  <AdminNewsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/news/new" 
              element={
                <ProtectedRoute user={user}>
                  <AdminEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/news/edit/:id" 
              element={
                <ProtectedRoute user={user}>
                  <AdminEditor />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
