import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg transition-colors">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
