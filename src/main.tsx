import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { ErrorBoundary, QueryProvider } from '@/providers';
import system from '@/theme';
import '@/assets/scss/main.scss';
import 'react-material-symbols/rounded';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ChakraProvider value={system}>
            <ErrorBoundary>
                <QueryProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </QueryProvider>
            </ErrorBoundary>
        </ChakraProvider>
    </StrictMode>
);
