import puppeteer from "puppeteer";

const getCookie = async (url, username, password) => {
  const browser = await puppeteer.launch({
    headless: "new", // Sử dụng chế độ headless mới
  });
  const page = await browser.newPage();

  await page.goto(`https://${url}/trafficphuongnghi`);
  await page.waitForSelector("#user_login"); // Đợi phần tử có sẵn
  await page.type("#user_login", username);
  await page.type("#user_pass", password);

  const searchResultSelector = "#wp-submit";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  await page.goto(`https://${url}/wp-admin/edit.php`);

  await browser.close();
};

export { getCookie };
