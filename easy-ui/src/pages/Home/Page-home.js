import React, { useState } from "react";
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
  
  return (
    <div className="page-container">
      <Alert />
      <Header />
      <main className={showSidebar ? '' : 'fullwidth'}>
        <HeroSection />
        <article>
          {children} {/* Nội dung của các route sẽ được render ở đây */}
        </article>
        {showSidebar && <Sidebar />}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default PageHome;
