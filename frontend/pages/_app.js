import '../styles/globals.css';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import { taskAPI } from '../lib/api';

// SWR fetcher function
const fetcher = (url) => taskAPI.get(url).then(res => res.data);

// SWR configuration
const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  onError: (error) => {
    console.error('SWR Error:', error);
  },
};

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={swrConfig}>
      <div className="min-h-screen bg-gray-50">
        <Component {...pageProps} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </SWRConfig>
  );
}
