import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { PriceCard } from './components/PriceCard';
import { MarketTrends } from './components/MarketTrends';
import { MarketInsights } from './components/MarketInsights';
import { LoginForm } from './components/admin/LoginForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer/Footer';
import { products } from './data/products';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/admin/login" />;
  }
  
  return <>{children}</>;
}

function MainApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { language } = useLanguage();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name.en.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <MarketInsights products={products} />
        <MarketTrends products={products} />
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <PriceCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {language === 'bn' 
                ? 'আপনার অনুসন্ধান অনুযায়ী কোন পণ্য পাওয়া যায়নি।' 
                : 'No items found matching your criteria.'}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/admin/login" element={<LoginForm />} />
            <Route 
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}