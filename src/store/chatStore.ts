import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatStore {
  isOpen: boolean;
  unreadCount: number;
  lastActivity: number;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  incrementUnread: () => void;
  clearUnread: () => void;
  updateActivity: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      isOpen: false,
      unreadCount: 0,
      lastActivity: Date.now(),

      openChat: () => set({ isOpen: true, unreadCount: 0 }),
      closeChat: () => set({ isOpen: false }),
      toggleChat: () => set((state) => ({ 
        isOpen: !state.isOpen, 
        unreadCount: state.isOpen ? state.unreadCount : 0 
      })),
      
      incrementUnread: () => set((state) => ({ 
        unreadCount: state.isOpen ? state.unreadCount : state.unreadCount + 1 
      })),
      clearUnread: () => set({ unreadCount: 0 }),
      updateActivity: () => set({ lastActivity: Date.now() })
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        unreadCount: state.unreadCount,
        lastActivity: state.lastActivity
      })
    }
  )
);
