import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({root:'apps/web', server:{proxy:{'/api':'http://127.0.0.1:3001'}}, plugins:[tanstackStart(), react(), tailwindcss()], resolve:{alias:{'~':new URL('./apps/web/src', import.meta.url).pathname.replace(/^\/(\w:)/,'$1')}}})

