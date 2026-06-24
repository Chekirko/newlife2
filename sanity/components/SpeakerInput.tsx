import { useCallback, useEffect, useState } from 'react'
import { set, unset, useClient, type StringInputProps } from 'sanity'
import { Autocomplete, Card, Text } from '@sanity/ui'
import { apiVersion } from '../env'

/**
 * Speaker input — a real dropdown of previously-used speakers that also accepts a
 * brand-new name typed in. Built on @sanity/ui Autocomplete:
 *  - options are the DISTINCT existing `mediaItem.speaker` values (fetched live),
 *  - selecting one commits it (`onChange`),
 *  - typing a value commits the free text (`onQueryChange`) so a new speaker is
 *    saved — and shows up in the list next time.
 * The open button reveals the full list; filtering is case-insensitive.
 */
const SPEAKERS_QUERY = `array::unique(*[_type == "mediaItem" && defined(speaker)].speaker)`

export function SpeakerInput(props: StringInputProps) {
  const { onChange, value = '', id } = props
  const client = useClient({ apiVersion })
  const [options, setOptions] = useState<{ value: string }[]>([])

  useEffect(() => {
    let active = true
    client
      .fetch<string[]>(SPEAKERS_QUERY)
      .then((res) => {
        if (!active) return
        const list = (res ?? [])
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, 'uk'))
          .map((v) => ({ value: v }))
        setOptions(list)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [client])

  const commit = useCallback(
    (next: string) => {
      onChange(next ? set(next) : unset())
    },
    [onChange],
  )

  return (
    <Autocomplete
      id={id}
      icon={false}
      openButton
      options={options}
      value={value}
      placeholder="Оберіть проповідника або впишіть нового…"
      filterOption={(query, option) => option.value.toLowerCase().includes(query.toLowerCase())}
      onChange={(v) => commit(v ?? '')}
      onQueryChange={(query) => {
        if (query !== null) commit(query)
      }}
      renderOption={(option) => (
        <Card as="button" padding={3} radius={2}>
          <Text size={1}>{option.value}</Text>
        </Card>
      )}
    />
  )
}
