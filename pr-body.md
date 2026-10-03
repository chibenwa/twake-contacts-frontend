Closes #158

## Root cause
`normalizeAddressBook` computed `canWrite` from `dav:acl`, which for a delegated book is the book's own ACL, not the sharee's rights. A book shared read-only (`dav:share-access: 2`) was therefore seen as writable.

## Changes
- `canWrite` is now false when `dav:share-access` is read-only (2) or no-access (4), following the sabre/dav sharing constants. This hides the Import button on such books and removes them from the create form's address book choices, since both already rely on `canWrite`.
- Contact thunks now store an i18n key in `state.error` (`contacts.errors.*`) instead of the raw HTTP client message. A 403 maps to a dedicated "no permission" message. `ContactsPage` translates the key. Strings are added for en, fr, ru and vi.
- Unit tests for `normalizeAddressBook` cover the share-access cases.

## Not verified
Only Node 12 was available in the automation environment, so I could not run `jest`, `eslint` or the TypeScript build. Please rely on CI.

---
*Generated automatically*
