const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "..", "index.html");
const heroImagePath = path.join(__dirname, "..", "assets", "generated-hero.svg");
const source = fs.readFileSync(indexPath, "utf8");

const notices = [
  "終電案内: 23:58発の下り列車は運行状況を確認中です。",
  "構内放送: ベンチに荷物を置いたまま移動しないでください。",
  "安全案内: 3番ホーム端部は照度低下のため立入注意です。",
  "駅務連絡: 改札左通路は0時以降に順次閉鎖されます。",
  "運行情報: 比奈方面の接続は到着順でご案内します。",
  "防犯案内: 深夜の単独行動はなるべくお控えください。"
];

const captions = [
  "駅前記録写真 / 西側駅舎",
  "駅前記録写真 / 雨上がりのホーム",
  "駅前記録写真 / 深夜巡回時",
  "駅前記録写真 / 停止信号付近",
  "駅前記録写真 / 旧改札前"
];

const alts = [
  "夜のきさらぎ駅を描いた自動生成画像",
  "深夜のきさらぎ駅ホームを描いた自動生成画像",
  "きさらぎ駅前を描いた自動生成の案内画像"
];

function createSeededRandom(seedText) {
  let seed = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) {
    seed ^= seedText.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  let state = seed >>> 0;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return (state >>> 0) / 4294967296;
  };
}

