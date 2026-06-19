import { useCallback, useId } from 'react'
import type { ChangeEvent } from 'react'
import { set, unset, type StringInputProps } from 'sanity'
import { TextInput } from '@sanity/ui'

type ListOption = string | { value: string; title?: string }

/**
 * "Pick from a list OR type your own" string input.
 *
 * Suggestions come from the field's own `options.list` (single source of truth in
 * the schema); a native <datalist> shows them while the underlying text input lets
 * the editor type any free value — which is committed via set/unset. Unlike a plain
 * `options.list` (dropdown only) or @sanity/ui Autocomplete (which only commits a
 * selected option), an arbitrary new value is always saved here.
 */
export function TagInput(props: StringInputProps) {
  const { onChange, value = '', schemaType, id } = props
  const datalistId = useId()

  const options = (
    ((schemaType.options as { list?: ListOption[] } | undefined)?.list ?? []) as ListOption[]
  ).map((opt) => (typeof opt === 'string' ? opt : opt.value))

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.currentTarget.value
      onChange(next ? set(next) : unset())
    },
    [onChange]
  )

  return (
    <>
      <TextInput
        id={id}
        value={value}
        onChange={handleChange}
        list={datalistId}
        placeholder="Оберіть зі списку або впишіть свою…"
      />
      <datalist id={datalistId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </>
  )
}
