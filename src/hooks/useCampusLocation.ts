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
  const [status, setStatus] = useState<PermissionStatusType>('undetermined');
  const [coords, setCoords] = useState<LocationCoordinates | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shipFee, setShipFee] = useState<number>(BASE_SHIP_FEE);
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

  // Kiểm tra quyền ban đầu
  const checkPermission = useCallback(async () => {
    try {
      const perm = await Location.getForegroundPermissionsAsync();
      if (perm.granted) {
        setStatus('granted');
        await fetchPosition();
      } else if (!perm.canAskAgain && perm.status === Location.PermissionStatus.DENIED) {
        setStatus('blocked');
      } else if (perm.status === Location.PermissionStatus.DENIED) {
        setStatus('denied');
      } else {
        setStatus('undetermined');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kiểm tra quyền');
    }
  }, []);

  // Lấy vị trí thực tế
  const fetchPosition = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const userCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      updateDistanceAndFee(userCoords);
    } catch (err: any) {
      // Nếu máy ảo không có GPS thật hoặc timeout, dùng tọa độ nội khu IUH
      console.warn('Không lấy được GPS trực tiếp, áp dụng toạ độ mô phỏng', err);
      const mockCoords = { latitude: 10.8275, longitude: 106.6912 };
      updateDistanceAndFee(mockCoords);
      setErrorMsg('Đang dùng toạ độ mô phỏng máy ảo (~0.75km)');
    } finally {
      setIsLoading(false);
    }
  };

  // Yêu cầu cấp quyền
  const requestLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await Location.requestForegroundPermissionsAsync();
      if (res.granted) {
        setStatus('granted');
        await fetchPosition();
      } else if (!res.canAskAgain) {
        setStatus('blocked');
      } else {
        setStatus('denied');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi xin quyền vị trí');
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
