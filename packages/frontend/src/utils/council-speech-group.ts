/** Missing membership and group boundaries never produce a navigation target. */
export const getSpeechNeighbors = (slugs: string[], slug: string) => {
  const index = slugs.indexOf(slug)
  return {
    previous: index > 0 ? slugs[index - 1] : undefined,
    next: index >= 0 ? slugs[index + 1] : undefined,
  }
}
