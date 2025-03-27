import { createSlice } from "@reduxjs/toolkit";

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
        addToCart(state, action) {
            const newItem = action.payload;
            const itemIndex = state.products.findIndex((item) => item.id === newItem.id);

            if (itemIndex !== -1) { 
                state.products[itemIndex].quantity++;
                state.products[itemIndex].totalPrice += newItem.price;
            } else {
                state.products.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    image: newItem.image,
                    quantity: 1,
                    totalPrice: newItem.price,
                });
            }
            state.totalPrice += newItem.price;
            state.totalQuantity++;
        },

        removeFromCart(state, action) {
            const id = action.payload;
            const findIndex = state.products.findIndex((item) => item.id === id);

            if (findIndex !== -1) { 
                state.totalPrice -= state.products[findIndex].totalPrice;
                state.totalQuantity -= state.products[findIndex].quantity;
                state.products.splice(findIndex, 1);
            }
        },

        incrementQuantity(state, action) {
            const id = action.payload;
            const findIndex = state.products.findIndex((item) => item.id === id);

            if (findIndex !== -1) {
                state.products[findIndex].quantity++;
                state.products[findIndex].totalPrice += state.products[findIndex].price;
                state.totalQuantity++;
                state.totalPrice += state.products[findIndex].price;
            }
        },

        decrementQuantity(state, action) {
            const id = action.payload;
            const findIndex = state.products.findIndex((item) => item.id === id);

            if (findIndex !== -1) {
                if (state.products[findIndex].quantity > 1) {
                    state.products[findIndex].quantity--;
                    state.products[findIndex].totalPrice -= state.products[findIndex].price;
                    state.totalQuantity--;
                    state.totalPrice -= state.products[findIndex].price;
                } else {
                    state.totalPrice -= state.products[findIndex].totalPrice;
                    state.totalQuantity -= state.products[findIndex].quantity;
                    state.products.splice(findIndex, 1);
                }
            }
        },

        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
            state.filteredProduct = state.products.filter(product =>
                product.name.toLowerCase().includes(state.searchTerm.toLowerCase())
            );
        }
    },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, setSearchTerm } = cartSlice.actions;
export default cartSlice.reducer;
