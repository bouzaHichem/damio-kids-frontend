import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backend_url } from '../App';
import Item from '../Components/Item/Item';
import './CSS/ShopCategory.css';

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

const SubcategoryPage = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetch(`${backend_url}/allproducts`).then(r => r.json()),
        fetch(`${backend_url}/categories`).then(r => r.json())
      ]);
      if (Array.isArray(prodsRes)) setAllProducts(prodsRes);
      if (catsRes?.success) setCategories(catsRes.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [category, subcategory]);

  const active = useMemo(() => {
    const cat = categories.find(c => slugify(c.name) === slugify(category));
    if (!cat) return null;
    const sub = (cat.subcategories || []).find(s => slugify(s.name) === slugify(subcategory));
    return { cat, sub };
  }, [categories, category, subcategory]);

  useEffect(() => {
    if (!active) return;
    const { cat, sub } = active;

    const matchCategory = (p) => {
      // category stored as name or Mongo _id
      return (
        (typeof p.category === 'string' && slugify(p.category) === slugify(cat.name)) ||
        (p.category && String(p.category) === String(cat._id)) ||
        (p.categoryName && slugify(p.categoryName) === slugify(cat.name))
      );
    };

    const matchSubcategory = (p) => {
      // subcategory can be id (number/string) or name
      if (!sub) return true; // should not happen, but be defensive
      if (p.subcategory == null) return false;
      return (
        String(p.subcategory) === String(sub.id) ||
        slugify(String(p.subcategory)) === slugify(sub.name)
      );
    };

    const list = allProducts.filter(p => matchCategory(p) && matchSubcategory(p));
    setFiltered(list);
  }, [allProducts, active]);

  if (loading) {
    return (
      <div className="shopcategory">
        <div className="shopcategory-indexSort" style={{justifyContent:'center'}}>Loading...</div>
      </div>
    );
  }

  if (!active?.cat || !active?.sub) {
    return (
      <div className="shopcategory">
        <div className="shopcategory-indexSort" style={{justifyContent:'center'}}>
          Subcategory not found
        </div>
      </div>
    );
  }

  return (
    <div className="shopcategory">
      <div className="shopcategory-indexSort">
        <p>
          <span>{active.cat.name} / {active.sub.name}</span> — {filtered.length} products
        </p>
        <button className="shopcategory-sort" onClick={() => navigate(`/${slugify(active.cat.name)}`)}>Back to {active.cat.name}</button>
      </div>
      <div className="shopcategory-products">
        {filtered.map((item,i) => (
          <Item id={item.id} key={i} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        ))}
      </div>
    </div>
  );
};

export default SubcategoryPage;
