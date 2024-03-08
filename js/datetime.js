function dtFlNm(dateTime=null){
var dt=new Date();
  if(Number.isFinite(dateTime)){
  dt=new Date(dateTime);
  }
var dateStr=dt.getFullYear().toString()+(dt.getMonth()+1).toString().padStart(2,'0')+dt.getDate().toString().padStart(2,'0');
var timeStr=dt.getHours().toString().padStart(2,'0')+dt.getMinutes().toString().padStart(2,'0')+dt.getSeconds().toString().padStart(2,'0');
return dateStr+'-'+timeStr; 
}

//date time database format
//2023-11-09 09:17:43
function dtTmDbFrmt(dateTime=null){
var dt=new Date();
  if(Number.isFinite(dateTime)){
  dt=new Date(dateTime);
  }
var dateStr=dt.getFullYear().toString()+'-'+(dt.getMonth()+1).toString().padStart(2,'0')+'-'+dt.getDate().toString().padStart(2,'0');
var timeStr=dt.getHours().toString().padStart(2,'0')+':'+dt.getMinutes().toString().padStart(2,'0')+':'+dt.getSeconds().toString().padStart(2,'0');
return dateStr+' '+timeStr; 
}


function epochTime(date){
var epch=Date.parse(date.toISOString())/1000;
return Math.floor(epch);
}

//outputs yyyymmdd, ex 20220201
function toTimeStr(date){
var rtrn=String(date.getFullYear());
rtrn+=String(date.getMonth()).padStart(2, '0');
rtrn+=String(date.getDate()).padStart(2, '0');
return rtrn;
}

function toInptValFrmt(dateTime=null){
var dt=new Date();
  if(Number.isFinite(dateTime)){
  dt=new Date(dateTime);
  }

var dateStr=dt.getFullYear().toString()+"-"+(dt.getMonth()+1).toString().padStart(2,'0')+"-"+dt.getDate().toString().padStart(2,'0');
var timeStr=dt.getHours().toString().padStart(2,'0')+":"+dt.getMinutes().toString().padStart(2,'0');
return dateStr+"T"+timeStr;
}
