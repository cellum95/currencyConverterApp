import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setFromCurrency, setToCurrency, setAmount, setResult } from '../components/currencySlice'; // Assuming you have a currencySlice
import { RootState } from '../components/store'; // Assuming you have a store file

interface ExchangeRate {
  [currency: string]: number;
}

interface ExchangeRatesResponse {
  rates: ExchangeRate;
}

const fetchExchangeRates = async (baseCurrency: string): Promise<ExchangeRatesResponse> => {
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const CurrencyConverter: React.FC = () => {
  const dispatch = useDispatch();
  const { fromCurrency, toCurrency, amount, result } = useSelector((state: RootState) => state.currency);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);

  const { data: exchangeRates, isError, isLoading, error } = useQuery<ExchangeRatesResponse>({
    queryKey: ['exchangeRates', fromCurrency],
    queryFn: () => fetchExchangeRates(fromCurrency),
    enabled: !!fromCurrency,
  });

  useEffect(() => {
    if (exchangeRates && exchangeRates.rates) {
      setAvailableCurrencies(Object.keys(exchangeRates.rates));
    }
  }, [exchangeRates]);

  const handleFromCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFromCurrency(event.target.value));
  };

  const handleToCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setToCurrency(event.target.value));
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    dispatch(setAmount(isNaN(value) ? 0 : value));
  };

  useEffect(() => {
    if (exchangeRates && exchangeRates.rates && toCurrency) {
      const rate = exchangeRates.rates[toCurrency];
      if (!isNaN(amount) && rate !== undefined) {
          const convertedAmount = amount * rate;
          dispatch(setResult(convertedAmount));
      } else {
        dispatch(setResult(0));
      }
    }
  }, [amount, toCurrency, exchangeRates, dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={handleAmountChange} />
      </div>
      <div>
        <label>From:</label>
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {availableCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>To:</label>
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {availableCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Result:</label>
        <input type="text" value={result.toFixed(2)} readOnly />
      </div>
    </div>
  );
};

export default CurrencyConverter;