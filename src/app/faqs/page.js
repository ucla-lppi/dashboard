"use client";
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import { Card } from 'flowbite-react';

const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

// Hardcoded FAQ CSV URL
const FAQ_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=1166232289&single=true&output=csv';

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([]);
  const [openIdxs, setOpenIdxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(FAQ_CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const filtered = data
          .map(item => ({
            question: item.question?.trim() || item.Question?.trim() || item.Title?.trim() || '',
            answer: item.answer?.trim() || item.Answer?.trim() || item.File?.trim() || '',
            draft: item.draft?.trim() || item.Draft?.trim() || '',
            id: item.id?.trim() || item.ID?.trim() || '',
          }))
          .filter(item => item.draft?.toLowerCase() !== 'yes' && item.question && item.answer)
          .sort((a, b) => Number(a.id) - Number(b.id));
        setFaqs(filtered);
        setLoading(false);
      },
      error: (err) => { console.error('Error parsing CSV:', err); setLoading(false); },
    });
  }, []);

  useEffect(() => {
    if (!faqs.length) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const generateSlug = text =>
      text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const idx = faqs.findIndex(f => generateSlug(f.question) === hash);
    if (idx !== -1) {
      setOpenIdxs(prev => (prev.includes(idx) ? prev : [...prev, idx]));
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [faqs]);

  function parseFaqAnswer(answer) {
    if (!answer) return '';
    const parseInline = text => {
      const escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return escaped
        .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    };
    const lines = answer.trim().replace(/\r\n/g, '\n').split('\n');
    const segs = [];
    let curr = null;
    const flush = () => { if (curr) { segs.push(curr); curr = null; } };
    lines.forEach(raw => {
      const line = raw.trimEnd();
      if (/^\s*[-*]\s+/.test(line)) {
        if (curr?.type !== 'ul') { flush(); curr = { type: 'ul', lines: [] }; }
        curr.lines.push(line.replace(/^\s*[-*]\s+/, '').trim());
      } else if (/^\s*\d+\.\s+/.test(line)) {
        if (curr?.type !== 'ol') { flush(); curr = { type: 'ol', lines: [] }; }
        curr.lines.push(line.replace(/^\s*\d+\.\s+/, '').trim());
      } else {
        flush();
        segs.push({ type: 'p', lines: [line] });
      }
    });
    flush();
    return segs.map(seg => {
      if (seg.type === 'ul' || seg.type === 'ol') {
        const tag = seg.type;
        const cls = tag === 'ul' ? 'list-disc ml-6' : 'list-decimal ml-6';
        return `<${tag} class="${cls}">` +
          seg.lines.map(li => `<li>${parseInline(li)}</li>`).join('') +
          `</${tag}>`;
      }
      return `<p class="mb-4 text-gray-700">` +
        seg.lines.map(l => parseInline(l)).join('<br/>') +
        `</p>`;
    }).join('');
  }

  return (
    <Card className="bg-[#fcfcfc] dark:bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0">
      <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
      <p className="mb-6">
        Here is a list of common questions and answers you may have as you explore the Latino Climate and Health Dashboard. Many common questions about the methods and indicators used to develop the Latino Climate and Health Dashboard can be found here or in the{' '}
        <Link href="/our-data" className="text-primary underline">
          Our Data
          <img src="/images/external_link_blue.svg" alt="(external link)" className="inline ml-1 w-4 h-4 align-text-bottom" />
        </Link>{' '}section. Please refer to the{' '}
        <a
          href="https://latino.ucla.edu/research/climate-health-dashboard-technical-doc/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          technical report
          <img src={`${prefix}/images/external_link_blue.svg`} alt="(external link)" className="inline ml-1 w-4 h-4 align-text-bottom" />
        </a>{' '}
        for detailed information on our methods and data sources.
      </p>
      <p className="mb-6">
        If you have suggestions for indicators or areas we should include—or are interested in supporting or collaborating on this work—please contact us at <a href="mailto:latino@luskin.ucla.edu" className="text-primary underline">latino@luskin.ucla.edu</a>.
      </p>
      <section className="w-[100%] mx-auto my-4">
        <div id="faq-accordion">
          {loading ? (
            Array(5).fill().map((_, i) => (
              <div key={i} className="border-y border-[#84BAA6] px-4 py-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-2/3"></div>
              </div>
            ))
          ) : (
            faqs.map((faq, idx) => {
               const slug = faq.question
                 .toLowerCase()
                 .replace(/[^a-z0-9]+/g, '-')
                 .replace(/(^-|-$)/g, '');
             const open = openIdxs.includes(idx);
            return (
              <div key={faq.id || idx} className="border-y border-[#84BAA6]">
                 <a id={slug} tabIndex={-1} aria-label={faq.question}></a>
                 <button
                   type="button"
                   className={`flex justify-between items-center w-full py-4 px-4 text-lg font-medium text-left text-gray-900 focus:outline-none transition-colors ${open ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
                   aria-expanded={open}
                   onClick={() => setOpenIdxs(prev => prev.includes(idx) ? prev.filter(i => i!==idx) : [...prev,idx])}
                 >
                  <span className="text-xl font-Lexend_Deca font-semibold text-primary">{faq.question}</span>
                  <img
                    src={open ? `${prefix}/images/faq_close.svg` : `${prefix}/images/faq_open.svg`}
                    alt={open ? "Close" : "Open"}
                    className="w-6 h-6 ml-2"
                  />
                 </button>
                 <div className={`px-4 pb-4 transition-all duration-200 ${open ? 'block' : 'hidden'}`} dangerouslySetInnerHTML={{ __html: parseFaqAnswer(faq.answer) }} />
               </div>
             );
           })
          )}
        </div>
      </section>
    </Card>
  );
}
