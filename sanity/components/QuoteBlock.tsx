import { type BlockStyleProps } from 'sanity'

/**
 * Custom editor preview for the `blockquote` block style.
 *
 * Sanity's default renders the quote as a <div> inside the block's <p> wrapper.
 * With Studio embedded in the Next.js app, React 19 / Next 16's dev hydration
 * overlay flags that <div>-in-<p> nesting as an error. Rendering an inline
 * <span> (styled to look block-level) keeps the nesting valid and silences it.
 *
 * This only affects the Studio editor preview — the public site renders the
 * quote via `components/PortableTextBody.tsx` and is unaffected.
 */
export function QuoteBlock(props: BlockStyleProps) {
  return (
    <span
      style={{
        display: 'block',
        borderLeft: '3px solid #4cbd89',
        paddingLeft: '0.85rem',
        fontStyle: 'italic',
        color: '#5a6066',
      }}
    >
      {props.children}
    </span>
  )
}
