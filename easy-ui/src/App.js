import "./App.css";
import LoginSignup from "./components/ui/LoginSignup/LoginSignup";
import PageNotFound from "./components/ui/PageNotFound";
import PageHome from "./pages/Home/Page-home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Buttons from "./components/ui/Buttons/Buttons"; // Ensure this path is correct
import AddUi from "./components/ui/Develop/AddUi";
import ShopCart from "./components/ui/ShopCart";
import Cards from "./components/ui/Cards/Cards";
import Forms from "./components/ui/Forms/Forms";
import Content from "./components/ui/Contents/Content";
import PaymentCallback from "./components/payment/PaymentCallback";
import PurchasedProducts from './components/ui/PurchasedProducts/PurchasedProducts';
import Profile from './components/ui/Profile/Profile';
import About from './components/ui/Profile/About';
import EditProfile from './components/ui/Profile/EditProfile';
import ProductDetail from './components/ui/ProductDetail/ProductDetail';
import SearchPage from './pages/Search/SearchPage';
import { CategoryList, CategoryComponents } from './components/ui/Category';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alert from './components/utils/Alert';

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
            path="/search/:keyword"
            element={
              <PageHome>
                <SearchPage />
              </PageHome>
            }
          />
          <Route
            path="/categories"
            element={
              <PageHome>
                <CategoryList />
              </PageHome>
            }
          />
          <Route
            path="/category/:categoryId"
            element={
              <PageHome>
                <CategoryComponents />
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
          <Route
            path="/profile"
            element={
              <PageHome>
                <Profile />
              </PageHome>
            }
          />
          <Route
            path="/profile/about"
            element={
              <PageHome>
                <Profile>
                  <About />
                </Profile>
              </PageHome>
            }
          />
          <Route
            path="/profile/:id/about"
            element={
              <PageHome>
                <Profile>
                  <About />
                </Profile>
              </PageHome>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <PageHome>
                <EditProfile />
              </PageHome>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PageHome>
                <Profile />
              </PageHome>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PageHome>
                <ProductDetail />
              </PageHome>
            }
          />
          <Route
            path="/components"
            element={
              <PageHome>
                <Content />
              </PageHome>
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
      <Alert />
    </div>
  );
}

export default App;
