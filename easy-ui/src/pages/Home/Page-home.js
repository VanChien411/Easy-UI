import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Layout/Sidebar";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import Alert from "../../components/utils/Alert";
import Chatbot from "../../components/ui/Chatbot";
import HeroSection from "../../components/ui/HeroSection/HeroSection";
import "./Page-home.css";

function PageHome({ children }) {
  // Set showSidebar to false to temporarily hide it
  const [showSidebar] = useState(false);
  const location = useLocation();
  
  // Only show HeroSection on the homepage (root path)
  const isHomePage = location.pathname === "/";
  
  return (
    <div className="page-container">
      <Alert />
      <Header />
      <main className={showSidebar ? '' : 'fullwidth'}>
        {isHomePage && <HeroSection />}
        <>
          {children} 
        </>
        {showSidebar && <Sidebar />}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default PageHome;
