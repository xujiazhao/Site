import { parseISO, format } from "date-fns";

type Props = {
  dateString: string;
  lang?: string;
};

const DateFormatter = ({ dateString, lang }: Props) => {
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) return <span>{dateString}</span>;
    
    if (lang === "zh") {
      return <time dateTime={dateString} suppressHydrationWarning>{format(date, "yyyy.MM.dd")}</time>;
    }
    return <time dateTime={dateString} suppressHydrationWarning>{format(date, "MMM\td, yyyy")}</time>;
  } catch {
    return <span>{dateString}</span>;
  }
};

export default DateFormatter;
