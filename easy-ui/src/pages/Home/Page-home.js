import React from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import Alert from "../../components/utils/Alert";
import Chatbot from "../../components/ui/Chatbot";

function PageHome({ children }) {
  return (
    <main>
      <Alert></Alert>
      <Header />
      <article>
        {children} {/* Nội dung của các route sẽ được render ở đây */}
      </article>

      <Sidebar />
      <Footer />
      <Chatbot />
    </main>
  );
}

export default PageHome;
