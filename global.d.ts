// Use type safe message keys with `next-intl`
type Messages = typeof import('@/lib/i18n/translations/en.json');

declare interface IntlMessages extends Messages {}
