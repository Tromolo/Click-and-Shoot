import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist', // Výstupný priečinok (relatívne k 'public')
        emptyOutDir: true, // Vymaže predchádzajúci build
    },
    server: {
        open: true, // Automaticky otvorí prehliadač
    },
    plugins: [
        copy({
            targets: [
                { src: 'public/assets/*', dest: 'dist/assets' },
            ],
            hook: 'writeBundle', // Kopíruje súbory pri buildu
        }),
    ],
});
