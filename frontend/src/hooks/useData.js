import { useEffect, useState } from "react";
import { api } from "../api";

export function useData(path, token) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function reload() {
    try {
      setLoading(true);
      setError("");
      const data = await api(path, token);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setItems([]);
    async function load() {
      try {
        const data = await api(path, token);
        if (active) setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) setError(error.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [path, token]);
  return { items, loading, error, reload };
}
