import dayjs from 'dayjs'

import utc from "dayjs/plugin/utc"
// import utc from 'dayjs/plugin/utc' // ES 2015

import timezone from "dayjs/plugin/timezone" // dependent on utc plugin
// import timezone from 'dayjs/plugin/timezone' // ES 2015

dayjs.extend(utc);
dayjs.extend(timezone);

const tz = "Asia/Jakarta"

export function formatWIB(date) {
  return dayjs(date).tz(tz).format('ddd, DD MMMM YYYY HH:mm:ss') + " WIB"
}

export function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}