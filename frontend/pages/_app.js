import '../styles/globals.css';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import { fetcher } from '../lib/fetcher-env';

// SWR configuration with environment-aware fetcher
const swrConfig = {
  fetcher: fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  // Add error handling
  onError: (error, key) => {
    console.error('SWR Error:', { error, key });
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={swrConfig}>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </SWRConfig>
  );
}

export default MyApp;