import React from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Header from "../../components/Layout/Header";
import ListItem from "./List-item";

function PageHome() {
  return (
    <main>
      <Header />

      <article>
        <ListItem />
      </article>

      <Sidebar />
      {/* <footer> Footer </footer> */}
    </main>
  );
}

export default PageHome;
