import "./App.css";
import PageNotFound from "./components/ui/PageNotFound";
import ListItem from "./pages/Home/List-item";
import PageHome from "./pages/Home/Page-home";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <PageHome>
          <Routes>
            {/* Các route */}
            <Route path="/" element={<ListItem />} />
            {/* Route không tìm thấy sẽ chuyển đến NotFound */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </PageHome>
      </Router>
    </div>
  );
}

export default App;
