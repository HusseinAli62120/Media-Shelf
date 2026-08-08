import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";

const formatDateTime = ({
  timestamp,
}: {
  timestamp: string | CalendarDate;
}) => {
  const dateFormat = new DateFormatter("en-US", {
    dateStyle: "medium",
  });

  const dateTimeFormat = new DateFormatter("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return {
    date:
      timestamp instanceof CalendarDate
        ? dateFormat.format(timestamp.toDate(getLocalTimeZone()))
        : dateFormat.format(new Date(timestamp)),
    dateTime:
      timestamp instanceof CalendarDate
        ? dateTimeFormat.format(timestamp.toDate(getLocalTimeZone()))
        : dateTimeFormat.format(new Date(timestamp)),
  };
};

export { formatDateTime };
