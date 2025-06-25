"use client";

import { Provider } from "react-redux";
import store from "@/store/root.js";
import { Toaster } from "react-hot-toast";

function Providers({ children }) {
   return (
      <Provider store={store}>
         {children}
         <Toaster />
      </Provider>
   );
}

export default Providers;
