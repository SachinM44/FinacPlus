import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const remoteUrl = isDev 
    ? 'http://localhost:5001/assets/remoteEntry.js'
    : 'https://rainbow-elf-0e6fe5.netlify.app/assets/remoteEntry.js';

  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        remotes: {
          musicLibrary: remoteUrl,
        },
        shared: ['react', 'react-dom'],
      }),
    ],
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
  };
});
