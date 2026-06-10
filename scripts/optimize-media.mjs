import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'
import sharp from 'sharp'
import ffmpegPath from 'ffmpeg-static'

const execFileP = promisify(execFile)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pics = path.join(root, 'public', 'pictures')
const vids = path.join(root, 'public', 'videos')

const fmt = (b) => `${(b / 1024).toFixed(0)} KB`
const sizeOf = async (p) => (await fs.stat(p)).size

// ---------- 1. Missing service images (placeholders from closest match) ----------
const placeholders = [
  ['serv-builder-gel-full-set.jpg', 'serv-acrylic-full-set.webp'],
  ['serv-polygel-full-set.jpg', 'serv-acrylic-fill-in.webp'],
  ['serv-builder-gel-full-set.jpg', 'serv-builder-gel-fill-in.jpg'],
  ['serv-volcano-pedicure.webp', 'serv-basic-pedicure.webp'],
  ['serv-volcano-pedicure.webp', 'serv-detox-pedicure.jpg'],
  ['serv-volcano-pedicure.webp', 'serv-jelly-pedicure.jpg'],
]

async function makePlaceholders() {
  for (const [src, dest] of placeholders) {
    const srcPath = path.join(pics, src)
    const destPath = path.join(pics, dest)
    try {
      await fs.access(destPath)
      console.log(`skip placeholder (exists): ${dest}`)
      continue
    } catch {}
    const img = sharp(srcPath).resize({ width: 800, withoutEnlargement: true })
    if (dest.endsWith('.webp')) await img.webp({ quality: 80 }).toFile(destPath)
    else await img.jpeg({ quality: 80, mozjpeg: true }).toFile(destPath)
    console.log(`placeholder created: ${dest}  <- ${src}`)
  }
}

// ---------- 2. Re-optimize all pictures in place ----------
async function optimizePictures() {
  const files = await fs.readdir(pics)
  for (const f of files) {
    const p = path.join(pics, f)
    const ext = path.extname(f).toLowerCase()
    if (!['.jpg', '.jpeg', '.webp', '.png'].includes(ext)) continue
    const buf = await fs.readFile(p)
    const before = buf.length
    const meta = await sharp(buf).metadata()
    const maxW = f === 'deborah.jpg' ? 1000 : 1280
    const pipeline = sharp(buf).rotate().resize({ width: Math.min(meta.width || maxW, maxW), withoutEnlargement: true })
    const out = ext === '.webp'
      ? await pipeline.webp({ quality: 80 }).toBuffer()
      : await pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true }).toBuffer()
    if (out.length < before) {
      await fs.writeFile(p, out)
      console.log(`img ${f}: ${fmt(before)} -> ${fmt(out.length)}`)
    } else {
      console.log(`img ${f}: kept (${fmt(before)})`)
    }
  }
}

// ---------- 3. Compress videos + generate posters ----------
async function optimizeVideos() {
  const list = ['V1', 'V2', 'V3']
  for (const v of list) {
    const inPath = path.join(vids, `${v}.mp4`)
    try { await fs.access(inPath) } catch { console.log(`skip ${v} (missing)`); continue }
    const before = await sizeOf(inPath)
    const outPath = path.join(vids, `${v}.opt.mp4`)
    // Portrait 9:16 display -> normalize to 720x1280, square pixels, no audio, web-optimized
    await execFileP(ffmpegPath, [
      '-y', '-i', inPath,
      '-vf', 'scale=720:1280,setsar=1',
      '-an',
      '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-crf', '28', '-preset', 'slow',
      '-movflags', '+faststart',
      outPath,
    ])
    const after = await sizeOf(outPath)
    await fs.rename(outPath, inPath)
    console.log(`video ${v}.mp4: ${fmt(before)} -> ${fmt(after)}`)

    // Poster from a representative frame
    const poster = path.join(pics, `poster-${v.toLowerCase()}.webp`)
    const frame = path.join(vids, `${v}.frame.png`)
    await execFileP(ffmpegPath, ['-y', '-i', inPath, '-vf', 'select=eq(n\\,15)', '-vframes', '1', frame])
    await sharp(frame).resize({ width: 720 }).webp({ quality: 70 }).toFile(poster)
    await fs.unlink(frame)
    console.log(`poster created: ${path.basename(poster)}`)
  }
}

async function main() {
  console.log('== placeholders ==')
  await makePlaceholders()
  console.log('\n== pictures ==')
  await optimizePictures()
  console.log('\n== videos ==')
  await optimizeVideos()
  console.log('\nDone.')
}

main().catch((e) => { console.error(e); process.exit(1) })
