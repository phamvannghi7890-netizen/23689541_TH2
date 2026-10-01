# TH2 · PHẠM KIÊN CƯỜNG · 23689541 · https://github.com/phamvannghi7890-netizen/23689541_TH2.git · Stamp: #647961 · Số cuối: 1 · VARIANT: Watermark Dưới | Phone | Shop→Giỏ→Tôi | Selection | Phí B | Detail Card

## Thông tin sinh viên & Đề thi
- **Họ và tên:** PHẠM KIÊN CƯỜNG
- **MSSV:** 23689541
- **Lớp:** DHIOT19B
- **Môn:** LẬP TRÌNH CHO THIẾT BỊ DI ĐỘNG (TH) - ĐỀ THỰC HÀNH 2 (KTXGo)
- **Exam Stamp:** #647961
- **Clone URL:** `https://github.com/phamvannghi7890-netizen/23689541_TH2.git`

## Cấu hình Biến thể (Chữ số cuối: 1)
- **Watermark:** Dưới (`watermarkAtTop: false`) - Chuỗi hiển thị: `TH2 · 23689541 · PHẠM KIÊN CƯỜNG · #647961`
- **Ô đăng nhập (Login):** Nhập `phone` (Số điện thoại) - Lưu token `ktxgo-23689541-647961`
- **Thứ tự Tab:** Cửa hàng → Giỏ → Tôi (`shopFirst`)
- **Haptic phản hồi:** `selection` (`Haptics.selectionAsync()`)
- **Công thức tính phí ship:** Công thức B (`BASE_SHIP_FEE + Math.round(km * 1500) + 2000`)
- **Detail Presentation:** `card`
- **Các thông số theo SEED (541):**
  - `DEBOUNCE_MS`: 400ms
  - `STALE_TIME_MS`: 11,000ms
  - `PRICE_MULTIPLIER`: 25,500
  - `BASE_SHIP_FEE`: 9,000 đ
  - `ROOM_LABEL`: P.241

## Kiến trúc dự án
- **Điều hướng (Chương 5):** React Navigation V7 (RootNavigator → AuthStack / MainTabs, ShopStack: Home → Detail).
- **Lưới hiển thị & API (Chương 4 & 6):** FlashList `numColumns={2}`, ô tìm kiếm debounce `400ms`, TanStack Query `staleTime: 11,000ms`, Axios instance với interceptor `X-Student-Id: 23689541`.
- **Giỏ hàng & Đăng nhập (Chương 6):** Zustand store kết hợp middleware persist lưu trữ AsyncStorage (key: `ktxgo-cart-23689541` và `ktxgo-auth-23689541`).
- **Phần cứng & Quyền (Chương 7):** Expo Location xin quyền 3 trạng thái (granted / denied / blocked), tính khoảng cách Haversine tới toạ độ Cổng KTX IUH, mở Cài đặt với `Linking.openSettings()`, Haptic rung phản hồi khi thao tác thêm giỏ hàng.

## Ảnh chụp màn hình ứng dụng (Docs)
- **Home (FlashList 2 cột):** `docs/screenshot-th2-home.png`
- **Giỏ hàng (Cart Zustand Persist):** `docs/screenshot-th2-cart.png`