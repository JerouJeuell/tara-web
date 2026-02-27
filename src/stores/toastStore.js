import { create } from 'zustand'

const useToastStore = create((set) => ({
    toast: null,

    showToast: (message, type = 'success') => {
        set({ toast: { message, type } })
    },

    hideToast: () => {
        set({ toast: null })
    },
}))

export default useToastStore