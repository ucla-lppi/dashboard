import ResearchSection from '@/app/components/ResearchSection';

export const metadata = {
  title: 'Policy Toolkits',
};

export default function PolicyToolkitPage() {
  return (
    <main className="bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0 p-4 sm:p-6 max-w-screen-xl mx-auto px-4 py-8">
      <ResearchSection
        mainHeading="Policy Toolkits"
        initialCategory="policy_recommendations"
        showInitialHeading={true}
        layout="grid"
      />
    </main>
  );
}