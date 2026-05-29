import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { SettingsProvider } from './context/settings.jsx';
import { ThemeProvider } from './context/theme.jsx';
import App from './App.jsx';
import './styles/index.css';
import './i18n/config.js'; // load translations

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider>
          <SettingsProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <App />
              <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  style: {
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                  },
                  duration: 3500,
                }}
              />
            </BrowserRouter>
          </SettingsProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
