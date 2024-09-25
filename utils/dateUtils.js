// utils/dateUtils.js

import { format } from 'date-fns'

export const getFormattedDate = (date = new Date()) => {
  return format(date, 'yyyy-MM-dd')
}
