import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

async function scrapeTwitchData(url: string) {
  const browser = await puppeteer.launch({ headless: true }); // ヘッドレスモードで起動
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // 配信タイトルを取得
  const streamTitle = await page
    .$eval('h2[data-a-target="stream-title"]', (element) => element.textContent)
    .catch(() => "Unknown Title");

  // アバター画像を取得
  const avatarUrl = await page
    .$eval("img.tw-image-avatar", (element) => element.getAttribute("src"))
    .catch(() => "Unknown Avatar URL");

  // フォロワー数を取得
  const followers = await page
    .$eval("p.tw-c-text-base", (element) => element.textContent)
    .catch(() => "Unknown Followers");

  // 配信カテゴリーを取得
  const category = await page
    .$eval(
      'a[data-a-target="stream-game-link"]',
      (element) => element.textContent
    )
    .catch(() => "Unknown Category");

  // 配信者の概要を取得
  const streamerBio = await page
    .$eval('div[data-a-target="channel-info-content"]', (element) =>
      element.textContent?.trim()
    )
    .catch(() => "No Bio Available");

  // 結果をJSONに保存
  const result = {
    streamTitle,
    avatarUrl,
    followers,
    category,
    streamerBio,
  };

  // JSONファイルに書き込む
  await Deno.writeTextFile("2024_10_13.json", JSON.stringify(result, null, 2));
  console.log("Data saved to 2024_10_13.json");

  await browser.close();
}

// URLを指定して実行
await scrapeTwitchData("https://www.twitch.tv/kato_junichi0817");
