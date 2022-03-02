var dayOfWk=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
 
date=new Date(year, mon, day);
var ptrDt=new Date(year, mon, 1);
var dyWk=ptrDt.getDay();
var i=0;
var curDy=1;
var rtrnwk="";
var rtrn="";
var end=false;
  while(ptrDt.getMonth()==mon||!end){
  console.log("=======>>"+i+"%7="+(i%7));
    if(i%7<=0){
    rtrn+="<tr>";
    }

  let tdy="";
  let n="";
    //if need to advance date.
    //if this date is today
    if(i>=dyWk&&!end){
    dyWk=0;
    n=ptrDt.getDate();
    curDy++;
      if(curDy==day){
      tdy=' name="today"';
      }
    console.log(ptrDt.getDate());
    }

  rtrn+='<td'+tdy+'><div>'+n+'</div><div></div></td>';
    if(i%7>=6){
    rtrn+='<td class="wkVw"><div>🞂</div></td></tr>'+"\n";
      if(ptrDt.getMonth()!=mon){
      end=true;
      }
    }

  i=(i+1)%7;
  ptrDt.setFullYear(2022,mon,curDy);
  }
console.log(ptrDt);
console.log(rtrn);
return rtrn;
}

