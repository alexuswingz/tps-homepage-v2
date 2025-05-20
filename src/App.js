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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fffbef]">
        <AnnouncementBar />
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
            </>
          } />
          <Route path="/build-bundle" element={<BuildABundlePage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
