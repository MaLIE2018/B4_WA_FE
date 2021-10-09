import {
  differenceInCalendarDays,
  differenceInMinutes,
  differenceInHours,
} from "date-fns";

export function gotoBottom(klasse) {
  var element = document.querySelector(klasse);
  element.scrollTo(0, element.scrollHeight);
}

export const dateDiff = (date, now) => {
  const actDate = new Date(date);
  const daysDiff = differenceInCalendarDays(now, actDate);
  const hoursDiff = differenceInHours(now, actDate);
  const minutesDiff = differenceInMinutes(now, actDate);
  if (daysDiff !== 0) {
    return daysDiff + " d ago";
  } else if (hoursDiff !== 0) {
    return differenceInHours(now, actDate) + " h ago";
  } else if (minutesDiff !== 0) {
    return differenceInMinutes(now, actDate) + " min ago";
  } else {
    return "Now";
  }
};
