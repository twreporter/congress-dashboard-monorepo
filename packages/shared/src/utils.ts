export type ValuesOf<T> = T[keyof T]

// Helper types for options
export type Option = {
  label: string
  value: string
}

// Helper function to create options
export function createOptions<const E extends Record<string, string>>(
  enumObj: E,
  labels: Readonly<Record<E[keyof E], string>>
): Option[] {
  const values = Object.values(enumObj) as Array<E[keyof E]>
  return values.map((value) => ({
    label: labels[value],
    value,
  }))
}
