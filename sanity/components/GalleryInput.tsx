import { useRef, useState, type ChangeEvent } from 'react'
import { Button, Card, Stack, Text } from '@sanity/ui'
import { useFormBuilder, type ArrayOfObjectsInputProps } from 'sanity'
import { GalleryAssetPicker, type GalleryAsset } from './GalleryAssetPicker'

const MAX_PHOTOS = 10

export function GalleryInput(props: ArrayOfObjectsInputProps) {
  const { __internal: { image } } = useFormBuilder()
  const assetSource = image.directUploads
    ? image.assetSources.find((source) => source.Uploader)
    : undefined
  const [error, setError] = useState('')
  const [selecting, setSelecting] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const selectButton = useRef<HTMLButtonElement>(null)
  const remaining = Math.max(0, MAX_PHOTOS - (props.value?.length ?? 0))
  const uploadDisabled = props.readOnly || !props.onSelectFile || !assetSource || remaining === 0
  const existingIds = (props.value ?? []).flatMap((item) => {
    const asset = 'asset' in item ? item.asset as { _ref?: string } | undefined : undefined
    return asset?._ref ? [asset._ref] : []
  })

  function closePicker() {
    setSelecting(false)
    requestAnimationFrame(() => selectButton.current?.focus())
  }

  function selectAssets(assets: GalleryAsset[]) {
    if (props.readOnly) return
    const additions = assets.filter((asset) => !existingIds.includes(asset._id))
    if (!additions.length) return
    if (additions.length > remaining) {
      setError(`Можна додати ще ${remaining} фото. Зніміть зайві позначки.`)
      return
    }
    props.onInsert({
      items: additions.map((asset) => ({
        _key: crypto.randomUUID(), _type: props.schemaType.of[0].name,
        asset: { _type: 'reference', _ref: asset._id, _weak: true },
      })),
      position: 'after', referenceItem: -1, skipInitialValue: true, open: false,
    })
    setError('')
    closePicker()
  }

  function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''
    setError('')
    if (!files.length || props.readOnly || !props.onSelectFile || !assetSource) return
    if (files.length > remaining) {
      setError(`Можна додати ще ${remaining} фото. Виберіть не більше цієї кількості.`)
      return
    }

    const schemaType = props.schemaType.of[0]
    if (!schemaType || !('fields' in schemaType)) return
    if (files.some((file) => !file.type.startsWith('image/'))) {
      setError('Виберіть лише підтримувані файли зображень. Жоден файл із цієї добірки не завантажено.')
      return
    }
    for (const file of files) {
      props.onSelectFile({ file, schemaType, assetSource })
    }
  }

  return (
    <Stack space={3}>
      <Card padding={3} border radius={2}>
        <Stack space={3}>
          <Button text="Завантажити кілька фото з пристрою" tone="primary" mode="ghost"
            disabled={uploadDisabled} onClick={() => fileInput.current?.click()}
            style={{ cursor: uploadDisabled ? 'not-allowed' : 'pointer', minHeight: 44 }} />
          <input
            ref={fileInput}
            hidden
            aria-label="Завантажити кілька фото з пристрою"
            id={`${props.id}-upload`}
            type="file"
            accept="image/*"
            multiple
            disabled={uploadDisabled}
            onChange={uploadFiles}
          />
          <Button text="Select — вибрати фото зі Studio" mode="ghost" tone="primary"
            ref={selectButton}
            disabled={props.readOnly || remaining === 0} onClick={() => setSelecting(true)}
            style={{ cursor: props.readOnly || remaining === 0 ? 'not-allowed' : 'pointer', minHeight: 44 }} />
        </Stack>
      </Card>
      <Text size={1} muted>Можна додати ще {remaining} фото.</Text>
      {error && <Card padding={3} tone="critical" role="alert"><Text size={1}>{error}</Text></Card>}
      {selecting && <GalleryAssetPicker remaining={remaining} existingIds={existingIds} readOnly={props.readOnly}
        onClose={closePicker} onSelect={selectAssets} />}
      {props.renderDefault(props)}
    </Stack>
  )
}
