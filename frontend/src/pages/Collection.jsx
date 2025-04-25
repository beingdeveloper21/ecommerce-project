import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const toggleCategory = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };
  useEffect(() => {
    console.log("Products Data:", products); // Debugging step
  
    let productsCopy = [...products];
  
    // 1. Apply search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      console.log("After Search Filter:", productsCopy); // Debugging step
    }
  
    // 2. Apply category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => {
        const itemCategory = item.category?.toLowerCase().trim() || '';
        return category.includes(itemCategory);
      });
      console.log("After Category Filter:", productsCopy); // Debugging step
    }
  
    // 3. Apply subcategory filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => {
        const itemSubCategory = item.subCategory?.toLowerCase().trim() || '';
        return subCategory.includes(itemSubCategory);
      });
      console.log("After SubCategory Filter:", productsCopy); // Debugging step
    }
  
    // 4. Sort the filtered products
    switch (sortType) {
      case 'low-high':
        productsCopy.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'high-low':
        productsCopy.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'relevant':
      default:
        break; // no additional sorting
    }
  
    setFilterProducts(productsCopy);
  }, [products, search, showSearch, category, subCategory, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-5 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category */}
        <div
          className={`border border-gray-700 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}
        >
          <p className="mb=3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'men'}
                onChange={toggleCategory}
              />
              Men
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'women'}
                onChange={toggleCategory}
              />
              Women
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'kids'}
                onChange={toggleCategory}
              />
              Kids
            </p>
          </div>
        </div>

        {/* SubCategories */}
        <div
          className={`border border-gray-700 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}
        >
          <p className="mb=3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'topwear'}
                onChange={toggleSubCategory}
              />
              Topwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'bottomwear'}
                onChange={toggleSubCategory}
              />
              Bottomwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'winterwear'}
                onChange={toggleSubCategory}
              />
              Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4 ml-5">
          <Title text1={'ALL'} text2={' COLLECTIONS'} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low-High</option>
            <option value="high-low">Sort by: High-Low</option>
          </select>
        </div>

        {/* MAP PRODUCTS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
