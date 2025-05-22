import './App.css';
import AnnouncementBar from './components/announcement-bar';
import NavBar from './components/nav-bar';
import HeroSection from './components/hero-section';
import BuildBundleSection from './components/build-bundle-section';
import BuildABundlePage from './components/BuildABundlePage';
import ShopByPlant from './components/shopy-by-plant';
import MonsteraProductSection from './components/monstera-product-section';
import CustomerReviews from './components/customer-reviews';
import ComparisonChart from './components/comparison-chart';
import Footer from './components/footer';
import LeafDivider from './components/LeafDivider';
import AnimatedLeafDivider from './components/AnimatedLeafDivider';
import ProductsPage from './components/ProductsPage';
import CategoryPage from './components/CategoryPage';
import ProductPage from './components/ProductPage';
import MobileNewsletter from './components/MobileNewsletter';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import CartDrawer from './components/CartDrawer';

function App() {
  return (
    <CartProvider>
      <Router>
        {/* Cart Drawer - Positioned outside main content to cover full viewport */}
        <CartDrawer />
        
        <div className="min-h-screen bg-[#fffbef] relative">
          <NavBar />
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <LeafDivider />
                <BuildBundleSection />
                <LeafDivider />
                <ShopByPlant />
                <LeafDivider />
                <MonsteraProductSection />
                <LeafDivider />
                <CustomerReviews />
                <AnimatedLeafDivider />
                <ComparisonChart />
                <MobileNewsletter />
              </>
            } />
            <Route path="/build-bundle" element={<BuildABundlePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
