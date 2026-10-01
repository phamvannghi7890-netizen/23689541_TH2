// Helper lấy icon emoji đặc trưng cho món ăn & thức uống
export const getProductEmoji = (title: string = '', category: string = ''): string => {
  const t = title.toLowerCase();
  const c = category.toLowerCase();

  // Bánh mì cần kiểm tra trước mì tôm vì từ "bánh mì" có chứa chữ "mì"
  if (t.includes('bánh mì') || t.includes('bread') || t.includes('pate')) return '🥖';
  if (t.includes('mì') || t.includes('hảo hảo') || t.includes('noodle')) return '🍜';
  if (t.includes('cơm') || t.includes('onigiri') || t.includes('nắm')) return '🍙';
  if (t.includes('trà sữa') || t.includes('boba') || t.includes('trân châu')) return '🧋';
  if (t.includes('thảo mộc') || t.includes('hoa cúc') || t.includes('trà')) return '🍵';
  if (t.includes('cà phê') || t.includes('coffee') || t.includes('cafe')) return '☕';
  if (t.includes('bánh tráng') || t.includes('trộn')) return '🥗';
  if (t.includes('sâm') || t.includes('bí đao') || t.includes('nước') || c.includes('thức uống')) return '🥤';
  return '🍱';
};
