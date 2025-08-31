import "./App.css";
import LoginSignup from "./components/ui/LoginSignup/LoginSignup";
import LoginModal from "./components/ui/LoginSignup/LoginModal";
import PageNotFound from "./components/ui/PageNotFound";
import PageHome from "./pages/Home/Page-home";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
import { LoginModalProvider, useLoginModal } from './hooks/useLoginModal';
import BlogPage from './components/ui/Blog/BlogPage';
import BlogPost from './components/ui/Blog/BlogPost';
import BlogTagPage from './components/ui/Blog/BlogTagPage';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Define a ProfileLayout component that wraps its children with UserProfileProvider
const ProfileLayout = ({ children }) => (
  <PageHome>
    <UserProfileProvider>
      {children}
    </UserProfileProvider>
  </PageHome>
);

// RequireAuth component to protect routes
const RequireAuth = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    // Chỉ kiểm tra một lần duy nhất
    if (isAuthenticated === null) {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      
      // Nếu không có token và chưa ở trang login, chuyển hướng một lần duy nhất
      if (!token && !location.pathname.includes('/LoginSignup')) {
        const returnPath = encodeURIComponent(location.pathname);
        // Sử dụng window.location thay vì navigate để tránh React Router loops
        window.location.replace(`/LoginSignup/login?returnTo=${returnPath}`);
      }
    }
  }, [location.pathname, isAuthenticated]);
  
  // Hiện loading trong khi kiểm tra xác thực
  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  // Nếu đã xác thực, hiển thị children
  if (isAuthenticated) {
    return children;
  }
  
  // Nếu chưa xác thực và đang ở trong quá trình chuyển hướng, hiển thị loading
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Redirecting to login...</p>
    </div>
  );
};

function App() {
  return (
    <LoginModalProvider>
      <div className="App">
        <Router>
          {/* Các route của ứng dụng */}
          <Routes>
            {/* Public routes */}
            <Route path="/LoginSignup" element={<LoginSignup />} />
            <Route path="/LoginSignup/:action" element={<LoginSignup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Root route - always accessible */}
            <Route 
              path="/" 
              element={
                <PageHome>
                  <Content />
                </PageHome>
              } 
            />

          {/* Protected routes */}
          <Route
            path="/AddUi"
            element={
              <RequireAuth>
                <PageHome>
                  <AddUi></AddUi>
                </PageHome>
              </RequireAuth>
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
              <RequireAuth>
                <PageHome>
                  <Buttons />
                </PageHome>
              </RequireAuth>
            }
          />
          <Route
            path="/cards"
            element={
              <RequireAuth>
                <PageHome>
                  <Cards />
                </PageHome>
              </RequireAuth>
            }
          />
          <Route
            path="/forms"
            element={
              <RequireAuth>
                <PageHome>
                  <Forms />
                </PageHome>
              </RequireAuth>
            }
          />
          <Route
            path="/Cart"
            element={
              <RequireAuth>
                <PageHome>
                  <ShopCart />
                </PageHome>
              </RequireAuth>
            }
          />
          <Route
            path="/payment/callback"
            element={
              <RequireAuth>
                <PageHome>
                  <PaymentCallback />
                </PageHome>
              </RequireAuth>
            }
          />
          <Route 
            path="/purchased-products" 
            element={
              <RequireAuth>
                <PurchasedProducts />
              </RequireAuth>
            } 
          />

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
              <RequireAuth>
                <ProfileLayout>
                  <Profile />
                </ProfileLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/about"
            element={
              <RequireAuth>
                <ProfileLayout>
                  <Profile>
                    <About />
                  </Profile>
                </ProfileLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/:id/about"
            element={
              <RequireAuth>
                <ProfileLayout>
                  <Profile>
                    <About />
                  </Profile>
                </ProfileLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/notifications"
            element={
              <RequireAuth>
                <ProfileLayout>
                  <EmailNotifications />
                </ProfileLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/password"
            element={
              <RequireAuth>
                <ProfileLayout>
                  <Password />
                </ProfileLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/payouts"
            element={
              <RequireAuth>
                <ProfileLayout>
                  <Payouts />
                </ProfileLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/social"
            element={
              <RequireAuth>
                <ProfileLayout>
                  <Social />
                </ProfileLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <RequireAuth>
                <ProfileLayout>
                  <EditProfile />
                </ProfileLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <RequireAuth>
                <ProfileLayout>
                  <Profile />
                </ProfileLayout>
              </RequireAuth>
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
          
          {/* Catch all route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <ToastContainer />
      <Alert />
      <LoginModalWrapper />
    </div>
    </LoginModalProvider>
  );
}

// Component để render LoginModal
function LoginModalWrapper() {
  const { isModalOpen, closeLoginModal, handleLoginSuccess } = useLoginModal();
  
  return (
    <LoginModal
      isOpen={isModalOpen}
      onClose={closeLoginModal}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;
