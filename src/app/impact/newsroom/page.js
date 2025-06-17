import ResearchSection from '@/app/components/ResearchSection';

export const metadata = {
  title: 'Impact - Newsroom',
};

const newsroomCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=585683908&single=true&output=csv';

export default function ImpactNewsroomPage() {
  return (
    <main className="bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0 p-4 sm:p-6 max-w-screen-xl mx-auto px-4 py-8">
      <ResearchSection
        csvUrl={newsroomCsvUrl}
        mainHeading="Newsroom"
        initialCategory="press_coverage"
        showInitialHeading={false}
      />
    </main>
  );
}