import {
  resolveChatSpaUrl,
  type UriTemplateContext
} from '@linagora/twake-utils'

const FULL_MATRIX_ID = /^@[^:]+:.+$/
// "@{target}" followed by an optional ":server" part (literal or expression)
const TEMPLATE_MATRIX_ID = /@\{\s*target\s*\}(?::[^/?#&]*)?/g

/**
 * Resolve the chat URL for the given target.
 *
 * Templates usually expect {target} to be a bare localpart and add the "@"
 * (and the server) themselves, e.g. '.../#/chat/@{target}:{workplaceFqdn.domain}'.
 * Contacts may however store a full Matrix ID ("@user:server"): in that case
 * the "@{target}:server" part of the template is replaced by the full Matrix ID
 * so that neither the "@" nor the server get duplicated.
 *
 * @param template - The CHAT_SPA_URL template
 * @param target - The target user identifier (Matrix localpart, full Matrix ID or email)
 * @param context - Optional context for URL resolution (localpart, workplaceFqdn)
 * @returns the resolved URL, or null when template is empty
 */
export function resolveChatUrl(
  template: string | undefined,
  target: string,
  context: Omit<UriTemplateContext, 'target'> = {}
): string | null {
  const trimmedTarget = target.trim()
  const isFullMatrixId = FULL_MATRIX_ID.test(trimmedTarget)
  const effectiveTemplate = isFullMatrixId
    ? template?.replace(TEMPLATE_MATRIX_ID, '{target}')
    : template
  const effectiveTarget = isFullMatrixId
    ? trimmedTarget
    : trimmedTarget.replace(/^@/, '')

  return resolveChatSpaUrl(effectiveTemplate ?? '', {
    ...context,
    target: effectiveTarget,
    workplaceFqdnFallback: window.WORKPLACE_FQDN_FALLBACK
  })
}

/**
 * Open the chat with the given target in a new tab.
 * Uses CHAT_SPA_URL configuration.
 *
 * @param target - The target user identifier (Matrix ID or email)
 * @param context - Optional context for URL resolution (localpart, workplaceFqdn)
 * @returns true if the chat was opened, false if CHAT_SPA_URL is not configured
 */
export function openChat(
  target: string,
  context: Omit<UriTemplateContext, 'target'> = {}
): boolean {
  const url = resolveChatUrl(window.CHAT_SPA_URL, target, context)
  if (!url) return false

  window.open(url, '_blank', 'noopener,noreferrer')
  return true
}
