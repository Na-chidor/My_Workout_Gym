import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./authContext";
import App from "./App";
import { SnackbarProvider } from "notistack"; // Import SnackbarProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <React.StrictMode>
      {/* Wrap App with SnackbarProvider */}
      <SnackbarProvider
        maxSnack={3} // Maximum number of snackbars to display at once
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at top center
      >
        <App />
      </SnackbarProvider>
    </React.StrictMode>
  </AuthContextProvider>
);