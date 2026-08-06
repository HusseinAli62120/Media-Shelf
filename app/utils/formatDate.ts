import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";

const formatDate = ({ date }: { date: CalendarDate }) => {
  const dateFormat = new DateFormatter("en-US", {
    dateStyle: "medium",
  });

  return dateFormat.format(date.toDate(getLocalTimeZone()));
};

export { formatDate };
