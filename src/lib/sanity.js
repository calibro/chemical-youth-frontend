import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: 'i89zv88h',
  dataset: 'projects',
  useCdn: true
  // useCdn == true gives fast, cheap responses using a globally distributed cache.
  // Set this to false if your application require the freshest possible
  // data always (potentially slightly slower and a bit more expensive).
})