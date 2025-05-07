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
import About from './components/ui/Profile/Show/About';
import EditProfile from './components/ui/Profile/Edit/EditProfile';
import EmailNotifications from './components/ui/Profile/Email/EmailNotifications';
import Password from './components/ui/Profile/PassWord/Password';
import Payouts from './components/ui/Profile/Payouts/Payouts';
import Social from './components/ui/Profile/Social';
import ProductDetail from './components/ui/ProductDetail/ProductDetail';
import SearchPage from './pages/Search/SearchPage';
import { CategoryList, CategoryComponents } from './components/ui/Category';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alert from './components/utils/Alert';
import VerifyEmail from './pages/VerifyEmail';
import { UserProfileProvider } from './hooks/UserProfileContext';
import BlogPage from './components/ui/Blog/BlogPage';
import BlogPost from './components/ui/Blog/BlogPost';
import BlogTagPage from './components/ui/Blog/BlogTagPage';

// Define a ProfileLayout component that wraps its children with UserProfileProvider
const ProfileLayout = ({ children }) => (
  <PageHome>
    <UserProfileProvider>
      {children}
    </UserProfileProvider>
  </PageHome>
);

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
          <Route path="/verify-email" element={<VerifyEmail />} />
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

          {/* Blog routes */}
          <Route
            path="/blog"
            element={
              <PageHome>
                <BlogPage />
              </PageHome>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <PageHome>
                <BlogPost />
              </PageHome>
            }
          />
          <Route
            path="/blog/tag/:tag"
            element={
              <PageHome>
                <BlogTagPage />
              </PageHome>
            }
          />

          {/* Profile routes with UserProfileProvider */}
          <Route
            path="/profile"
            element={
              <ProfileLayout>
                <Profile />
              </ProfileLayout>
            }
          />
          <Route
            path="/profile/about"
            element={
              <ProfileLayout>
                <Profile>
                  <About />
                </Profile>
              </ProfileLayout>
            }
          />
          <Route
            path="/profile/:id/about"
            element={
              <ProfileLayout>
                <Profile>
                  <About />
                </Profile>
              </ProfileLayout>
            }
          />
          <Route
            path="/profile/notifications"
            element={
              <ProfileLayout>
                <EmailNotifications />
              </ProfileLayout>
            }
          />
          <Route
            path="/profile/password"
            element={
              <ProfileLayout>
                <Password />
              </ProfileLayout>
            }
          />
          <Route
            path="/profile/payouts"
            element={
              <ProfileLayout>
                <Payouts />
              </ProfileLayout>
            }
          />
          <Route
            path="/profile/social"
            element={
              <ProfileLayout>
                <Social />
              </ProfileLayout>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProfileLayout>
                <EditProfile />
              </ProfileLayout>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProfileLayout>
                <Profile />
              </ProfileLayout>
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
