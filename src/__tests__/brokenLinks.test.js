jest.setTimeout(60000);

const axios = require('axios');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const path = require('path');

const BASE = 'http://localhost:3000';
const links = [
  '/',
  '/impact/newsroom',
  '/about/our-team',
  '/resource-directory',
  '/faqs',
].map(p => `${BASE}${p}`);

let server;

beforeAll(async () => {
  // spawn your dev server in the dashboard folder
  server = spawn('yarn', ['dev'], {
    cwd: path.resolve(__dirname, '../../../dashboard'),
    shell: true,
    stdio: 'inherit'
  });

  // wait for localhost:3000 to respond
  await waitOn({ resources: [BASE], timeout: 80000 });
});

afterAll(() => {
  if (server) server.kill();
});

describe('No broken internal links (local server)', () => {
  links.forEach(link => {
    test(`GET ${link} → 200`, async () => {
      const res = await axios.get(link, { validateStatus: () => true });
      expect(res.status).toBe(200);
    });
  });
});
