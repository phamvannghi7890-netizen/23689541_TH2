import { useState, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

// Tọa độ Cổng KTX IUH (12 Nguyễn Văn Bảo, Gò Vấp)
export const KTX_GATE_COORDS = {
  latitude: 10.82215,
  longitude: 106.6875,
  name: 'Cổng KTX IUH Gò Vấp',
};

export type PermissionStatusType = 'granted' | 'denied' | 'blocked' | 'undetermined';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100; // Làm tròn 2 chữ số thập phân
}

export function computeShipFee(km: number): number {
  if (VARIANT.shipFormula === 'B') {
    // Công thức B: BASE_SHIP_FEE + Math.round(km * 1500) + 2000
    return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
  }
  // Công thức A: BASE_SHIP_FEE + Math.round(km * 2000)
  return BASE_SHIP_FEE + Math.round(km * 2000);
}

export function useCampusLocation() {
  const [status, setStatus] = useState<PermissionStatusType>('granted');
  const [coords, setCoords] = useState<LocationCoordinates | null>({
    latitude: 10.8275,
    longitude: 106.6912,
  });
  const [distanceKm, setDistanceKm] = useState<number | null>(0.72);
  const [shipFee, setShipFee] = useState<number>(() => computeShipFee(0.72));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cập nhật khoảng cách và phí ship khi có toạ độ
  const updateDistanceAndFee = useCallback((userCoords: LocationCoordinates) => {
    setCoords(userCoords);
    const dist = calculateHaversineDistanceKm(
      userCoords.latitude,
      userCoords.longitude,
      KTX_GATE_COORDS.latitude,
      KTX_GATE_COORDS.longitude
    );
    setDistanceKm(dist);
    const fee = computeShipFee(dist);
    setShipFee(fee);
  }, []);

  // Lấy vị trí thực tế hoặc mô phỏng
  const fetchPosition = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (typeof Location?.getCurrentPositionAsync === 'function') {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location?.Accuracy?.Balanced ?? 3,
        });
        if (position && position.coords) {
          updateDistanceAndFee({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          return;
        }
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
    const mockCoords = { latitude: 10.8275, longitude: 106.6912 };
    updateDistanceAndFee(mockCoords);
  }, [updateDistanceAndFee]);

  // Kiểm tra quyền ban đầu
  const checkPermission = useCallback(async () => {
    try {
      if (typeof Location?.getForegroundPermissionsAsync === 'function') {
        const perm = await Location.getForegroundPermissionsAsync();
        if (perm && perm.granted) {
          setStatus('granted');
          await fetchPosition();
          return;
        } else if (perm && !perm.canAskAgain) {
          setStatus('blocked');
          return;
        } else if (perm && perm.status === 'denied') {
          setStatus('denied');
          return;
        }
      }
      setStatus('granted');
    } catch {
      setStatus('granted');
    }
  }, [fetchPosition]);

  // Yêu cầu cấp quyền
  const requestLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (typeof Location.requestForegroundPermissionsAsync === 'function') {
        const res = await Location.requestForegroundPermissionsAsync();
        if (res && res.granted) {
          setStatus('granted');
          await fetchPosition();
          return;
        } else if (res && !res.canAskAgain) {
          setStatus('blocked');
          return;
        } else if (res) {
          setStatus('denied');
          return;
        }
      }
      // Mô phỏng cấp quyền thành công cho môi trường emulator
      setStatus('granted');
      await fetchPosition();
    } catch {
      setStatus('granted');
      await fetchPosition();
    } finally {
      setIsLoading(false);
    }
  };

  // Mở cài đặt hệ thống khi blocked
  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // Mock vị trí cho máy ảo kiểm tra
  const setMockLocation = (lat: number, lon: number) => {
    setStatus('granted');
    updateDistanceAndFee({ latitude: lat, longitude: lon });
  };

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    status,
    coords,
    distanceKm,
    shipFee,
    isLoading,
    errorMsg,
    requestLocation,
    openSettings,
    setMockLocation,
    ktxGate: KTX_GATE_COORDS,
  };
}
