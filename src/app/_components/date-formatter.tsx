import { parseISO, format } from "date-fns";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) return <span>{dateString}</span>;
    return <time dateTime={dateString} suppressHydrationWarning>{format(date, "LLLL\td, yyyy")}</time>;
  } catch {
    return <span>{dateString}</span>;
  }
};

export default DateFormatter;
