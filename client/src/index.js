import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/index";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import themes from "./themes/index.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

axios.defaults.baseURL = process.env.REACT_APP_API || "http://localhost:3001";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={themes}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
