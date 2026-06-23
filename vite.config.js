import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// PayHere popup needs same-origin-allow-popups (not same-origin + COEP).
// Do NOT set Cross-Origin-Embedder-Policy — it blocks www.payhere.lk in iframes.
const payhereFriendlyHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: payhereFriendlyHeaders,
  },
  preview: {
    headers: payhereFriendlyHeaders,
  },
})
