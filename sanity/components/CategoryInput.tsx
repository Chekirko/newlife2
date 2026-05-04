import { useCallback } from 'react'
import { StringInputProps, set, unset } from 'sanity'
import { Autocomplete } from '@sanity/ui'

const PREDEFINED = [
  'Місія',
  'Навчання',
  'Служіння',
  'Молодь',
  'Культура',
  'Волонтерство',
  'Подія',
]

export function CategoryInput(props: StringInputProps) {
  const { onChange, value, id } = props

  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue ? set(newValue) : unset())
    },
    [onChange]
  )

  return (
    <Autocomplete
      id={id || 'category-input'}
      fontSize={2}
      options={PREDEFINED.map((val) => ({ value: val }))}
      value={value || ''}
      onChange={handleChange}
      placeholder="Оберіть зі списку або впишіть свою..."
      openButton
    />
  )
}
