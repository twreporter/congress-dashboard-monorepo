// Define a fallback context type (untyped) to prevent build-time errors
type UnsafeFallbackContext =
  import('@keystone-6/core/types').KeystoneContext<any>

// Attempt to import the fully typed context from .keystone/types
// This is a type-only import — it won’t cause runtime issues
type SafeContext =
  // Use the generated types if available (after `keystone dev` or `build`)
  | import('.keystone/types').Context
  // Otherwise fall back to the unsafe version to avoid TS errors
  | UnsafeFallbackContext

// Export a unified context type for safe use across the project
export type TypedKeystoneContext = SafeContext
