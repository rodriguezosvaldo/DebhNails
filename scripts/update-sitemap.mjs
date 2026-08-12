import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'

// Stamps sitemap.xml <lastmod> with today's date on every build, so search
// engines always see a fresh signal without anyone editing the XML by hand.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sitemapPath = path.join(root, 'public', 'sitemap.xml')

const today = new Date().toISOString().slice(0, 10)

const xml = await fs.readFile(sitemapPath, 'utf8')
const updated = xml.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`)

if (updated !== xml) {
  await fs.writeFile(sitemapPath, updated)
  console.log(`sitemap.xml: lastmod -> ${today}`)
} else {
  console.log('sitemap.xml: already up to date')
}
