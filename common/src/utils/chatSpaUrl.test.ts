/**
 * @jest-environment jsdom
 */
import { openChat, resolveChatUrl } from './chatSpaUrl'

const SIMPLE_TEMPLATE = 'http://chat.e2e.local/#/chat/@{target}'
const SERVER_TEMPLATE =
  'https://{workplaceFqdn.localpart}-chat.{workplaceFqdn.domain}/#/chat/@{target}:{workplaceFqdn.domain}'
const context = { workplaceFqdn: 'alice.twake.app' }

describe('resolveChatUrl', () => {
  it('returns null when no template is configured', () => {
    expect(resolveChatUrl(undefined, 'neo')).toBeNull()
  })

  it('prefixes a bare localpart with the template', () => {
    expect(resolveChatUrl(SIMPLE_TEMPLATE, 'neo')).toBe(
      'http://chat.e2e.local/#/chat/@neo'
    )
    expect(resolveChatUrl(SERVER_TEMPLATE, 'neo', context)).toBe(
      'https://alice-chat.twake.app/#/chat/@neo:twake.app'
    )
  })

  it('does not duplicate the "@" of a full Matrix ID', () => {
    expect(resolveChatUrl(SIMPLE_TEMPLATE, '@trinity:matrix.org')).toBe(
      'http://chat.e2e.local/#/chat/@trinity:matrix.org'
    )
  })

  it('does not append the template server to a full Matrix ID', () => {
    expect(
      resolveChatUrl(SERVER_TEMPLATE, '@trinity:matrix.org', context)
    ).toBe('https://alice-chat.twake.app/#/chat/@trinity:matrix.org')
  })

  it('replaces a literal template server for a full Matrix ID', () => {
    expect(
      resolveChatUrl(
        'https://chat.example.com/#/chat/@{target}:example.com?via=x',
        '@trinity:matrix.org'
      )
    ).toBe('https://chat.example.com/#/chat/@trinity:matrix.org?via=x')
  })

  it('strips a leading "@" from a localpart without server', () => {
    expect(resolveChatUrl(SERVER_TEMPLATE, '@neo', context)).toBe(
      'https://alice-chat.twake.app/#/chat/@neo:twake.app'
    )
  })

  it('keeps the full Matrix ID when the template has no "@" prefix', () => {
    expect(
      resolveChatUrl(
        'https://chat.example.com/#/chat/{target}',
        '@trinity:matrix.org'
      )
    ).toBe('https://chat.example.com/#/chat/@trinity:matrix.org')
  })
})

describe('openChat', () => {
  const originalChatSpaUrl = window.CHAT_SPA_URL

  afterEach(() => {
    window.CHAT_SPA_URL = originalChatSpaUrl
    jest.restoreAllMocks()
  })

  it('opens the chat of a full Matrix ID without doubling the "@"', () => {
    window.CHAT_SPA_URL = SIMPLE_TEMPLATE
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    expect(openChat('@trinity:matrix.org')).toBe(true)
    expect(openSpy).toHaveBeenCalledWith(
      'http://chat.e2e.local/#/chat/@trinity:matrix.org',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('does nothing when CHAT_SPA_URL is not configured', () => {
    window.CHAT_SPA_URL = undefined
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    expect(openChat('neo')).toBe(false)
    expect(openSpy).not.toHaveBeenCalled()
  })
})
