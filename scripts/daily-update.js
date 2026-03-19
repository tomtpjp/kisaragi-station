const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "..", "index.html");
const stylesPath = path.join(__dirname, "..", "styles.css");
const heroImagePath = path.join(__dirname, "..", "assets", "generated-hero.svg");

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

function generateStyles(theme, layout, fontStack) {
  return `:root {
  --bg-1: ${theme.bg1};
  --bg-2: ${theme.bg2};
  --paper: ${theme.paper};
  --ink: ${theme.ink};
  --accent: ${theme.accent};
  --accent-soft: ${theme.accentSoft};
  --line: rgba(210, 196, 166, 0.35);
  --shadow: rgba(0, 0, 0, 0.55);
}

* { box-sizing: border-box; }

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

body {
  font-family: ${fontStack};
  color: var(--paper);
  background:
    radial-gradient(circle at 15% 10%, ${theme.noiseA}, transparent 38%),
    radial-gradient(circle at 80% 80%, ${theme.noiseB}, transparent 42%),
    linear-gradient(${theme.angle}deg, var(--bg-1), var(--bg-2));
  line-height: 1.65;
  letter-spacing: 0.02em;
  overflow-x: hidden;
}

.film-grain {
  position: fixed;
  inset: 0;
  background-image: repeating-radial-gradient(circle at 0 0, transparent 0, rgba(255,255,255,0.045) 1px, transparent 2px);
  opacity: 0.2;
  pointer-events: none;
  animation: grainShift 4s steps(3) infinite;
}

.hero {
  text-align: center;
  padding: 72px 16px 32px;
  border-bottom: 1px solid var(--line);
  position: relative;
}

.hero::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 10%;
  width: 80%;
  height: 1px;
  background: linear-gradient(to right, transparent, color-mix(in srgb, var(--accent) 84%, transparent), transparent);
}

.station-code {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

h1 {
  margin: 10px 0;
  font-size: clamp(2.3rem, 6vw, 4.4rem);
  font-weight: 600;
  text-shadow: 0 0 9px color-mix(in srgb, var(--accent) 44%, transparent);
  animation: flicker 7s infinite;
}

.subtitle {
  margin: 0;
  font-size: 1rem;
  opacity: 0.82;
}

.hero-frame {
  width: min(960px, 92%);
  margin: 28px auto 0;
  border: 1px solid rgba(210, 196, 166, 0.32);
  background: rgba(6, 5, 4, 0.42);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.38);
  padding: 10px;
  position: relative;
}

.hero-frame::before {
  content: "";
  position: absolute;
  inset: 10px;
  border: 1px solid color-mix(in srgb, var(--accent-soft) 40%, transparent);
  pointer-events: none;
}

.hero-frame img {
  display: block;
  width: 100%;
  height: auto;
  filter: sepia(0.28) saturate(0.85) contrast(1.05);
}

.hero-caption {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 4px 2px;
  font-size: 0.84rem;
  color: rgba(210, 196, 166, 0.82);
  text-align: left;
}

.container {
  width: min(1040px, 92%);
  margin: 30px auto 50px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}

.panel {
  background: linear-gradient(180deg, rgba(19,15,12,0.78), rgba(9,8,7,0.86));
  border: 1px solid var(--line);
  box-shadow: 0 14px 35px var(--shadow);
  padding: 20px;
  backdrop-filter: blur(1.5px);
  animation: riseIn 0.9s ease both;
}

.notice { grid-column: ${layout.notice}; }
.timetable { grid-column: ${layout.timetable}; animation-delay: 0.12s; }
.archive {
  grid-column: ${layout.archive};
  display: grid;
  grid-template-columns: ${layout.archiveCols};
  gap: 18px;
  align-items: center;
  animation-delay: 0.18s;
}
.map { grid-column: ${layout.map}; animation-delay: 0.24s; }

h2 {
  margin: 0 0 12px;
  font-size: 1.25rem;
  border-left: 4px solid var(--accent);
  padding-left: 8px;
}

ul { margin: 0; padding-left: 1.2em; }

.panel-note,
.archive-meta {
  margin: 14px 0 0;
  font-size: 0.9rem;
  color: rgba(210, 196, 166, 0.8);
}

.auto-updated {
  margin: 10px 0 0;
  font-size: 0.84rem;
  color: color-mix(in srgb, var(--accent-soft) 88%, #f0d2a3);
}

.auto-updated time { font-variant-numeric: tabular-nums; }

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.96rem;
}

th,
td {
  border-bottom: 1px solid rgba(210,196,166,0.18);
  padding: 10px 6px;
  text-align: left;
}

th { font-weight: 600; color: #e8d7b2; }

.delayed td {
  color: #f5b1a7;
  text-shadow: 0 0 6px color-mix(in srgb, var(--accent) 40%, transparent);
}

.archive-copy p { margin: 0 0 10px; }

.archive-image img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid rgba(210, 196, 166, 0.24);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
}

.map-box {
  margin-top: 12px;
  border: 1px dashed rgba(210,196,166,0.46);
  min-height: 220px;
  position: relative;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent 30%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.28), transparent 25%);
}

.line { position: absolute; background: rgba(232,215,178,0.5); }
.horizontal { top: 48%; left: 7%; width: 86%; height: 2px; }
.vertical { top: 18%; left: 52%; width: 2px; height: 64%; }

.tag {
  position: absolute;
  font-size: 0.88rem;
  background: rgba(0,0,0,0.45);
  padding: 2px 8px;
  border: 1px solid rgba(210,196,166,0.35);
}

.gate { top: 16%; left: 10%; }
.home1 { top: 52%; left: 20%; }
.home2 { top: 38%; left: 55%; }
.home3 { bottom: 12%; right: 10%; color: #f5b1a7; }

.legend {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 14px;
  font-size: 0.85rem;
}

.legend span {
  border: 1px solid rgba(210,196,166,0.18);
  background: rgba(0,0,0,0.24);
  padding: 8px 10px;
}

footer {
  border-top: 1px solid var(--line);
  text-align: center;
  padding: 20px 16px 40px;
  color: rgba(210,196,166,0.85);
  font-size: 0.92rem;
}

@keyframes flicker {
  0%, 18%, 22%, 62%, 100% { opacity: 1; }
  20%, 21%, 60% { opacity: 0.72; }
}

@keyframes grainShift {
  0% { transform: translate(0, 0); }
  35% { transform: translate(-2%, 1%); }
  70% { transform: translate(1%, -1%); }
  100% { transform: translate(0, 0); }
}

@keyframes riseIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 820px) {
  .notice,
  .timetable,
  .archive,
  .map { grid-column: span 12; }

  .archive { grid-template-columns: 1fr; }

  .hero { padding-top: 56px; }

  .hero-caption,
  .legend {
    display: grid;
    grid-template-columns: 1fr;
  }

  .hero-caption { gap: 6px; }
  .map-box { min-height: 190px; }
}`;
}

