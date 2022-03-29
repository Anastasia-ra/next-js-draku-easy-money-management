import 'expect-puppeteer';

const baseUrl = 'http://localhost:3000';

test('sign up, add a category, delete the category', async () => {
  await page.goto(`${baseUrl}/`);
  expect(page.url()).toBe(`${baseUrl}/`);
  await expect(page).toMatch('Welcome');

  // Signing up on GitHub actions

  await expect(page).toClick('[data-test-id="sign up"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/signup`);
  await expect(page).toFill('[data-test-id="email"]', 'test@test');
  await expect(page).toFill('[data-test-id="username"]', 'test');
  await expect(page).toFill('[data-test-id="password"]', 'pwtest');
  await expect(page).toClick('[data-test-id="signup-button"]');

  // Login if not on GitHub actions

  // await expect(page).toClick('[data-test-id="log in"]');
  // await page.waitForNavigation();
  // expect(page.url()).toBe(`${baseUrl}/login`);
  // await expect(page).toFill('[data-test-id="username"]', 'test');
  // await expect(page).toFill('[data-test-id="password"]', 'pwtest');
  // await expect(page).toClick('[data-test-id="login-button"]');

  await page.waitForNavigation();

  await expect(page).toMatch('test!');
  await expect(page).toClick('[data-test-id="category-link"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/users/categoriesManagement`);

  await expect(page).toFill('[data-test-id="category-name"]', 'test-category');
  await expect(page).toFill('[data-test-id="category-budget"]', '100');
  await expect(page).toClick('[data-test-id="add-category"]');
  await page.waitForTimeout(4000);
  // await expect(page).toMatch('test-category');
  await expect(page).toMatchElement('[data-test-id="category-list-name"]', {
    text: 'Test-category',
  });
  await expect(page).toClick('[data-test-id="delete-category"]');

  await expect(page).toClick('[data-test-id="log-out"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/`);
});
