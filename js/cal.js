var dayOfWk=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//date object. returns epoch time
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

/*-----------------------------------------------
pre: none
post: element of id (calendar element) drawn
draws calendar of month and year on element of id
params: id=calender element id, yr=year (ex. 2022), mn=month (0~11), dy=day of month(1~31)
-----------------------------------------------*/
function drawCal(id, yr, mn, dy){
  if(!id||id==null||id==""){
  return null;
  }
  
var date=new Date();
var year=yr;
  if(!year||year==null){
  year=date.getFullYear();
  }
 
var mon=mn; 
  if(!mn||mn==null){
  mn=date.getMonth();
  }
  
var day=dy;
  if(!dy||dy==null){
  dy=date.getDate();
  }

//get where to start building calendar. This could be last month if it's in the week
var ptrDt=new Date(year, mon, 1);
var curDy=(1 - ptrDt.getDay())%7;
ptrDt.setFullYear(year, mon, curDy);
var rtrn="";
var end=false;
var i=0; //thnis always starts as 0 because we're always starting on a sunday.

  while(!end){
    //if start of week.
    if(i%7<=0){
    rtrn+="<tr>";
    }

    //set day
    let tdy="";
    if(curDy==day&&ptrDt.getMonth()==mon){
    tdy=' name="today"';
    }
    //set fade days outside the current month to fade
    let cls="";
    if(ptrDt.getMonth()!=mon){
    cls=' class="fade"';
    }
  rtrn+='<td id="date-'+toTimeStr(ptrDt)+'"'+tdy+cls+'><div>'+ptrDt.getDate()+'</div><div></div></td>';

    //set end of week.
    if(i%7>=6){
    rtrn+='<td class="wkVw"><div>🞂</div></td></tr>'+"\n";
      if(ptrDt.getMonth()!=mon){
      end=true;
      }
    }

  curDy++;
  ptrDt.setFullYear(year,mon,curDy);
  i=ptrDt.getDay();
  }
return rtrn;
}

