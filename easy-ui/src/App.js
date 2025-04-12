import "./App.css";
import LoginSignup from "./components/ui/LoginSignup/LoginSignup";
import PageNotFound from "./components/ui/PageNotFound";
import PageHome from "./pages/Home/Page-home";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Buttons from "./components/ui/Buttons/Buttons"; // Ensure this path is correct
import AddUi from "./components/ui/Develop/AddUi";
import ShopCart from "./components/ui/ShopCart";
import Cards from "./components/ui/Cards/Cards";
import Forms from "./components/ui/Forms/Forms";
import Content from "./components/ui/Contents/Content";
import PaymentCallback from "./components/payment/PaymentCallback";
import PurchasedProducts from './components/PurchasedProducts/PurchasedProducts';

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
          <Route path="/LoginSignup/:action" element={<LoginSignup />} />
          <Route path="*" element={<PageNotFound />} />

          {/* PageHome chứa layout và các route con */}
          <Route
            path="/AddUi"
            element={
              <PageHome>
                <AddUi></AddUi>
              </PageHome>
            }
          />
          <Route
            path="/"
            element={
              <PageHome>
                <Content />
              </PageHome>
            }
          />
          <Route
            path="/Buttons"
            element={
              <PageHome>
                <Buttons />
              </PageHome>
            }
          />
          <Route
            path="/cards"
            element={
              <PageHome>
                <Cards />
              </PageHome>
            }
          />
          <Route
            path="/forms"
            element={
              <PageHome>
                <Forms />
              </PageHome>
            }
          />
          <Route
            path="/Cart"
            element={
              <PageHome>
                <ShopCart />
              </PageHome>
            }
          />
          <Route
            path="/payment/callback"
            element={
              <PageHome>
                <PaymentCallback />
              </PageHome>
            }
          />
          <Route path="/purchased-products" element={<PurchasedProducts />} />
          {/* <Route path="/about" element={<PageHome><About /></PageHome>} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
