import React from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Header from "../../components/Layout/Header";
import ListItem from "./List-item";
import Footer from "../../components/Layout/Footer";

function PageHome() {
  return (
    <main>
      <Header />

      <article>
        <ListItem />
      </article>

      <Sidebar />
      <Footer />
    </main>
  );
}

export default PageHome;
