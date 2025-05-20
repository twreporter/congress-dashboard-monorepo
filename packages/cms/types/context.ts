// Define a fallback context type (untyped) to prevent build-time errors
type UnsafeFallbackContext =
  import('@keystone-6/core/types').KeystoneContext<any>

// Attempt to import the fully typed context from .keystone/types
// This is a type-only import — it won’t cause runtime issues
import type { Context as SafeContext } from '.keystone/types'

// Export a unified context type for safe use across the project
// Fallback to UnsafeFallbackContext only if SafeContext is unavailable
export type TypedKeystoneContext = unknown extends SafeContext
  ? UnsafeFallbackContext
  : SafeContext
