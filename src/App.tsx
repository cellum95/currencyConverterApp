import React from 'react';
import CurrencyConverter from './pages/CurrencyConverter'; // Adjust the path as needed
import { Provider } from 'react-redux';
import { store } from './components/store'; // Adjust the path as needed
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <div className="App">
          <h1>Currency Converter</h1>
          <CurrencyConverter />
        </div>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;