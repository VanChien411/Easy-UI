import "./App.css";
import PageNotFound from "./components/ui/PageNotFound";
import ListItem from "./pages/Home/List-item";
import PageHome from "./pages/Home/Page-home";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        {/* Liên kết điều hướng */}
        {/* <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/about">About</Link>
        </nav> */}

        {/* Các route của ứng dụng */}
        <Routes>
          {/* Các route không có layout */}
          <Route path="/11" element={<PageNotFound />} />
          <Route path="*" element={<PageNotFound />} />

          {/* PageHome chứa layout và các route con */}
          <Route
            path="/"
            element={
              <PageHome>
                <ListItem />
              </PageHome>
            }
          />
          {/* <Route path="/login" element={<PageHome><Login /></PageHome>} />
          <Route path="/about" element={<PageHome><About /></PageHome>} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
