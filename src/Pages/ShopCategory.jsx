import React, { useEffect, useState } from "react";
import { backend_url } from "../App";
import "./CSS/ShopCategory.css";
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";

const ShopCategory = (props) => {

  const [allproducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchInfo = () => { 
    fetch(`${backend_url}/allproducts`)
            .then((res) => res.json()) 
            .then((data) => setAllProducts(data))
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
      fetchInfo();
      fetchCategories();
    }, [])

    // Filter products when allproducts or categories change
    useEffect(() => {
      if (allproducts.length > 0 && categories.length > 0) {
        const filtered = allproducts.filter((item) => {
          // First, try to match by category name directly
          if (item.category === props.category) {
            return true;
          }
          
          // Then, try to match by category ID
          const matchingCategory = categories.find(cat => 
            cat.name === props.category || cat._id === item.category
          );
          
          if (matchingCategory && matchingCategory._id === item.category) {
            return true;
          }
          
          return false;
        });
        setFilteredProducts(filtered);
      } else {
        // Fallback to direct category name matching if categories haven't loaded yet
        const filtered = allproducts.filter((item) => item.category === props.category);
        setFilteredProducts(filtered);
      }
    }, [allproducts, categories, props.category])
    
  return (
    <div className="shopcategory">
      <img src={props.banner} className="shopcategory-banner" alt="" />
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
