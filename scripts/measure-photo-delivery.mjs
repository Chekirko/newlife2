// Production-only D9 series. Start the built app on port 3004 first.
// pnpm exec node scripts/measure-photo-delivery.mjs before
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const label = process.argv[2]
if (!label || !/^[a-z0-9-]+$/.test(label)) throw new Error('Supply a lowercase output label')
const directory = `node_modules/.cache/d9/${label}`
mkdirSync(directory, { recursive: true })
const url = 'http://localhost:3004/ministries/nove-sluzhinnya'
const response = await fetch(url)
if (response.status !== 200) throw new Error(`HTTP ${response.status}`)
const html = await response.text()
writeFileSync(`${directory}/ministry.html`, html)
const originals = [...new Set([...html.matchAll(/src="(https:\/\/cdn\.sanity\.io\/images\/[^" ]+\?q=100)"/g)]
  .map(match => match[1].replaceAll('&amp;', '&')))].sort()
const results = []
for (let run = 1; run <= 3; run++) {
  const output = `${directory}/ministry-mobile-${run}`
  if (!existsSync(`${output}.report.json`)) {
    const args = ['dlx', 'lighthouse@13.5.0', url,
      '--only-categories=performance', '--output=json', `--output-path=${output}.report.json`,
      '--save-assets', '--quiet', '--no-enable-error-reporting', '--disable-full-page-screenshot',
      '--chrome-flags="--headless=new --disable-gpu"']
    const result = spawnSync('cmd.exe', ['/d', '/s', '/c', `pnpm ${args.join(' ')}`],
      { encoding: 'utf8', windowsHide: true })
    if (result.status !== 0) throw new Error(`Lighthouse run ${run} failed`)
  }
  const report = JSON.parse(readFileSync(`${output}.report.json`, 'utf8'))
  if (report.runtimeError) throw new Error(report.runtimeError.code)
  results.push({
    run, fetchTime: report.fetchTime, lighthouseVersion: report.lighthouseVersion,
    userAgent: report.environment.hostUserAgent, settings: report.configSettings,
    score: report.categories.performance.score * 100,
    lcpMs: report.audits['largest-contentful-paint'].numericValue,
    cls: report.audits['cumulative-layout-shift'].numericValue,
    bytes: report.audits['total-byte-weight'].numericValue,
    photoRequests: report.audits['network-requests'].details.items
      .filter(item => originals.includes(item.url))
      .map(({ url, transferSize, resourceSize, statusCode }) => ({ url, transferSize, resourceSize, statusCode })),
    warnings: report.runWarnings,
    reportSha256: createHash('sha256').update(readFileSync(`${output}.report.json`)).digest('hex'),
  })
  writeFileSync(`${directory}/summary.json`, JSON.stringify({ originals, results }, null, 2) + '\n')
  console.log(JSON.stringify({ run, score: results.at(-1).score,
    bytes: results.at(-1).bytes, photoRequests: results.at(-1).photoRequests.length }))
}
