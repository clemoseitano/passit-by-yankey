const fs      = require('fs');
const path    = require('path');
const unzipper = require('unzipper');

const DOCX_PATH  = path.join(process.env.HOME, 'Downloads', 'Basic_Design_and_Technology_2019_Objectives.docx');
const OUT_DIR    = path.join(__dirname, 'public', 'images');
const PREFIX     = 'bdt_2019';

async function extractImages() {
  if (!fs.existsSync(DOCX_PATH)) {
    console.error('❌  File not found:', DOCX_PATH);
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.wmf', '.emf', '.svg']);

  const entries = [];

  await fs.createReadStream(DOCX_PATH)
    .pipe(unzipper.Parse())
    .on('entry', entry => {
      const entryPath = entry.path;
      const ext       = path.extname(entryPath).toLowerCase();

      if (entryPath.startsWith('word/media/') && IMAGE_EXTS.has(ext)) {
        entries.push({ entryPath, ext, buffers: [] });
        const current = entries[entries.length - 1];
        entry.on('data',  chunk => current.buffers.push(chunk));
        entry.on('end',   ()    => {});
      } else {
        entry.autodrain();
      }
    })
    .promise();

  if (entries.length === 0) {
    console.log('No images found in the document.');
    return;
  }

  entries.forEach((item, i) => {
    const num      = String(i + 1).padStart(2, '0');
    const ext      = item.ext === '.jpeg' ? '.jpg' : item.ext;
    const filename = `${PREFIX}_fig${num}${ext}`;
    const outPath  = path.join(OUT_DIR, filename);
    fs.writeFileSync(outPath, Buffer.concat(item.buffers));
    console.log(`  ✅  Saved: ${filename}  (${(Buffer.concat(item.buffers).length / 1024).toFixed(1)} KB)`);
  });

  console.log(`\n✔  Done — ${entries.length} image${entries.length !== 1 ? 's' : ''} extracted to ${OUT_DIR}`);
}

extractImages().catch(err => { console.error('Error:', err); process.exit(1); });
