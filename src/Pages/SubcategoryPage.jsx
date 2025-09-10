import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backend_url } from '../App';
import { productService } from '../services/apiService';
import Item from '../Components/Item/Item';
import './CSS/ShopCategory.css';
import { useI18n } from '../utils/i18n';

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
  const { t } = useI18n();
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const catsRes = await fetch(`${backend_url}/categories`).then(r => r.json());
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
    const fetchBySub = async () => {
      if (!active?.cat || !active?.sub) return;
      try {
        const res = await productService.searchProducts({
          categoryId: active.cat._id,
          subcategoryId: active.sub.id,
          page: 1,
          limit: 100
        });
        const list = res?.products || res?.data?.products || [];
        setFiltered(list);
      } catch (e) {
        console.error('Subcategory fetch failed', e);
        setFiltered([]);
      }
    };
    fetchBySub();
  }, [active]);

  if (loading) {
    return (
      <div className="shopcategory">
        <div className="shopcategory-indexSort" style={{justifyContent:'center'}}>{t('loading.generic')}</div>
      </div>
    );
  }

  if (!active?.cat || !active?.sub) {
    return (
      <div className="shopcategory">
        <div className="shopcategory-indexSort" style={{justifyContent:'center'}}>
          {t('category.subcategory_not_found')}
        </div>
      </div>
    );
  }

  return (
    <div className="shopcategory">
      <div className="shopcategory-indexSort">
        <p>
          <span>{active.cat.name} / {active.sub.name}</span> — {filtered.length} {t('home.stats.products_label')}
        </p>
        <button className="shopcategory-sort" onClick={() => navigate(`/${slugify(active.cat.name)}`)}>{t('category.back_to', { name: active.cat.name })}</button>
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
