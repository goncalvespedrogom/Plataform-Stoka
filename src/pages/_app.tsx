import { useEffect, useState } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import 'react-datepicker/dist/react-datepicker.css';
import { ProductProvider } from '../components/sections/register/ProductContext';
import { TaskProvider } from '../components/sections/tasks/TaskContext';

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // ou um loading

  return (
    <ProductProvider>
      <TaskProvider>
        <Component {...pageProps} />
      </TaskProvider>
    </ProductProvider>
  );
}
