const axios = require('axios');

// List of URLs to check
const links = [
  'https://latinoclimatehealth.org/',
  'https://latinoclimatehealth.org/impact/newsroom',
  'https://latinoclimatehealth.org/about/our-team',
  'https://latinoclimatehealth.org/resource-directory',
  'https://latinoclimatehealth.org/faqs',
  // Add more URLs or automate extraction if needed
];

describe('All main site links should return 200', () => {
  links.forEach(link => {
    test(`GET ${link}`, async () => {
      const response = await axios.get(link, { validateStatus: () => true });
      expect(response.status).toBe(200);
    });
  });
});
