import weekday from './data/weekday.json';

export const getLocaleHourMinute = (
  ISO8601HourMinute: string,
  locale?: Intl.LocalesArgument,
) => {
  const [hour, minute] = ISO8601HourMinute.split(':');
  const date = new Date();
  date.setHours(Number(hour), Number(minute), 0, 0);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${ISO8601HourMinute}`);
  }

  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const getLocaleWeekdaysString = (locale?: string) => {
  locale ||= 'en';
  return weekday[locale as keyof typeof weekday];
};
