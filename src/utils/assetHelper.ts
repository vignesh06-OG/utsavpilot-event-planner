/**
 * Asset URL helper to ensure absolute compatibility between:
 * - Local Vite dev server (http://localhost:5173/)
 * - Local production preview (dist/)
 * - GitHub Pages subpath deployment (/utsavpilot-event-planner/)
 */
export const getAssetUrl = (assetPath: string): string => {
  if (!assetPath) return '';
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://') || assetPath.startsWith('data:')) {
    return assetPath;
  }
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  const baseUrl = import.meta.env.BASE_URL || './';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${cleanPath}`;
};

