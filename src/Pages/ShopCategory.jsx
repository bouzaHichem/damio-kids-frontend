import React, { useEffect, useState, useMemo } from "react";
import { backend_url } from "../App";
import { productService } from '../services/apiService';
import "./CSS/ShopCategory.css";
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";
import { getImageUrl } from '../utils/imageUtils';

// Normalize a string to a URL-friendly slug (remove accents/diacritics)
const slugify = (str = '') =>
  (str || '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const ShopCategory = (props) => {

  const [allproducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryBanner, setCategoryBanner] = useState('');

  const fetchInfo = async () => { 
    try {
      const cat = categories.find(c => slugify(c.name) === slugify(String(props.category)));
      if (!cat) { setAllProducts([]); return; }
      const res = await productService.searchProducts({ categoryId: cat._id, page: 1, limit: 120 });
      const list = res?.products || res?.data?.products || [];
      setAllProducts(list);
    } catch (e) {
      console.error('Category fetch failed', e);
      setAllProducts([]);
    }
  }

  const fetchCategories = () => {
    fetch(`${backend_url}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }

    useEffect(() => {
      fetchCategories();
    }, [])

    useEffect(() => {
      if (categories.length) {
        fetchInfo();
      }
    }, [categories, props.category])

    // Update banner when categories or selected category change
    useEffect(() => {
      if (categories.length > 0 && props.category) {
        const match = categories.find(c => slugify(c.name) === slugify(String(props.category)));
        if (match?.bannerImage) {
          setCategoryBanner(getImageUrl(match.bannerImage));
        } else {
          setCategoryBanner('');
        }
      }
    }, [categories, props.category])

    // With server-side filtering, just mirror the loaded list
    useEffect(() => {
      setFilteredProducts(allproducts);
    }, [allproducts])
    
  return (
    <div className="shopcategory">
      <img src={categoryBanner || props.banner} className="shopcategory-banner" alt="Category banner" />
      <div className="shopcategory-indexSort">
        <p><span>Showing 1 - {filteredProducts.length}</span> out of {filteredProducts.length} Products</p>
        <div className="shopcategory-sort">Sort by  <img src={dropdown_icon} alt="" /></div>
      </div>
      <div className="shopcategory-products">
        {filteredProducts.map((item,i) => {
          return <Item id={item.id} key={i} name={item.name} image={item.image}  new_price={item.new_price} old_price={item.old_price}/>;
        })}
      </div>
      <div className="shopcategory-loadmore">
      <Link to='/' style={{ textDecoration: 'none' }}>Explore More</Link>
      </div>
    </div>
  );
};

export default ShopCategory;
