// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabase-client";

const initialState = {
  products: [],
  totalQuantity: 0,
  totalPrice: 0,
  searchTerm: '',
  filteredProduct: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartFromDB(state, action) {
      const { products, totalQuantity, totalPrice } = action.payload;
      state.products = products;
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.filteredProduct = state.products.filter(product =>
        product.name.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }
  },
});

export const { setCartFromDB, setSearchTerm } = cartSlice.actions;
export default cartSlice.reducer;

// Async actions
export const fetchCartAsync = (userId) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = data.reduce((sum, item) => sum + item.price, 0);

    dispatch(setCartFromDB({ products: data, totalQuantity, totalPrice }));
  } catch (err) {
    console.error("Fetch cart failed:", err);
  }
};

export const addToCartAsync = (product, userId) => async (dispatch) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", product.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    if (existing) {
      await supabase
        .from("cart")
        .update({
          quantity: existing.quantity + 1,
          price: product.price * (existing.quantity + 1)
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart").insert({
        user_id: userId,
        product_id: product.id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.image
      });
    }

    dispatch(fetchCartAsync(userId));
  } catch (err) {
    console.error("Add to cart failed:", err);
  }
};

export const removeFromCartAsync = (productId, userId) => async (dispatch) => {
  try {
    await supabase
      .from("cart")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    dispatch(fetchCartAsync(userId));
  } catch (err) {
    console.error("Remove from cart failed:", err);
  }
};

export const updateCartQuantityAsync = (productId, userId, quantity, unitPrice) => async (dispatch) => {
  try {
    if (quantity <= 0) {
      return dispatch(removeFromCartAsync(productId, userId));
    }

    await supabase
      .from("cart")
      .update({
        quantity: quantity,
        price: quantity * unitPrice
      })
      .eq("user_id", userId)
      .eq("product_id", productId);

    dispatch(fetchCartAsync(userId));
  } catch (err) {
    console.error("Update quantity failed:", err);
  }
};
