import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./index.css";
import Store from "./redux/store";



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={Store}>
      <Navbar />
        <App />
      <Footer />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
