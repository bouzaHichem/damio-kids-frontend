import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import AllProducts from "./Pages/AllProducts";
import Cart from "./Pages/Cart";
import CheckoutPage from "./Pages/CheckoutPage"
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import women_banner from "./Components/Assets/girl-hero.png";
import men_banner from "./Components/Assets/Garçon-hero.png";
import kid_banner from "./Components/Assets/bebe-hero.png";
import LoginSignup from "./Pages/LoginSignup";
import OrderConfirmation from "./Pages/OrderConfirmation"
import CollectionPage from "./Pages/CollectionPage"
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";


export const backend_url = 'https://damio-kids-final-project-2cduwp85k-hichems-projects-d5b6dfcd.vercel.app';
export const currency = 'د.ج';

function App() {

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop gender="all" />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/garcon" element={<ShopCategory banner={men_banner} category="garcon" />} />
          <Route path="/fille" element={<ShopCategory banner={women_banner} category="fille" />} />
          <Route path="/bébé" element={<ShopCategory banner={kid_banner} category="bébé" />} />
          <Route path='/product' element={<Product />}>
            <Route path=':productId' element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/OrderConfirmation" element={<OrderConfirmation />} />
          <Route path="/collections/:collectionId" element={<CollectionPage />} />

          <Route path="/login" element={<LoginSignup/>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
