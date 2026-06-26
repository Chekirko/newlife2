import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  set,
  unset,
  useClient,
  type ArrayOfPrimitivesInputProps,
  type StringInputProps,
} from 'sanity'
import { Autocomplete, Button, Card, Flex, Stack, Text } from '@sanity/ui'
import { apiVersion } from '../env'

/**
 * Category inputs for the `news` document — real searchable dropdowns (like
 * `SpeakerInput`), replacing the old `<datalist>` hints from `TagInput`.
 *  - `CategoryInput`      — single value (`mainCategory`).
 *  - `MultiCategoryInput` — chip multi-select (`categories`).
 * Both merge the schema's `options.list` with the DISTINCT values already used
 * across existing news (so ad-hoc categories typed earlier stay reusable) and
 * allow committing a brand-new value typed in.
 */

const OPTIONS_QUERY = `{
  "main": array::unique(*[_type == "news" && defined(mainCategory)].mainCategory),
  "extra": array::unique(*[_type == "news" && defined(categories)].categories[])
}`

/** Base list (schema) ∪ distinct existing values, deduped + sorted (uk). */
function useCategoryOptions(base: string[]): string[] {
  const client = useClient({ apiVersion })
  const [existing, setExisting] = useState<string[]>([])

  useEffect(() => {
    let active = true
    client
      .fetch<{ main?: string[]; extra?: string[] }>(OPTIONS_QUERY)
      .then((res) => {
        if (!active) return
        setExisting([...(res?.main ?? []), ...(res?.extra ?? [])])
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [client])

  return useMemo(() => {
    const seen = new Set<string>()
    const out: string[] = []
    for (const v of [...base, ...existing]) {
      if (!v || seen.has(v)) continue
      seen.add(v)
      out.push(v)
    }
    return out.sort((a, b) => a.localeCompare(b, 'uk'))
  }, [base, existing])
}

// ============================================
// Single — mainCategory
// ============================================
export function CategoryInput(props: StringInputProps) {
  const { onChange, value = '', id, schemaType } = props
  const base = ((schemaType.options as { list?: string[] } | undefined)?.list ?? []) as string[]
  const options = useCategoryOptions(base)

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
      options={options.map((v) => ({ value: v }))}
      value={value}
      placeholder="Оберіть категорію або впишіть нову…"
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

// ============================================
// Multi (chips) — categories
// ============================================
export function MultiCategoryInput(props: ArrayOfPrimitivesInputProps) {
  const { onChange, value, schemaType } = props
  const selected = (value ?? []).filter((v): v is string => typeof v === 'string')

  const memberOptions = schemaType.of?.[0]?.options as { list?: string[] } | undefined
  const base = (memberOptions?.list ?? []) as string[]
  const all = useCategoryOptions(base)

  const [query, setQuery] = useState('')
  const [addKey, setAddKey] = useState(0)

  const add = useCallback(
    (raw: string) => {
      const next = raw.trim()
      if (!next || selected.includes(next)) return
      onChange(set([...selected, next]))
      setQuery('')
      setAddKey((k) => k + 1) // remount the adder to clear its field
    },
    [onChange, selected],
  )

  const remove = useCallback(
    (val: string) => {
      const next = selected.filter((v) => v !== val)
      onChange(next.length ? set(next) : unset())
    },
    [onChange, selected],
  )

  const trimmed = query.trim()
  const showCreate =
    trimmed.length > 0 &&
    !all.some((o) => o.toLowerCase() === trimmed.toLowerCase()) &&
    !selected.some((o) => o.toLowerCase() === trimmed.toLowerCase())

  const options = [
    ...(showCreate ? [{ value: trimmed, __new: true }] : []),
    ...all.filter((o) => !selected.includes(o)).map((v) => ({ value: v })),
  ]

  return (
    <Stack space={3}>
      {selected.length > 0 && (
        <Flex gap={2} wrap="wrap">
          {selected.map((val) => (
            <Card key={val} padding={2} radius={2} tone="primary" border>
              <Flex align="center" gap={2}>
                <Text size={1}>{val}</Text>
                <Button
                  mode="bleed"
                  padding={1}
                  fontSize={1}
                  text="✕"
                  aria-label={`Видалити «${val}»`}
                  onClick={() => remove(val)}
                />
              </Flex>
            </Card>
          ))}
        </Flex>
      )}
      <Autocomplete
        key={addKey}
        id={props.id}
        icon={false}
        openButton
        options={options}
        placeholder="Додати категорію — оберіть зі списку або впишіть нову…"
        filterOption={(q, option) => option.value.toLowerCase().includes(q.toLowerCase())}
        onChange={(v) => {
          if (v) add(v)
        }}
        onQueryChange={(q) => setQuery(q ?? '')}
        renderOption={(option) => (
          <Card as="button" padding={3} radius={2}>
            <Text size={1}>
              {'__new' in option && option.__new ? `➕ Додати «${option.value}»` : option.value}
            </Text>
          </Card>
        )}
      />
    </Stack>
  )
}
