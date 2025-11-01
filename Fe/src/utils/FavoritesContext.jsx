import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchFavoriteIds,
  addFavorite as apiAdd,
  removeFavorite as apiRemove,
} from '@services/favoriteService';
import { isAuthenticated } from '@utils/auth';
import { message } from 'antd';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [vehicleIds, setVehicleIds] = useState(new Set());
  const [batteryIds, setBatteryIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated()) return;
      setLoading(true);
      try {
        const [vRes, bRes] = await Promise.all([
          fetchFavoriteIds('vehicle'),
          fetchFavoriteIds('battery'),
        ]);
        setVehicleIds(new Set(vRes.data?.data?.ids || []));
        setBatteryIds(new Set(bRes.data?.data?.ids || []));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Clear all favorites in memory (used on logout)
  const clearAll = useCallback(() => {
    setVehicleIds(new Set());
    setBatteryIds(new Set());
  }, []);

  // React immediately to auth changes without requiring a full page reload
  useEffect(() => {
    const onLogout = () => {
      clearAll();
    };
    const onLogin = async () => {
      // re-fetch after login to sync UI
      if (!isAuthenticated()) return;
      try {
        setLoading(true);
        const [vRes, bRes] = await Promise.all([
          fetchFavoriteIds('vehicle'),
          fetchFavoriteIds('battery'),
        ]);
        setVehicleIds(new Set(vRes.data?.data?.ids || []));
        setBatteryIds(new Set(bRes.data?.data?.ids || []));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('auth:logout', onLogout);
    window.addEventListener('auth:login', onLogin);
    return () => {
      window.removeEventListener('auth:logout', onLogout);
      window.removeEventListener('auth:login', onLogin);
    };
  }, [clearAll]);

  const isFavorited = useCallback(
    (type, id) => {
      if (type === 'vehicle') return vehicleIds.has(String(id));
      return batteryIds.has(String(id));
    },
    [vehicleIds, batteryIds]
  );

  const addFavorite = useCallback(async (type, id) => {
    try {
      await apiAdd(type, id);
      if (type === 'vehicle') setVehicleIds((prev) => new Set(prev).add(String(id)));
      else setBatteryIds((prev) => new Set(prev).add(String(id)));
      message.success(`Đã thêm ${type === 'vehicle' ? 'xe' : 'pin'} vào danh sách yêu thích`);
    } catch (error) {
      message.error('Không thể thêm vào danh sách yêu thích');
      throw error;
    }
  }, []);

  const removeFavorite = useCallback(async (type, id) => {
    try {
      await apiRemove(type, id);
      if (type === 'vehicle') {
        setVehicleIds((prev) => {
          const n = new Set(prev);
          n.delete(String(id));
          return n;
        });
      } else {
        setBatteryIds((prev) => {
          const n = new Set(prev);
          n.delete(String(id));
          return n;
        });
      }
      message.success(`Đã xóa ${type === 'vehicle' ? 'xe' : 'pin'} khỏi danh sách yêu thích`);
    } catch (error) {
      message.error('Không thể xóa khỏi danh sách yêu thích');
      throw error;
    }
  }, []);

  const toggleFavorite = useCallback(
    async (type, id) => {
      if (!isAuthenticated()) {
        message.warning('Vui lòng đăng nhập để sử dụng tính năng yêu thích');
        return;
      }
      if (isFavorited(type, id)) return removeFavorite(type, id);
      return addFavorite(type, id);
    },
    [addFavorite, isFavorited, removeFavorite]
  );

  const value = useMemo(
    () => ({
      loading,
      vehicleIds,
      batteryIds,
      isFavorited,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearAll,
    }),
    [
      loading,
      vehicleIds,
      batteryIds,
      isFavorited,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearAll,
    ]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => useContext(FavoritesContext);
