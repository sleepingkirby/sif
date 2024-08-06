function dtFlNm(dateTime=null){
let dt=new Date();
  if(Number.isFinite(dateTime)){
  dt=new Date(dateTime);
  }
const dateStr=dt.getFullYear().toString()+(dt.getMonth()+1).toString().padStart(2,'0')+dt.getDate().toString().padStart(2,'0');
const timeStr=dt.getHours().toString().padStart(2,'0')+dt.getMinutes().toString().padStart(2,'0')+dt.getSeconds().toString().padStart(2,'0');
return dateStr+'-'+timeStr; 
}

//date time database format
//2023-11-09 09:17:43
function dtTmDbFrmt(dateTime=null, flip=false){
let dt=new Date();
  if(Number.isFinite(dateTime)){
  dt=new Date(dateTime);
  }
  else if(typeof dateTime=="string" || typeof dateTime=="object"){
  dt=new Date(dateTime);
  }
const dateStr=dt.getFullYear().toString()+'-'+(dt.getMonth()+1).toString().padStart(2,'0')+'-'+dt.getDate().toString().padStart(2,'0');
const timeStr=dt.getHours().toString().padStart(2,'0')+':'+dt.getMinutes().toString().padStart(2,'0')+':'+dt.getSeconds().toString().padStart(2,'0');
  if(flip){
  return timeStr+' '+dateStr;
  }
return dateStr+' '+timeStr; 
}

function dateOnly(dateTime=null){
let dt=new Date();
  if(dateTime){
  dt=new Date(dateTime);
  }

return dt.getFullYear().toString()+'-'+(dt.getMonth()+1).toString().padStart(2,'0')+'-'+dt.getDate().toString().padStart(2,'0');
}

function timeOnly(dateTime=null, sec=false){
let dt=new Date();
  if(dateTime){
  dt=new Date(dateTime);
  }
  let t=dt.toLocaleTimeString();
    if(!sec){
    t=t.replace(/:[0-9]{2} /, ' ');
    }
    else if(sec=='nospace'){
    t=t.replace(/:[0-9]{2} /, '');
    }

return t; 
}



function epochTime(date){
const epch=Date.parse(date.toISOString())/1000;
return Math.floor(epch);
}

//outputs yyyymmdd, ex 20220201
function toTimeStr(date){
let rtrn=String(date.getFullYear());
rtrn+=String(date.getMonth()).padStart(2, '0');
rtrn+=String(date.getDate()).padStart(2, '0');
return rtrn;
}

function toInptValFrmt(dateTime=null){
let dt=new Date();
  if(Number.isFinite(dateTime)){
  dt=new Date(dateTime);
  }

let dateStr=dt.getFullYear().toString()+"-"+(dt.getMonth()+1).toString().padStart(2,'0')+"-"+dt.getDate().toString().padStart(2,'0');
let timeStr=dt.getHours().toString().padStart(2,'0')+":"+dt.getMinutes().toString().padStart(2,'0');
return dateStr+"T"+timeStr;
}


//convert string of hh:mm to pure hours.
function shiftTimeSplits(str=null, dt=null){
let dateObj=dt||new Date();

let hr=dateObj.getHours();
let min=dateObj.getMinutes();
  if(str){
  let split=str.split(':');
  hr=Number(split[0]);
  min=Number(split[1]);
  dateObj.setHours(hr);
  dateObj.setMinutes(min);
  }

const obj={
'mins': (hr+60)+min,
'hr':hr,
'min':min,
'dt':dateObj,
'epoch':epochTime(dateObj)
};
return obj;
}
