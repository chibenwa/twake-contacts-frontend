import { AddressBook } from '@common/features/Contacts/contactsTypes'
import {
  DropdownText,
  ListItem,
  Stack,
  useBreakpoints
} from '@linagora/twake-mui'
import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'
import { AddressBookNavItem } from './AddressBookNavItem'
import { CreateAddressBookButton } from './CreateAddressBookButton'

export interface SharedBooksNavSectionProps {
  books: AddressBook[]
  selectedBookId?: string
  onOpenSubscribe: () => void
}

const TOGGLE_KEYS = ['Enter', ' ']

// Twake-mui's NavDesktopDropdown renders its toggle as a plain caption that
// is neither focusable nor announced: expose it as an accessible button.
export const SharedBooksNavSection: React.FC<SharedBooksNavSectionProps> = ({
  books,
  selectedBookId,
  onOpenSubscribe
}) => {
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()
  const [isExpanded, setIsExpanded] = useState(true)
  const isToggleable = books.length > 0
  const toggle = (): void => setIsExpanded(current => !current)

  if (!isDesktop) return null

  const toggleProps = isToggleable
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-expanded': isExpanded,
        onClick: toggle,
        onKeyDown: (event: React.KeyboardEvent): void => {
          if (TOGGLE_KEYS.includes(event.key)) {
            event.preventDefault()
            toggle()
          }
        }
      }
    : {}

  return (
    <>
      <ListItem size="small">
        <Stack
          direction="row"
          className="u-w-100 u-flex-justify-between u-flex-items-center"
        >
          <DropdownText
            variant="caption"
            color="textSecondary"
            className={isToggleable ? 'u-c-pointer' : undefined}
            innerIconProps={{
              rotate: isExpanded ? 0 : -90,
              display: isToggleable ? undefined : 'none'
            }}
            {...toggleProps}
          >
            {t('contacts.shared')}
          </DropdownText>
          <CreateAddressBookButton
            onClick={onOpenSubscribe}
            label={t('contacts.addressBook.subscribeTitle')}
          />
        </Stack>
      </ListItem>
      {isExpanded &&
        books.map(book => (
          <AddressBookNavItem
            key={book.id}
            book={book}
            variant="primary"
            selected={selectedBookId === book.id}
          />
        ))}
    </>
  )
}
