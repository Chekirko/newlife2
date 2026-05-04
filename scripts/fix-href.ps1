$file = 'c:\CodeData\sanity\newlife2\components\sections\EventsSlider.tsx'
$content = Get-Content $file -Raw
$content = $content -replace 'href=\{event\.href\}', 'href={`/events/${event.slug}`}'
Set-Content $file -Value $content -NoNewline
Write-Host "Done replacing event.href"
