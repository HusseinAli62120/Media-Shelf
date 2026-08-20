import { CalendarDate } from "@internationalized/date";

export default function generateTimestamp({
  calendarDate,
}: {
  calendarDate: CalendarDate;
}) {
  const now = new Date();

  // Construct the timestamp for the diary entry
  const timestampInfo = new Date(
    calendarDate?.year,
    calendarDate?.month - 1,
    calendarDate?.day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );

  // Timestamp for adding diary entry (so that it also include time added)
  const timestamp = timestampInfo.toISOString();
  // Simple date for filtering range (which ignores time)
  const date = timestampInfo?.toLocaleDateString();

  return { timestamp, date };
}
