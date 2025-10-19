import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ErrorBoundary, QueryProvider } from '@/providers';
import system from '@/theme';
import 'react-material-symbols/rounded';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '@/assets/scss/main.scss';
import { Toaster } from './components/ui';
import App from './App';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ChakraProvider value={system}>
            <ErrorBoundary>
                <QueryProvider>
                    <BrowserRouter>
                        <App />
                        <Toaster />
                    </BrowserRouter>
                </QueryProvider>
            </ErrorBoundary>
        </ChakraProvider>
    </StrictMode>
);
