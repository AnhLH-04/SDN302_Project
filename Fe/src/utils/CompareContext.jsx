import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';

const KEY = 'compare:selected';
// shape: { vehicles: string[], batteries: string[] }

const CompareContext = createContext(null);

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { vehicles: [], batteries: [] };
    const parsed = JSON.parse(raw);
    return {
      vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : [],
      batteries: Array.isArray(parsed.batteries) ? parsed.batteries : [],
    };
  } catch {
    return { vehicles: [], batteries: [] };
  }
};

const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const CompareProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [batteries, setBatteries] = useState([]);

  useEffect(() => {
    const { vehicles, batteries } = load();
    setVehicles(vehicles);
    setBatteries(batteries);
  }, []);

  useEffect(() => {
    save({ vehicles, batteries });
  }, [vehicles, batteries]);

  const isSelected = (type, id) => {
    id = String(id);
    return type === 'vehicle' ? vehicles.includes(id) : batteries.includes(id);
  };

  const add = (type, id, max = 4) => {
    id = String(id);
    const list = type === 'vehicle' ? vehicles : batteries;

    if (list.includes(id)) {
      return;
    }

    if (list.length >= max) {
      message.warning(`Chỉ có thể so sánh tối đa ${max} ${type === 'vehicle' ? 'xe' : 'pin'}`);
      return;
    }

    if (type === 'vehicle') {
      setVehicles((prev) => [...prev, id]);
    } else {
      setBatteries((prev) => [...prev, id]);
    }

    message.success(`Đã thêm ${type === 'vehicle' ? 'xe' : 'pin'} vào danh sách so sánh`);
  };

  const remove = (type, id) => {
    id = String(id);
    if (type === 'vehicle') setVehicles((prev) => prev.filter((x) => x !== id));
    else setBatteries((prev) => prev.filter((x) => x !== id));
    message.success(`Đã xóa ${type === 'vehicle' ? 'xe' : 'pin'} khỏi danh sách so sánh`);
  };

  const toggle = (type, id, max = 4) => {
    if (isSelected(type, id)) remove(type, id);
    else add(type, id, max);
  };

  const clear = (type) => {
    if (!type || type === 'vehicle') setVehicles([]);
    if (!type || type === 'battery') setBatteries([]);
  };

  const value = useMemo(
    () => ({ vehicles, batteries, isSelected, add, remove, toggle, clear }),
    [vehicles, batteries]
  );
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};

export const useCompare = () => useContext(CompareContext);
