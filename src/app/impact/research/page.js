import ResearchSection from '@/app/components/ResearchSection';
const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=1832548192&single=true&output=csv'
export const metadata = {
  title: 'Impact - Research',
};

export default function ImpactResearchPage() {
  return (
    <main className="bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0 p-4 sm:p-6 max-w-screen-xl mx-auto px-4 py-8">
      <ResearchSection csvUrl={googleSheetUrl} />
    </main>
  );
}