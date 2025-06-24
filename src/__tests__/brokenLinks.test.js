const axios = require('axios');

// pick up a base URL from an env var, default to prod
const BASE = process.env.LINKS_BASE_URL || 'https://latinoclimatehealth.org';

// only run link-checks when you explicitly opt in
const runLiveTests = process.env.RUN_LIVE_LINK_TESTS === 'true';
const describeFn = runLiveTests ? describe : describe.skip;

const links = [
  `${BASE}/`,
  `${BASE}/impact/newsroom`,
  `${BASE}/about/our-team`,
  `${BASE}/resource-directory`,
  `${BASE}/faqs`,
];

describeFn('All main site links should return 200', () => {
  links.forEach(link => {
    test(`GET ${link}`, async () => {
      const res = await axios.get(link, { validateStatus: () => true });
      expect(res.status).toBe(200);
    }, 15000); // you can also bump timeout here
  });
});
