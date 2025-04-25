import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = "$";
  const delivery_fee = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) return toast.error("Select Product Size");

    const userId = localStorage.getItem("userId");

    const updatedCart = structuredClone(cartItems);
    updatedCart[itemId] = updatedCart[itemId] || {};
    updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;

    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { userid: userId, token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to add to cart");
      }
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, sizes) => {
      return (
        total +
        Object.values(sizes).reduce((sum, qty) => sum + (qty || 0), 0)
      );
    }, 0);
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const userId = localStorage.getItem("userId");

    const updatedCart = structuredClone(cartItems);
    if (quantity === 0) {
      delete updatedCart[itemId]?.[size];
      if (Object.keys(updatedCart[itemId] || {}).length === 0)
        delete updatedCart[itemId];
    } else {
      updatedCart[itemId] = updatedCart[itemId] || {};
      updatedCart[itemId][size] = quantity;
    }

    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { userid: userId, token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to update quantity"
        );
      }
    }
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      const product = products.find((p) => p._id === itemId);
      if (!product) return total;

      return (
        total +
        Object.values(sizes).reduce(
          (sum, qty) => sum + (qty || 0) * product.price,
          0
        )
      );
    }, 0);
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message);
    }
  };

  // const fetchCartData = async () => {
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     const response = await axios.get(`${backendUrl}/api/cart/get`, {
  //       headers: { userid: userId, token },
  //     });

  //     if (response.data.success) {
  //       setCartItems(response.data.cartData || {});
  //     } else {
  //       toast.error(response.data.message || "Failed to fetch cart");
  //     }
  //   } catch (error) {
  //     console.error("Cart fetch failed:", error);
  //     toast.error(error.message || "Error fetching cart");
  //   }
  // };
  const fetchCartData = async (userIdOverride, tokenOverride) => {
    try {
      const userId = userIdOverride || localStorage.getItem("userId");
      const authToken = tokenOverride || token;
  
      const response = await axios.get(`${backendUrl}/api/cart/get`, {
        headers: { userid: userId, token: authToken },
      });
  
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else {
        toast.error(response.data.message || "Failed to fetch cart");
      }
    } catch (error) {
      console.error("Cart fetch failed:", error);
      toast.error(error.message || "Error fetching cart");
    }
  };
  
  // Initial load of products
  useEffect(() => {
    getProductsData();
  }, []);

  // Sync token from localStorage on mount
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken && !token) {
      setToken(localToken);
    }
  }, []);

  // Get cart after login or when token updates
  useEffect(() => {
    if (token) {
      fetchCartData();
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    fetchCartData,
    backendUrl,
    token,
    setToken,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
