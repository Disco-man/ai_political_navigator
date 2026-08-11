import { create } from 'zustand'

export const useAppStore = create((set) => ({
  // Countries data
  countries: [],
  currentCountry: null,
  
  // UI state
  isChatOpen: false,
  isLoading: false,
  isQuizOpen: false,
  quizXp: typeof window !== 'undefined' ? parseInt(localStorage.getItem('political_navigator_quiz_xp') || '0', 10) : 0,
  
  // Chat state
  chatHistory: [],
  chatContext: null,
  
  // Actions
  setCountries: (countries) => set({ countries }),
  setCurrentCountry: (country) => set({ currentCountry: country }),
  
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),

  openQuiz: () => set({ isQuizOpen: true }),
  closeQuiz: () => set({ isQuizOpen: false }),
  setQuizXp: (xp) => {
    if (typeof window !== 'undefined') localStorage.setItem('political_navigator_quiz_xp', String(xp))
    set({ quizXp: xp })
  },
  addQuizXp: (delta) => set((state) => {
    const newXp = state.quizXp + delta
    if (typeof window !== 'undefined') localStorage.setItem('political_navigator_quiz_xp', String(newXp))
    return { quizXp: newXp }
  }),
  resetQuizXp: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('political_navigator_quiz_xp')
    set({ quizXp: 0 })
  },
  
  setChatContext: (context) => set({ chatContext: context }),
  addChatMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message],
  })),
  clearChatHistory: () => set({ chatHistory: [] }),
  
  setLoading: (isLoading) => set({ isLoading }),
}))
