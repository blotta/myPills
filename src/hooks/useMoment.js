import moment from 'moment'
import "moment/locale/pt-br";
import { useRef } from "react";

const calendarDayOnlyFormats = {
    sameDay: '[Hoje]',
    nextDay: '[Amanhã]',
    nextWeek: 'dddd',
    lastDay: '[Ontem]',
    lastWeek: '[Última] dddd',
    sameElse: 'DD/MM/YYYY'
}

export default function useMoment() {

  const momentRef = useRef(moment);
  momentRef.current.locale("pt-br");

  return { moment: momentRef.current, calendarDayOnlyFormats };
}
