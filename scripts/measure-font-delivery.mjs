// Production D2.1: start the built app on port 3004, then pass before/after.
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const label = process.argv[2]
if (!label || !/^[a-z0-9-]+$/.test(label)) throw new Error('Supply a lowercase output label')
const directory = `node_modules/.cache/d2-d8/${label}`
mkdirSync(directory, { recursive: true })
const url = 'http://localhost:3004/'
const response = await fetch(url)
if (response.status !== 200) throw new Error(`HTTP ${response.status}`)
const html = await response.text()
writeFileSync(`${directory}/home.html`, html)
for (const match of html.matchAll(/src="(\/_next\/image[^" ]+)"/g)) {
  const image = await fetch(new URL(match[1].replaceAll('&amp;', '&'), url))
  await image.arrayBuffer()
}
const results = []
for (let run = 1; run <= 3; run++) {
  const output = `${directory}/home-mobile-${run}`
  if (!existsSync(`${output}.report.json`)) {
    const args = ['dlx', 'lighthouse@13.5.0', url,
      '--only-categories=performance', '--output=json', `--output-path=${output}.report.json`,
      '--save-assets', '--quiet', '--no-enable-error-reporting', '--disable-full-page-screenshot',
      '--chrome-flags="--headless=new --disable-gpu"']
    const execution = spawnSync('cmd.exe', ['/d', '/s', '/c', `pnpm ${args.join(' ')}`],
      { encoding: 'utf8', windowsHide: true })
    if (execution.status !== 0) throw new Error(`Lighthouse run ${run} failed`)
  }
  const report = JSON.parse(readFileSync(`${output}.report.json`, 'utf8'))
  if (report.runtimeError) throw new Error(report.runtimeError.code)
  const metric = id => report.audits[id]?.numericValue ?? null
  results.push({
    run, fetchTime: report.fetchTime, lighthouseVersion: report.lighthouseVersion,
    userAgent: report.environment.hostUserAgent, settings: report.configSettings,
    score: report.categories.performance.score * 100,
    lcpMs: metric('largest-contentful-paint'), fcpMs: metric('first-contentful-paint'),
    tbtMs: metric('total-blocking-time'), cls: metric('cumulative-layout-shift'),
    bytes: metric('total-byte-weight'),
    fontDisplay: report.audits['font-display-insight'],
    fonts: report.audits['network-requests'].details.items.filter(item => item.resourceType === 'Font')
      .map(({ url, transferSize, resourceSize, statusCode }) => ({ url, transferSize, resourceSize, statusCode })),
    warnings: report.runWarnings,
    reportSha256: createHash('sha256').update(readFileSync(`${output}.report.json`)).digest('hex'),
  })
  writeFileSync(`${directory}/summary.json`, JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify({ run, score: results.at(-1).score,
    lcpMs: results.at(-1).lcpMs, fontDisplay: results.at(-1).fontDisplay.score }))
}
