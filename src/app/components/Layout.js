// This layout file enables metadata generation for the Our Data page
export function generateMetadata() {
  return {
    title: 'Latino Climate and Health Dashboard',
  };
}

export default function OurDataLayout({ children }) {
  return <>{children}</>;
}