function randomInt(rand, min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function randomChoice(rand, items) {
  return items[randomInt(rand, 0, items.length - 1)];
}

function generateHeroSvg(rand) {
  const skyTop = randomChoice(rand, ["#100D0C", "#120E0C", "#18120F", "#140F0D"]);
  const skyBottom = randomChoice(rand, ["#2C201B", "#352722", "#2B201B", "#30241F"]);
  const groundTop = randomChoice(rand, ["#1E1713", "#221A16", "#1B1512"]);
  const groundBottom = randomChoice(rand, ["#090807", "#080707", "#0B0908"]);
  const moonX = randomInt(rand, 180, 1020);
  const moonY = randomInt(rand, 90, 170);
  const moonR = randomInt(rand, 44, 76);
  const stationX = randomInt(rand, 180, 300);
  const stationW = randomInt(rand, 600, 760);
  const stationY = randomInt(rand, 286, 318);
  const stationH = randomInt(rand, 170, 210);
  const plateX = stationX + randomInt(rand, 170, 250);
  const plateY = stationY - randomInt(rand, 62, 78);
  const plateW = randomInt(rand, 190, 250);

  let pillars = "";
  let pillarX = 70;
  for (let i = 0; i < 6; i += 1) {
    pillarX += randomInt(rand, 120, 180);
    const pw = randomInt(rand, 12, 18);
    const ph = randomInt(rand, 150, 190);
    const py = 525;
    pillars += `<rect x="${pillarX}" y="${py}" width="${pw}" height="${ph}" fill="#151110" opacity="0.38"/>`;
  }

  let windows = "";
  const windowRows = 2;
  const windowCols = 4;
  const gapX = randomInt(rand, 18, 28);
  const gapY = randomInt(rand, 14, 22);
  const winW = randomInt(rand, 88, 122);
  const winH = randomInt(rand, 44, 60);
  const startX = stationX + 34;
  const startY = stationY + 28;
  for (let r = 0; r < windowRows; r += 1) {
    for (let c = 0; c < windowCols; c += 1) {
      const wx = startX + c * (winW + gapX);
      const wy = startY + r * (winH + gapY);
      windows += `<rect x="${wx}" y="${wy}" width="${winW}" height="${winH}" fill="#332721" opacity="0.9"/>`;
    }
  }

  const personX = randomInt(rand, 240, 980);
  const personY = randomInt(rand, 390, 430);

  return `<svg width="1200" height="780" viewBox="0 0 1200 780" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="600" y1="0" x2="600" y2="780" gradientUnits="userSpaceOnUse">
      <stop stop-color="${skyTop}"/>
      <stop offset="1" stop-color="${skyBottom}"/>
    </linearGradient>
    <linearGradient id="ground" x1="600" y1="460" x2="600" y2="780" gradientUnits="userSpaceOnUse">
      <stop stop-color="${groundTop}"/>
      <stop offset="1" stop-color="${groundBottom}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="780" fill="url(#sky)"/>
  <circle cx="${moonX}" cy="${moonY}" r="${moonR}" fill="#D2BC91" fill-opacity="0.08"/>
  <rect y="460" width="1200" height="320" fill="url(#ground)"/>
  <rect x="${stationX}" y="${stationY}" width="${stationW}" height="${stationH}" fill="#171210"/>
  <rect x="${stationX - 28}" y="${stationY - 20}" width="${stationW + 56}" height="24" fill="#44302A"/>
  ${windows}
  <rect x="${plateX}" y="${plateY}" width="${plateW}" height="50" fill="#BCA173"/>
  <text x="${plateX + Math.floor(plateW / 2)}" y="${plateY + 34}" text-anchor="middle" font-size="38" font-family="serif" fill="#17120F">きさらぎ駅</text>
  <rect x="0" y="512" width="1200" height="7" fill="#6F5D4F" fill-opacity="0.56"/>
  <rect x="0" y="562" width="1200" height="5" fill="#8A7562" fill-opacity="0.35"/>
  ${pillars}
  <ellipse cx="${personX}" cy="${personY}" rx="28" ry="66" fill="#0F0C0B" opacity="0.62"/>
  <ellipse cx="${personX - 2}" cy="${personY - 36}" rx="18" ry="18" fill="#0F0C0B" opacity="0.62"/>
</svg>`;
}

const now = new Date();
const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
const yyyy = jst.getUTCFullYear();
const mm = String(jst.getUTCMonth() + 1).padStart(2, "0");
const dd = String(jst.getUTCDate()).padStart(2, "0");
const hh = String(jst.getUTCHours()).padStart(2, "0");
const mi = String(jst.getUTCMinutes()).padStart(2, "0");
const ss = String(jst.getUTCSeconds()).padStart(2, "0");
const dateKey = `${yyyy}${mm}${dd}`;
const stamp = `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
const iso = `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}+09:00`;
const rand = createSeededRandom(dateKey);

const heroSvg = generateHeroSvg(rand);
const heroSrc = `assets/generated-hero.svg?v=${dateKey}`;
const heroAlt = randomChoice(rand, alts);
const heroCaption = randomChoice(rand, captions);

const pick = notices[Math.floor(Math.random() * notices.length)];
const autoNotice = [
  `        <li>${stamp} 更新: ${pick}</li>`,
  "        <li>構内時計が停止している場合は、係員の指示に従ってください。</li>",
  "        <li>3番ホームは足元が見えにくいため、白線の内側でお待ちください。</li>"
].join("\n");

let updated = source.replace(
  /(<!-- AUTO_NOTICE_START -->)[\s\S]*?(<!-- AUTO_NOTICE_END -->)/,
  `$1\n${autoNotice}\n        $2`
);

const autoHero = [
  `      <img src="${heroSrc}" alt="${heroAlt}">`,
  "      <div class=\"hero-caption\">",
  `        <span>${heroCaption}</span>`,
  `        <span>記録時刻 ${stamp}</span>`,
  "      </div>"
].join("\n");

updated = updated.replace(
  /(<!-- AUTO_HERO_START -->)[\s\S]*?(<!-- AUTO_HERO_END -->)/,
  `$1\n${autoHero}\n      $2`
);

updated = updated.replace(
  /<time id="last-updated" datetime="[^"]+">[^<]+<\/time>/,
  `<time id="last-updated" datetime="${iso}">${stamp}</time>`
);

const currentHeroSvg = fs.existsSync(heroImagePath) ? fs.readFileSync(heroImagePath, "utf8") : "";
const hasIndexChange = updated !== source;
const hasHeroImageChange = currentHeroSvg !== heroSvg;

if (!hasIndexChange && !hasHeroImageChange) {
  console.log("No changes made. Check marker positions in index.html.");
  process.exit(0);
}

fs.writeFileSync(indexPath, updated, "utf8");
fs.writeFileSync(heroImagePath, heroSvg, "utf8");
console.log(`Updated index.html at ${stamp}`);
