import { useState, useEffect } from "react";
import Papa from "papaparse";

export interface Permit {
  st: string;
  road: string;
  pc: string;
  ward: string;
  plan: string;
  lot: string;
  contractor: string;
  blg_type: string;
  municipality: string;
  description: string;
  d_u: string;
  value: number;
  ft2: string;
  permit: string;
  appl_type: string;
  issued_date: string;
  year: number;
  month: number;
}

export function usePermitData() {
  const [data, setData] = useState<Permit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Papa.parse("/data/permits.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data as Permit[]);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });
  }, []);

  return { data, loading, error };
}
