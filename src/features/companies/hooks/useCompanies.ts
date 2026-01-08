import { useEffect, useState } from 'react';
import { companyService } from '../services/companyService';

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    companyService.getCompanies()
      .then(setCompanies)
      .catch((err) => setError(err?.message || 'Error al cargar compañías'))
      .finally(() => setLoading(false));
  }, []);

  return { companies, loading, error };
};
