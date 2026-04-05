import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { BudgetEntry, Price, Product, VendorWithCount } from '../../types';

type SearchItemType = 'route' | 'product' | 'vendor' | 'budget' | 'price';

export interface SearchResultItem {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  path: string;
  query?: string;
}

interface SearchContextValue {
  query: string;
  setQuery: (value: string) => void;
  results: SearchResultItem[];
  isOpen: boolean;
  openResults: () => void;
  closeResults: () => void;
  submitQuery: () => void;
  goToResult: (result: SearchResultItem) => void;
  isLoading: boolean;
}

const SearchContext = createContext<SearchContextValue | null>(null);

const routeSearchItems: SearchResultItem[] = [
  {
    id: 'route-dashboard',
    type: 'route',
    title: 'Dashboard',
    subtitle: 'Zur Gesamtübersicht wechseln',
    path: '/',
  },
  {
    id: 'route-prices',
    type: 'route',
    title: 'Preisvergleich',
    subtitle: 'Preise und Marktangebote durchsuchen',
    path: '/preisvergleich',
  },
  {
    id: 'route-budget',
    type: 'route',
    title: 'Budget',
    subtitle: 'Budgeteinträge und Quartalsdaten prüfen',
    path: '/budget',
  },
  {
    id: 'route-vendors',
    type: 'route',
    title: 'Lieferanten',
    subtitle: 'Lieferantenübersicht öffnen',
    path: '/vendors',
  },
];

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const matches = (value: string, query: string) => normalize(value).includes(query);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [prices, setPrices] = useState<Price[]>([]);
  const [vendors, setVendors] = useState<VendorWithCount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') ?? '';
    setQuery(q);
  }, [location.search]);

  useEffect(() => {
    if (hydratedRef.current) return;

    hydratedRef.current = true;
    setIsLoading(true);

    Promise.all([
      api.get<Price[]>('/prices').then((res) => setPrices(res.data)).catch(() => {}),
      api.get<VendorWithCount[]>('/vendors').then((res) => setVendors(res.data)).catch(() => {}),
      api.get<Product[]>('/products').then((res) => setProducts(res.data)).catch(() => {}),
      api.get<BudgetEntry[]>('/budget').then((res) => setBudgetEntries(res.data)).catch(() => {}),
    ]).finally(() => setIsLoading(false));
  }, []);

  const results = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
      return routeSearchItems;
    }

    const routeResults = routeSearchItems.filter((item) =>
      matches(item.title, normalizedQuery) || matches(item.subtitle, normalizedQuery)
    );

    const productResults: SearchResultItem[] = products
      .filter((product) =>
        matches(product.name, normalizedQuery)
        || matches(product.category, normalizedQuery)
        || matches(product.brand ?? '', normalizedQuery)
        || matches(product.model ?? '', normalizedQuery)
      )
      .slice(0, 5)
      .map((product) => ({
        id: `product-${product.id}`,
        type: 'product',
        title: product.name,
        subtitle: `${product.category}${product.brand ? ` · ${product.brand}` : ''}`,
        path: '/preisvergleich',
        query: product.name,
      }));

    const vendorResults: SearchResultItem[] = vendors
      .filter((vendor) =>
        matches(vendor.name, normalizedQuery)
        || matches(vendor.website, normalizedQuery)
      )
      .slice(0, 5)
      .map((vendor) => ({
        id: `vendor-${vendor.id}`,
        type: 'vendor',
        title: vendor.name,
        subtitle: `${vendor._count.prices} Preise · ${vendor.rating.toFixed(1)} Bewertung`,
        path: '/vendors',
        query: vendor.name,
      }));

    const budgetResults: SearchResultItem[] = budgetEntries
      .filter((entry) =>
        matches(entry.description, normalizedQuery)
        || matches(entry.category, normalizedQuery)
        || matches(entry.product?.name ?? '', normalizedQuery)
        || matches(entry.vendor?.name ?? '', normalizedQuery)
      )
      .slice(0, 5)
      .map((entry) => ({
        id: `budget-${entry.id}`,
        type: 'budget',
        title: entry.description,
        subtitle: `${entry.category} · €${(entry.amount * entry.quantity).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
        path: '/budget',
        query: entry.description,
      }));

    const priceResults: SearchResultItem[] = prices
      .filter((price) =>
        matches(price.product.name, normalizedQuery)
        || matches(price.vendor.name, normalizedQuery)
      )
      .slice(0, 5)
      .map((price) => ({
        id: `price-${price.id}`,
        type: 'price',
        title: price.product.name,
        subtitle: `${price.vendor.name} · €${price.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
        path: '/preisvergleich',
        query: `${price.product.name} ${price.vendor.name}`,
      }));

    return [
      ...routeResults,
      ...productResults,
      ...vendorResults,
      ...budgetResults,
      ...priceResults,
    ].slice(0, 10);
  }, [budgetEntries, prices, products, query, vendors]);

  const openResults = useCallback(() => setIsOpen(true), []);
  const closeResults = useCallback(() => setIsOpen(false), []);

  const goToResult = useCallback((result: SearchResultItem) => {
    const nextQuery = result.query ?? query.trim();
    const search = nextQuery ? `?q=${encodeURIComponent(nextQuery)}` : '';
    navigate(`${result.path}${search}`);
    setQuery(nextQuery);
    setIsOpen(false);
  }, [navigate, query]);

  const submitQuery = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      navigate(location.pathname);
      setIsOpen(false);
      return;
    }

    if (results.length > 0) {
      goToResult(results[0]);
      return;
    }

    navigate(`${location.pathname}?q=${encodeURIComponent(trimmed)}`);
    setIsOpen(false);
  }, [goToResult, location.pathname, navigate, query, results]);

  const value = useMemo<SearchContextValue>(() => ({
    query,
    setQuery,
    results,
    isOpen,
    openResults,
    closeResults,
    submitQuery,
    goToResult,
    isLoading,
  }), [closeResults, goToResult, isLoading, isOpen, openResults, query, results, submitQuery]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useGlobalSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useGlobalSearch must be used inside SearchProvider');
  }
  return context;
};