function generateHtml(data) {
  const {
    stamp,
    iso,
    heroSrc,
    heroAlt,
    heroCaption,
    noticeLine,
    subtitle,
    stationCode,
    archiveText,
    mapNote,
    layout,
    optionalElement
  } = data;

  const extraNoticeItem = optionalElement.show && optionalElement.type === "notice-item"
    ? `\n        <li>${optionalElement.content}</li>`
    : "";

  const extraTimetableRow = optionalElement.show && optionalElement.type === "timetable-row"
    ? [
        "",
        "          <tr>",
        `            <td>${optionalElement.content.train}</td>`,
        `            <td>${optionalElement.content.time}</td>`,
        `            <td>${optionalElement.content.dest}</td>`,
        "          </tr>"
      ].join("\n")
    : "";

  const extraLegendItem = optionalElement.show && optionalElement.type === "map-legend-item"
    ? `\n        <span>${optionalElement.content}</span>`
    : "";

  const extraFooterNote = optionalElement.show && optionalElement.type === "footer-note"
    ? `\n    <p>${optionalElement.content}</p>`
    : "";

  const sections = {
    notice: `<section class="panel notice">
      <h2>お知らせ</h2>
      <ul id="notice-list">
        <!-- AUTO_NOTICE_START -->
        <li>${noticeLine}</li>
        <li>構内時計が停止している場合は、係員の指示に従ってください。</li>
        <li>3番ホームは足元が見えにくいため、白線の内側でお待ちください。</li>${extraNoticeItem}
        <!-- AUTO_NOTICE_END -->
      </ul>
      <p class="panel-note">本日深夜帯は巡回放送を実施しております。ホーム端での長時間滞在はお控えください。</p>
      <p class="auto-updated">最終自動更新: <time id="last-updated" datetime="${iso}">${stamp}</time></p>
    </section>`,
    timetable: `<section class="panel timetable">
      <h2>時刻表（下り）</h2>
      <table>
        <thead>
          <tr>
            <th>列車</th>
            <th>発車</th>
            <th>行先</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>普通 721M</td>
            <td>22:41</td>
            <td>比奈</td>
          </tr>
          <tr>
            <td>普通 743M</td>
            <td>23:17</td>
            <td>比奈</td>
          </tr>
          <tr class="delayed">
            <td>最終 777M</td>
            <td>23:58</td>
            <td>比奈（到着未定）</td>
          </tr>
          <tr>
            <td>回送 801M</td>
            <td>--:--</td>
            <td>記録なし</td>
          </tr>${extraTimetableRow}
        </tbody>
      </table>
      <p class="panel-note">※ 列車遅延時は、案内表示が一時的に消灯する場合があります。</p>
    </section>`,
    archive: `<section class="panel archive">
      <div class="archive-copy">
        <h2>駅務掲示</h2>
        <p>${archiveText}</p>
        <p class="archive-meta">掲示番号: KSR-13 / 保存状態: 良好ではありません</p>
      </div>
      <div class="archive-image">
        <img src="assets/kisaragi-notice.svg" alt="きさらぎ駅の古い掲示物を模した案内画像">
      </div>
    </section>`,
    map: `<section class="panel map">
      <h2>構内図</h2>
      <p>${mapNote}</p>
      <div class="map-box" role="img" aria-label="古い駅構内図">
        <div class="line horizontal"></div>
        <div class="line vertical"></div>
        <span class="tag gate">改札</span>
        <span class="tag home1">1番線</span>
        <span class="tag home2">2番線</span>
        <span class="tag home3">3番線</span>
      </div>
      <div class="legend">
        <span>改札口は1か所のみ</span>
        <span>公衆電話は現在ご利用いただけません</span>
        <span>非常灯が点滅した場合はホーム中央へ</span>${extraLegendItem}
      </div>
    </section>`
  };

  const orderedSections = layout.order.map((key) => sections[key]).join("\n\n    ");

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>きさらぎ駅 公式案内</title>
  <meta name="description" content="きさらぎ駅の架空公式ホームページ。時刻表、お知らせ、駅構内図をご案内します。">
  <link rel="stylesheet" href="styles.css?v=${stamp.replace(/[^0-9]/g, "")}">
</head>
<body>
  <div class="film-grain" aria-hidden="true"></div>

  <header class="hero">
    <p class="station-code">${stationCode}</p>
    <h1>きさらぎ駅</h1>
    <p class="subtitle">${subtitle}</p>
    <div class="hero-frame">
      <!-- AUTO_HERO_START -->
      <img src="${heroSrc}" alt="${heroAlt}">
      <div class="hero-caption">
        <span>${heroCaption}</span>
        <span>記録時刻 ${stamp}</span>
      </div>
      <!-- AUTO_HERO_END -->
    </div>
  </header>

  <main class="container layout-${layout.id}">
    ${orderedSections}
  </main>

  <footer>
    <p>きさらぎ駅 駅務室</p>
    <p>※ 駅係員が不在の場合、ホーム内放送は繰り返されます。</p>${extraFooterNote}
  </footer>
</body>
</html>`;
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

const themeVariants = [
  {
    bg1: "#0f0d0b",
    bg2: "#1d1713",
    paper: "#d2c4a6",
    ink: "#16110d",
    accent: "#9d2a1f",
    accentSoft: "#b58d64",
    noiseA: "rgba(157, 42, 31, 0.15)",
    noiseB: "rgba(123, 101, 74, 0.22)",
    angle: 160
  },
  {
    bg1: "#11141a",
    bg2: "#1f242c",
    paper: "#d9d2bc",
    ink: "#12151a",
    accent: "#7e4030",
    accentSoft: "#9d8262",
    noiseA: "rgba(126, 64, 48, 0.16)",
    noiseB: "rgba(94, 110, 122, 0.2)",
    angle: 145
  },
  {
    bg1: "#17110f",
    bg2: "#2a1d1a",
    paper: "#decab0",
    ink: "#1a1411",
    accent: "#874631",
    accentSoft: "#bf9d6f",
    noiseA: "rgba(135, 70, 49, 0.17)",
    noiseB: "rgba(130, 103, 74, 0.2)",
    angle: 172
  }
];

const layoutVariants = [
  {
    id: "a",
    notice: "span 6",
    timetable: "span 6",
    archive: "span 12",
    archiveCols: "1fr 1.15fr",
    map: "2 / span 10",
    order: ["notice", "timetable", "archive", "map"]
  },
  {
    id: "b",
    notice: "span 7",
    timetable: "span 5",
    archive: "span 6",
    archiveCols: "1fr",
    map: "span 6",
    order: ["notice", "archive", "timetable", "map"]
  },
  {
    id: "c",
    notice: "span 12",
    timetable: "span 6",
    archive: "span 6",
    archiveCols: "1fr",
    map: "span 12",
    order: ["notice", "archive", "timetable", "map"]
  }
];

const fontVariants = [
  '"Yu Mincho", "Hiragino Mincho ProN", "MS Mincho", "Times New Roman", serif',
  '"Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif',
  '"BIZ UDPMincho", "Yu Mincho", "MS PMincho", serif'
];

const subtitles = [
  "ようこそ、終電の先へ。",
  "本日の最終案内は、静かに繰り返されます。",
  "この駅では、夜の時刻が少しだけ長くなります。"
];

const stationCodes = [
  "KT-00 / Unknown Line",
  "KT-00 / Midnight Branch",
  "KT-00 / Archive Route"
];

const archiveTexts = [
  "古い掲示板に残されていた巡回案内です。紙面は黄ばんでいますが、印影だけは新しいまま残っています。",
  "倉庫で見つかった掲示物を複写したものです。深夜便の案内だけ、毎回文字が微妙に異なります。",
  "旧駅舎から移設した掲示板です。巡回時刻の欄だけ、いつも最新日付に差し替わっています。"
];

const mapNotes = [
  "改札を出て左手の通路は、深夜0時以降ご利用いただけません。",
  "深夜帯はホーム照度が低下します。足元をご確認のうえ移動してください。",
  "終電後の構内移動は係員案内時のみ可能です。単独での進入はご遠慮ください。"
];

const optionalNoticeItems = [
  "改札外の掲示板は現在確認できません。",
  "深夜帯の自動放送が一時中断しております。",
  "1番線ホームの照明が一部点滅中です。",
  "非常通報装置の点検を実施しております。"
];

const optionalTimetableRows = [
  { train: "臨時 XM-0", time: "--:--", dest: "不明" },
  { train: "回送 000M", time: "00:00", dest: "終点（停車なし）" },
  { train: "特別 999M", time: "25:00", dest: "記録なし" }
];

const optionalLegendItems = [
  "B出口は長期閉鎖中です。",
  "待合室への入室は22時以降禁止です。",
  "奥の通路は現在封鎖されています。"
];

const optionalFooterNotes = [
  "※ 夜間の構内撮影はお控えください。",
  "※ 最終案内後、駅務室への連絡はできません。"
];

const elementSlots = [
  { type: "notice-item", pool: optionalNoticeItems },
  { type: "timetable-row", pool: optionalTimetableRows },
  { type: "map-legend-item", pool: optionalLegendItems },
  { type: "footer-note", pool: optionalFooterNotes }
];

const theme = randomChoice(rand, themeVariants);
const layout = randomChoice(rand, layoutVariants);
const fontStack = randomChoice(rand, fontVariants);
const subtitle = randomChoice(rand, subtitles);
const stationCode = randomChoice(rand, stationCodes);
const archiveText = randomChoice(rand, archiveTexts);
const mapNote = randomChoice(rand, mapNotes);

const activeSlot = randomChoice(rand, elementSlots);
const optionalElement = {
  type: activeSlot.type,
  content: randomChoice(rand, activeSlot.pool),
  show: rand() < 0.5
};

const pick = notices[Math.floor(Math.random() * notices.length)];
const noticeLine = `${stamp} 更新: ${pick}`;

const html = generateHtml({
  stamp,
  iso,
  heroSrc,
  heroAlt,
  heroCaption,
  noticeLine,
  subtitle,
  stationCode,
  archiveText,
  mapNote,
  layout,
  optionalElement
});

const css = generateStyles(theme, layout, fontStack);

const currentIndex = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf8") : "";
const currentStyles = fs.existsSync(stylesPath) ? fs.readFileSync(stylesPath, "utf8") : "";
const currentHeroSvg = fs.existsSync(heroImagePath) ? fs.readFileSync(heroImagePath, "utf8") : "";

const hasIndexChange = currentIndex !== html;
const hasStylesChange = currentStyles !== css;
const hasHeroImageChange = currentHeroSvg !== heroSvg;

if (!hasIndexChange && !hasStylesChange && !hasHeroImageChange) {
  console.log("No changes made. Check marker positions in index.html.");
  process.exit(0);
}

fs.writeFileSync(indexPath, html, "utf8");
fs.writeFileSync(stylesPath, css, "utf8");
fs.writeFileSync(heroImagePath, heroSvg, "utf8");
console.log(`Updated site design and content at ${stamp}`);
