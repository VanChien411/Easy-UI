import React from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Header from "../../components/Layout/Header";

function PageHome() {
  return (
    <main>
      <Header />

      <article> Content </article>

      <Sidebar />
      {/* <aside> Sidebar </aside> */}

      {/* <footer> Footer </footer> */}
    </main>
  );
}

export default PageHome;
