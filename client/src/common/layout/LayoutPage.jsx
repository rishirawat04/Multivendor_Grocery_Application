import React from 'react';
import HeaderPage from './HeaderPage';
import FooterPage from './FooterPage';


const LayoutPage = ({ children }) => {
  return (
    <div>
      <HeaderPage />
      <main className="container mx-auto p-4">
        {children}
      </main>
      <FooterPage />
    </div>
  );
}

export default LayoutPage;
