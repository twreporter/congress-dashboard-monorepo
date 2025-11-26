export type ValuesOf<T> = T[keyof T]

// Helper types for options
export type Option = {
  label: string
  value: string
}

// Helper function to create options
export function createOptions<T extends string>(
  enumObj: Record<string, T>,
  labels: Record<T, string>
): Option[] {
  return Object.values(enumObj).map((value: T) => ({
    label: labels[value],
    value,
  }))
}
