"use client"
import { create } from "zustand"

type ShirtState = {
    color: string
    logoDataUrl: string | null
    setColor: (c: string) => void
    setLogo: (url: string | null) => void
    reset: () => void
}

export const useShirtStore = create<ShirtState>((set) => ({
    color: "#ffffff",
    logoDataUrl: null,
    setColor: (c) => set({ color: c }),
    setLogo: (url) => set({ logoDataUrl: url }),
    reset: () => set({ color: "#ffffff", logoDataUrl: null }),
}))
