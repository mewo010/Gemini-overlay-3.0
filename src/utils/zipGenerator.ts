import JSZip from 'jszip';
import { GITHUB_WORKFLOW_YML } from '../constants/githubWorkflow';
import { ELECTRON_MAIN_JS, ELECTRON_PACKAGE_JSON, ELECTRON_PRELOAD_JS, README_MD } from '../constants/electronSource';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. GitHub Actions workflow
  zip.file('.github/workflows/build-and-release.yml', GITHUB_WORKFLOW_YML);

  // 2. Electron files
  zip.file('package.json', ELECTRON_PACKAGE_JSON);
  zip.file('electron/main.js', ELECTRON_MAIN_JS);
  zip.file('electron/preload.js', ELECTRON_PRELOAD_JS);
  zip.file('README.md', README_MD);

  // 3. Project configs
  zip.file(
    '.gitignore',
    `node_modules/
dist/
dist_electron/
.env
*.local
`
  );

  zip.file(
    'vite.config.ts',
    `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Crucial for Electron local file loading
});
`
  );

  zip.file(
    'tsconfig.json',
    `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "strict": false
  },
  "include": ["src"]
}
`
  );

  // Dummy icon placeholder
  zip.file(
    'electron/assets/icon.ico',
    'WinGemini Application Icon'
  );

  const content = await zip.generateAsync({ type: 'blob' });
  return content;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
