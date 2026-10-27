// Run after `pnpm run build` and `pnpm run start --port 3004`.
// pnpm exec node scripts/measure-seo-performance.mjs before
// Requires Chrome (CHROME_PATH may override autodetection). No CMS writes.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const label = process.argv[2]
if (!label || !/^[a-z0-9-]+$/.test(label)) {
  throw new Error('Supply an output label using lowercase letters, digits or hyphens')
}
const directory = `node_modules/.cache/seo-7/${label}`
mkdirSync(directory, { recursive: true })
async function detailPath(listing, prefix) {
  const response = await fetch(`http://localhost:3004${listing}`)
  const html = await response.text()
  const path = [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1])
    .find(path => path.startsWith(prefix) && !path.includes('?'))
  if (!path) throw new Error(`No detail link on ${listing}`)
  return path
}
const cases = [
  { name: 'home', path: '/' },
  { name: 'news-detail', path: await detailPath('/news', '/news/') },
  { name: 'ministry-detail', path: await detailPath('/ministries', '/ministries/') },
  { name: 'photos', path: '/media/photos' },
  { name: 'contact', path: '/contact' },
]
const results = []
async function warm(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetch(url, { headers: { Connection: 'close' } })
    } catch {
      if (attempt === 3) throw new Error(`Warm-up failed: ${new URL(url).pathname}`)
    }
  }
}
for (const test of cases) {
  // Warm the page and its image optimizer; Lighthouse still resets browser storage.
  const response = await warm(`http://localhost:3004${test.path}`)
  if (response.status !== 200) throw new Error(`${test.name}: HTTP ${response.status}`)
  const html = await response.text()
  for (const match of html.matchAll(/src="(\/_next\/image[^" ]+)"/g)) {
    const image = await warm(`http://localhost:3004${match[1].replaceAll('&amp;', '&')}`)
    await image.arrayBuffer()
  }
  for (let run = 1; run <= 3; run++) {
    const output = `${directory}/${test.name}-${run}`
    const args = [
      'dlx', 'lighthouse@13.5.0', `http://localhost:3004${test.path}`,
      '--only-categories=performance,accessibility,best-practices,seo', '--output=json', '--output=html',
      `--output-path=${output}`, '--save-assets', '--quiet',
      '--no-enable-error-reporting', '--disable-full-page-screenshot',
      '--chrome-flags="--headless=new --disable-gpu"',
      ...(test.desktop ? ['--preset=desktop'] : []),
    ]
    const command = process.platform === 'win32'
      ? { file: 'cmd.exe', args: ['/d', '/s', '/c', `pnpm ${args.join(' ')}`] }
      : { file: 'pnpm', args: args.map(value => value.replaceAll('"', '')) }
    // A label is an immutable series: resume existing runs, use a new label to rerun.
    if (!existsSync(`${output}.report.json`)) {
      const execution = spawnSync(command.file, command.args, { encoding: 'utf8', windowsHide: true })
      if (execution.status !== 0) throw new Error(`Lighthouse failed for ${test.name}-${run}; inspect local output`)
    }
    const report = JSON.parse(readFileSync(`${output}.report.json`, 'utf8'))
    if (report.runtimeError) throw new Error(`${test.name}-${run}: ${report.runtimeError.code}`)
    const metric = id => report.audits[id]?.numericValue ?? null
    const result = {
      name: test.name, path: test.path, run, fetchTime: report.fetchTime,
      lighthouseVersion: report.lighthouseVersion,
      userAgent: report.environment.hostUserAgent,
      settings: {
        formFactor: report.configSettings.formFactor,
        screenEmulation: report.configSettings.screenEmulation,
        throttlingMethod: report.configSettings.throttlingMethod,
        throttling: report.configSettings.throttling,
      },
      score: report.categories.performance.score * 100,
      categories: Object.fromEntries(Object.entries(report.categories).map(([name, category]) => [name, category.score * 100])),
      fcpMs: metric('first-contentful-paint'), lcpMs: metric('largest-contentful-paint'),
      tbtMs: metric('total-blocking-time'), cls: metric('cumulative-layout-shift'),
      speedIndexMs: metric('speed-index'), bytes: metric('total-byte-weight'),
      warnings: report.runWarnings,
    }
    results.push(result)
    writeFileSync(`${directory}/summary.json`, JSON.stringify(results, null, 2) + '\n')
    console.log(JSON.stringify({ name: result.name, run, score: result.score,
      lcpMs: Math.round(result.lcpMs), cls: result.cls, bytes: result.bytes }))
  }
}
