export class AppService {
  constructor() {}

  getDateWithUTCOffset(){
    const now = new Date(); // get the current time
    const deltaTzOffset = -now.getTimezoneOffset() / 60; // timezone diff
    const nowTimestamp = now.getTime(); // get the number of milliseconds since unix epoch
    const deltaTzOffsetMilli = deltaTzOffset * 1000 * 60 * 60; // convert hours to milliseconds (tzOffsetMilli*1000*60*60)
    const outputDate = new Date(nowTimestamp + deltaTzOffsetMilli) // your new Date object with the timezone offset applied.

    return outputDate.toISOString().slice(0,19).replace("T", " ");
  }
}
