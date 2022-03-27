import 'expect-puppeteer';

const baseUrl = 'http://localhost:3000';

test('sign up and add a category', async () => {
  await page.goto(`${baseUrl}/`);
});
