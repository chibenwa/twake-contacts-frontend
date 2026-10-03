Closes #151

## Cause
`parseAddresses` read the ADR components in the wrong order (`[street, locality, address, postalCode, country]`), while RFC 6350 uses `[PO box, extended, street, locality, region, postal code, country]`. It also dropped PO box, extended address and region. `denormalizeContact` never wrote `address`, and the edit form's `formatAddress` ignored it. As a result:
- a street-only address showed as an empty field in the form and was deleted on save;
- an imported full address was garbled (the city was stored as the postal code, and the street, postal code and country were lost).

## Fix
- `ContactAddress` now holds all seven ADR components (`poBox`, `extended`, `street`, `locality`, `region`, `postalCode`, `country`). The ambiguous `address` field is gone.
- The transformer reads and writes the components in RFC order and pads short ADR values, so untouched addresses round-trip without loss.
- A single `formatAddress` in `common/src/features/Contacts/contactsUtils.ts` is now used by both the contact page and the edit form. Because the form value matches the stored address again, the existing "untouched" detection in `makeContactFromForm` keeps the original address as it is.

## Tests
- Fixed the `reads addresses` transformer test, which encoded the wrong mapping. Added a test for short ADR values and a normalize → denormalize round-trip test.
- Added `ContactForm/types.test.ts`: the edit form shows the full address, and untouched or street-only addresses are saved unchanged.

⚠️ I could not run jest, tsc or eslint in my environment: the worktree had no dependencies installed and the available Node was too old. Please let CI confirm.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---
*Generated automatically*
