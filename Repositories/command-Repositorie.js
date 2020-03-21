const { toDate, utcToZonedTime, zonedTimeToUtc } = require("date-fns-tz");
const {
  parseISO,
  format,
  formatRelative,
  formatDistance
} = require("date-fns");

exports.statusBal = (status,peri) => {
    if (status.length == 1) {
      if (status[0].period == peri) {
        return true;
      }    
    } else {
      if (status.length == 0) {
        return false;
      } else {
        if (status[0].period == peri || status[1].period == peri) {
        return true;
        }
      }
    }
}

exports.homeDate = (utc) => {
  const utcDate = toDate(utc, { timeZone: "UTC" });
  const zonedDate = utcToZonedTime(utcDate, "America/Sao_Paulo");
  return formattedDate = format(zonedDate, "dd-MM-yyyy", {
    timeZone: "America/Sao_Paulo"
  });
}

exports.prox = (page) => {    
    if (page === undefined ) {
    return 2;
    }else{
    	return  prox = parseInt(page) + 1;	
    }
} 
exports.next = (total,page,pages) =>{
        if (total <= 4) {
         return next = false;
        } else {
          if (parseInt(page) != parseInt(pages)) {
          return  next = true;
          } else {
          return  next = false;
        }
    }
}
