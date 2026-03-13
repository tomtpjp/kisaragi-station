const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "..", "index.html");
const source = fs.readFileSync(indexPath, "utf8");

const notices = [
  "終電案内: 23:58発の下り列車は運行状況を確認中です。",
  "構内放送: ベンチに荷物を置いたまま移動しないでください。",
  "安全案内: 3番ホーム端部は照度低下のため立入注意です。",
  "駅務連絡: 改札左通路は0時以降に順次閉鎖されます。",
  "運行情報: 比奈方面の接続は到着順でご案内します。",
  "防犯案内: 深夜の単独行動はなるべくお控えください。"
];

const now = new Date();
const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
const yyyy = jst.getUTCFullYear();
const mm = String(jst.getUTCMonth() + 1).padStart(2, "0");
const dd = String(jst.getUTCDate()).padStart(2, "0");
const hh = String(jst.getUTCHours()).padStart(2, "0");
const mi = String(jst.getUTCMinutes()).padStart(2, "0");
const stamp = `${yyyy}-${mm}-${dd} ${hh}:${mi} JST`;
const iso = `${yyyy}-${mm}-${dd}T${hh}:${mi}:00+09:00`;

const pick = notices[Math.floor(Math.random() * notices.length)];
const autoNotice = [
  `        <li>${yyyy}年${Number(mm)}月${Number(dd)}日 ${hh}:${mi} 更新: ${pick}</li>`,
  "        <li>構内時計が停止している場合は、係員の指示に従ってください。</li>",
  "        <li>3番ホームは足元が見えにくいため、白線の内側でお待ちください。</li>"
].join("\n");

let updated = source.replace(
  /(<!-- AUTO_NOTICE_START -->)[\s\S]*?(<!-- AUTO_NOTICE_END -->)/,
  `$1\n${autoNotice}\n        $2`
);

updated = updated.replace(
  /<time id="last-updated" datetime="[^"]+">[^<]+<\/time>/,
  `<time id="last-updated" datetime="${iso}">${stamp}</time>`
);

if (updated === source) {
  console.log("No changes made. Check marker positions in index.html.");
  process.exit(0);
}

fs.writeFileSync(indexPath, updated, "utf8");
console.log(`Updated index.html at ${stamp}`);
