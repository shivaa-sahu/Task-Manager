import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) setToken(saved);
  }, []);

  return <Component {...pageProps} token={token} setToken={setToken}/>;
}
