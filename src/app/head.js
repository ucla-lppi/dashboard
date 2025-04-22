export default function Head() {
  // Normalize BASE_PATH env (strip leading/trailing slashes)
  const raw = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const basePath = raw.replace(/^\/+|\/+$/g, '');
  const href = basePath ? `/${basePath}/` : '/';
  return (
    <>
      <base href={href} />
    </>
  );
}