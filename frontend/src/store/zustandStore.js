import { create } from 'zustand';

const defaultCategories = [
  { name: 'Food', icon: '🍔', color: '#FF6B6B' },
  { name: 'Transport', icon: '🚗', color: '#4ECDC4' },
  { name: 'Entertainment', icon: '🎬', color: '#45B7D1' },
  { name: 'Utilities', icon: '💡', color: '#FFA502' },
  { name: 'Shopping', icon: '🛍️', color: '#FF69B4' },
  { name: 'Health', icon: '🏥', color: '#6BCB77' },
  { name: 'Other', icon: '📌', color: '#9D84B7' }
];

export const useCategoryStore = create((set) => ({
  categories: defaultCategories,
  addCategory: (cat) => set((state) => ({ categories: [...state.categories, cat] })),
  resetCategories: () => set({ categories: defaultCategories })
}));
