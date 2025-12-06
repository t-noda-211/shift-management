// 型定義の例
export type User = {
  id: string;
  name: string;
  email: string;
};

export type Shift = {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
};

// ユーティリティ関数の例
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

