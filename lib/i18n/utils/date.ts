export const toWeekday = (day: number, locale: Intl.LocalesArgument) => {
  if (day === undefined || day === null) return null;
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + day);
  if (locale === 'en') locale = 'en-US';
  return date.toLocaleDateString(locale, { weekday: 'short' });
};

export const withinTimeRange = (hours: ([string, string] | null)[]) => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hoursToday = hours[dayOfWeek];

  if (!hoursToday) {
    return false;
  }

  const [openAt, closeAt] = hoursToday.map((time) => {
    const [hour, minute] = time.split(':').map(Number);
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
    );
  });

  return now >= openAt && now < closeAt;
};
