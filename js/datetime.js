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
  else if(typeof dateTime=="string"){
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


//convert string of hh:mm to pure hours.
function shiftTimeSplits(str=null, dt=null){
let dateObj=dt||new Date();
dateObj.setHours(hr);
dateObj.setMinutes(min);


let hr=dateObj.getHours();
let min=dateObj.getMinutes();
  if(str){
  let split=str.split(':');
  hr=Number(split[0]);
  min=Number(split[1]);
  dateObj.setHours(hr);
  dateObj.setMinutes(min);
  }

let obj={
'mins': (hr+60)+min,
'hr':hr,
'min':min,
'dt':dateObj,
'epoch':epochTime(dateObj)
};
return obj;
}
