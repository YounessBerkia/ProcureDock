import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { PriceComparison } from './pages/PriceComparison';
import { BudgetTracker } from './pages/BudgetTracker';
import { VendorManagement } from './pages/VendorManagement';

// main app component with routing
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/preisvergleich" element={<PriceComparison />} />
          <Route path="/budget" element={<BudgetTracker />} />
          <Route path="/vendors" element={<VendorManagement />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;