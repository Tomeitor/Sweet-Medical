function padNumber(value) {
  return String(value).padStart(2, "0");
}

export function formatDateTimeLocalValue(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    date.getFullYear(),
    padNumber(date.getMonth() + 1),
    padNumber(date.getDate()),
  ].join("-") + `T${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
}

export function serializeDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absoluteOffset / 60);
  const remainingMinutes = absoluteOffset % 60;

  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
    date.getDate(),
  )}T${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:00${sign}${padNumber(
    offsetHours,
  )}:${padNumber(remainingMinutes)}`;
}
