export default async function loadRoot(vite, isProduction = false) {
  if (isProduction) {
    return (await import('../../dist/server/root.js')).default;
  } else {
    return (await vite.ssrLoadModule('../src/root.tsx')).default;
  }
}
