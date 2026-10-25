import { useEffect, useState } from 'react'
import { Box, Button, Card, Checkbox, Dialog, Flex, Grid, Spinner, Stack, Text, TextInput } from '@sanity/ui'
import { useClient } from 'sanity'
import { defineQuery } from 'next-sanity'
import { styled } from 'styled-components'
import { apiVersion } from '../env'

const PAGE_SIZE = 40
const AssetCard = styled.div`
  min-width: 0;
  overflow: hidden;
  &:has(input:not(:disabled)):hover > label {
    box-shadow: inset 0 0 0 2px var(--card-border-color);
  }
  &:focus-within {
    outline: 2px solid var(--card-focus-ring-color);
  }
`
export const GALLERY_ASSETS_QUERY = defineQuery(`
  *[_type == "sanity.imageAsset" && ($search == "" || originalFilename match $search)]
  | order(_createdAt desc, _id asc) [$start...$end] {
    _id, originalFilename, url
  }
`)

export type GalleryAsset = {
  _id: string
  originalFilename?: string
  url: string
}

type Props = {
  remaining: number
  existingIds: string[]
  readOnly?: boolean
  onClose: () => void
  onSelect: (assets: GalleryAsset[]) => void
}

export function GalleryAssetPicker({ remaining, existingIds, readOnly, onClose, onSelect }: Props) {
  const client = useClient({ apiVersion })
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [retry, setRetry] = useState(0)
  const [assets, setAssets] = useState<GalleryAsset[]>([])
  const [selected, setSelected] = useState<GalleryAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    client.fetch<GalleryAsset[]>(GALLERY_ASSETS_QUERY, {
      search: search ? `${search}*` : '', start: page * PAGE_SIZE, end: (page + 1) * PAGE_SIZE + 1,
    }, { signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return
      setAssets((previous) => page === 0 ? result.slice(0, PAGE_SIZE) : [...previous, ...result.slice(0, PAGE_SIZE)])
      setHasMore(result.length > PAGE_SIZE)
      setLoading(false)
    }).catch(() => {
      if (controller.signal.aborted) return
      setError('Не вдалося отримати фотографії. Перевірте з’єднання та спробуйте ще раз.')
      setLoading(false)
    })
    return () => controller.abort()
  }, [client, page, retry, search])

  const availableSelected = selected.filter((asset) => !existingIds.includes(asset._id))
  const overLimit = availableSelected.length > remaining

  return (
    <Dialog id="gallery-asset-picker" header="Вибрати фотографії зі Studio" width={2}
      onClose={onClose} onClickOutside={onClose}
      footer={<Box padding={3}><Flex justify="space-between" gap={3} wrap="wrap">
        <Text size={1} aria-live="polite">Обрано {availableSelected.length}. Можна додати: {remaining}.</Text>
        <Flex gap={2}>
          <Button text="Скасувати" mode="ghost" onClick={onClose} />
          <Button text={`Додати обрані (${availableSelected.length})`} tone="primary"
            disabled={readOnly || !availableSelected.length || overLimit}
            onClick={() => onSelect(availableSelected)} />
        </Flex>
      </Flex></Box>}
    >
      <Box padding={4}><Stack space={4}>
        <Text size={1}>Позначте потрібні фото чекбоксами, потім натисніть «Додати обрані».</Text>
        <form onSubmit={(event) => {
          event.preventDefault()
          if (search === query.trim()) return
          setLoading(true); setError(''); setPage(0); setSearch(query.trim())
        }}>
          <Flex gap={2}>
            <Box flex={1}><TextInput aria-label="Пошук фото за назвою файлу" placeholder="Назва файлу…"
              value={query} onChange={(event) => setQuery(event.currentTarget.value)} /></Box>
            <Button type="submit" text="Знайти" disabled={loading} />
          </Flex>
        </form>
        {error && <Card padding={3} tone="critical" role="alert"><Stack space={3}>
          <Text size={1}>{error}</Text>
          <Button text="Спробувати ще раз" onClick={() => { setLoading(true); setError(''); setRetry((value) => value + 1) }} />
        </Stack></Card>}
        {overLimit && <Text size={1} role="alert">Зніміть зайві позначки: доступно {remaining} місць.</Text>}
        <Grid columns={[2, 2, 3, 4]} gap={3}>
          {assets.map((asset) => {
            const checked = selected.some((item) => item._id === asset._id)
            const existing = existingIds.includes(asset._id)
            const disabled = readOnly || existing || (!checked && availableSelected.length >= remaining)
            return (
              <AssetCard key={asset._id}>
              <Card as="label" padding={2} border radius={2} tone={checked ? 'primary' : 'default'}
                style={{ display: 'block', height: '100%', cursor: disabled ? 'not-allowed' : 'pointer', opacity: existing ? 0.6 : 1 }}>
                <Stack space={3}>
                  {/* Studio thumbnails use the asset CDN directly, independent of Next's image optimizer. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${asset.url}?w=240&h=180&fit=max&auto=format`} alt="" loading="lazy"
                    style={{ width: '100%', height: 110, objectFit: 'contain' }} />
                  <Flex gap={2} align="center">
                    <Checkbox checked={checked || existing} disabled={disabled}
                      aria-label={`Обрати ${asset.originalFilename || asset._id}`}
                      style={{ cursor: disabled ? 'not-allowed' : 'pointer', flexShrink: 0 }}
                      onChange={() => setSelected((previous) => checked
                        ? previous.filter((item) => item._id !== asset._id) : [...previous, asset])} />
                    <Box flex={1} style={{ minWidth: 0 }}><Text size={1} textOverflow="ellipsis"
                      title={asset.originalFilename || asset._id}>{asset.originalFilename || asset._id}</Text></Box>
                  </Flex>
                  {existing && <Text size={1} muted>Вже в галереї</Text>}
                </Stack>
              </Card>
              </AssetCard>
            )
          })}
        </Grid>
        {loading && <Flex justify="center" gap={3} role="status"><Spinner /><Text size={1}>Завантаження фото…</Text></Flex>}
        {!loading && !error && !assets.length && <Text size={1}>Фотографій не знайдено.</Text>}
        {!loading && !error && hasMore && <Button text="Показати ще" mode="ghost"
          onClick={() => { setLoading(true); setPage((value) => value + 1) }} />}
      </Stack></Box>
    </Dialog>
  )
}
