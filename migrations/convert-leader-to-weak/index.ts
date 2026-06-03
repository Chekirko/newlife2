import {defineMigration, at, set} from 'sanity/migrate'

export default defineMigration({
  title: 'Convert ministry.leader from strong to weak reference',
  documentTypes: ['ministry'],

  migrate: {
    document(doc) {
      const leader = doc.leader as
        | {_ref: string; _type: string; _weak?: boolean}
        | undefined
      if (leader?._ref && !leader._weak) {
        return [
          at('leader', set({
            ...leader,
            _weak: true,
          })),
        ]
      }
      return []
    },
  },
})
