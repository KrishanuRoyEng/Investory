import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: 'http://localhost:3000',
  });

  console.log('1. Sending signup request...');
  const signupResponse = await context.request.post('/api/v1/auth/signup', {
    data: {
      email: `playwright${Date.now()}@example.com`,
      password: 'StrongPassword123!',
    }
  });

  console.log(`Signup Status: ${signupResponse.status()}`);
  
  const cookiesAfterSignup = await context.cookies();
  console.log('Cookies in browser jar after signup:');
  console.dir(cookiesAfterSignup);

  const hasRefreshToken = cookiesAfterSignup.some(c => c.name === 'refreshToken');
  if (!hasRefreshToken) {
    console.error('FAILED: Browser did not accept the refreshToken cookie!');
    process.exit(1);
  } else {
    console.log('SUCCESS: Browser accepted the refreshToken cookie over HTTP.');
  }

  console.log('\n2. Sending refresh request (should automatically send the cookie)...');
  const refreshResponse = await context.request.post('/api/v1/auth/refresh');
  console.log(`Refresh Status: ${refreshResponse.status()}`);
  if (refreshResponse.status() !== 200) {
    console.error('FAILED: Refresh rejected the request (cookie probably not sent or invalid)');
    process.exit(1);
  }

  const cookiesAfterRefresh = await context.cookies();
  console.log('Cookies in browser jar after refresh:');
  console.dir(cookiesAfterRefresh);

  console.log('\n3. Sending logout request...');
  const logoutResponse = await context.request.post('/api/v1/auth/logout');
  console.log(`Logout Status: ${logoutResponse.status()}`);
  
  const cookiesAfterLogout = await context.cookies();
  console.log('Cookies in browser jar after logout:');
  console.dir(cookiesAfterLogout);

  if (cookiesAfterLogout.length === 0) {
    console.log('SUCCESS: Cookie successfully cleared from browser jar after logout.');
  } else {
    console.error('FAILED: Cookies still present after logout!');
  }

  await browser.close();
})();
