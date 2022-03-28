class cal{

  constructor(yr=null, mn=null, dy=null){

  var date=new Date();
  this.year=yr;
    if(!yr||yr==null){
    this.year=date.getFullYear();
    }
   
  this.mon=mn; 
    if(!mn||mn==null){
    this.mon=date.getMonth();
    }
    
  this.day=dy;
    if(!dy||dy==null){
    this.day=date.getDate();
    }



  this.dayOfWk=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  this.calEl=` 
        <table id="calendarEl">
          <tr>
            <th class="dyOfWk">Sun</th>
            <th class="dyOfWk">Mon</th>
            <th class="dyOfWk">Tue</th>
            <th class="dyOfWk">Wed</th>
            <th class="dyOfWk">Thu</th>
            <th class="dyOfWk">Fri</th>
            <th class="dyOfWk">Sat</th>
            <th class="wkVw">&nbsp;</th>
          </tr>
        </table>
  `;

  this.tmpl={};
  this.tmpl['leftNav']=[];
  this.tmpl.leftNav[0]='<div class="calNav"><div id="calYear"><div name="calNavYear" class="calNavNum" contenteditable="true" oninput=calObj.modDate()>';
  this.tmpl.leftNav[1]='</div><div class="calNavMod"><div for="calNavYear" padLen=4 padChar="0" minVal=0 maxVal=99999 onclick=calObj.modToElNum()>+</div><div for="calNavYear" padLen=4 padChar="0" minVal=0 maxVal=99999 onclick="calObj.modToElNum(false)">-</div></div></div><div id="calMon"><div name="calNavMon" class="calNavNum" contenteditable="true">';
  this.tmpl.leftNav[2]='</div><div name="calNavMon" class="calNavMod"><div for="calNavMon" padLen=2 padChar="0" minVal=1 maxVal=12 onclick="calObj.modToElNum()">+</div><div for="calNavMon" padLen=2 padChar="0" minVal=1 maxVal=12 onclick="calObj.modToElNum(false)">-</div></div></div><div name="calToday" class="calToday" onclick=goToday()>Today</div></div>';
  }


  //date object. returns epoch time
  epochTime(date){
  var epch=Date.parse(date.toISOString())/1000;
  return Math.floor(epch);
  }

  //outputs yyyymmdd, ex 20220201
  toTimeStr(date){
  var rtrn=String(date.getFullYear());
  rtrn+=String(date.getMonth()).padStart(2, '0');
  rtrn+=String(date.getDate()).padStart(2, '0');
  return rtrn;
  }

  /*----------------------------
  pre:  
  post: 
  ----------------------------*/ 
  modDate( year=this.year, mon=this.mon, day=this.day){
    if(state['shwDate']['year']==year && state['shwDate']['mon']==(mon-1) && state['shwDate']['day']==day){
    //if date is the same, no need to update.
    return false;
    }

  this.year=state['shwDate']['year']=year;
  this.mon=state['shwDate']['mon']=(mon-1);
  this.day=state['shwDate']['day']=day;
  document.getElementById('mainEl').innerHTML=this.genCal(state['shwDate']['year'], state['shwDate']['mon'], state['shwDate']['day']);

  return true;
  }

  /*----------------------------
  pre: onclick attached to this function. global event variable. The element has "for" attribute
  post: modifies the element named in "for" attribute
  finds the number in the named element and increment.
  optional attributes: padLen, padChar, minVal, maxVal
  ----------------------------*/ 
  modToElNum(add=true){
    if(!event || !"target" in event || !event.target.hasAttribute("for")){
    return false;
    }
  
  var el=document.getElementsByName(event.target.getAttribute("for"))[0];
  let num=Number(el.innerText);
    if(isNaN(num)){
    return false;
    }

  let min=event.target.getAttribute("minVal");
  let max=event.target.getAttribute("maxVal");
  let len=event.target.getAttribute("padLen");
  let chr=event.target.getAttribute("padChar");

  add?num++:num--;
    if(min&&max){
      if(num<min){
      num=max;
      }
      if(num>max){
      num=min;
      }
    }
  
    if(len&&chr){
    num=String(num).padStart(len, chr);
    }

  el.innerText=num;

    let year=document.getElementsByName("calNavYear")[0].innerText;
    let mon=document.getElementsByName("calNavMon")[0].innerText;
  this.modDate(year, mon);
  return true;
  }

  /*-----------------------------------------------
  pre: none
  post: generates leftNav Element
  generates HTML of leftNav element for calendar
  -----------------------------------------------*/
  genLeftNavCal(year=this.year, mon=this.mon){
    
    var rtrn="";
    rtrn=this.tmpl.leftNav[0]+year+this.tmpl.leftNav[1]+padDate(mon+1)+this.tmpl.leftNav[2];
  return rtrn;
  }

  /*-----------------------------------------------
  pre: none
  post: element of id (calendar element) drawn
  draws calendar of month and year on element of id
  params: id=calender element id, yr=year (ex. 2022), mn=month (0~11), dy=day of month(1~31)
  -----------------------------------------------*/
  genCal(year=this.year, mon=this.mon, day=this.day){

  //get where to start building calendar. This could be last month if it's in the week
  var ptrDt=new Date(year, mon, 1);
  var today=new Date();
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
      if(curDy==today.getDate()&&ptrDt.getMonth()==today.getMonth()&&ptrDt.getFullYear()==today.getFullYear()){
      tdy=' name="today"';
      }
      //set fade days outside the current month to fade
      let cls="";
      if(ptrDt.getMonth()!=mon){
      cls=' class="fade"';
      }
    
    rtrn+='<td id="date-'+this.toTimeStr(ptrDt)+'"'+tdy+cls+'><div>'+ptrDt.getDate()+'</div><div></div></td>';

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

  rtrn=`
        <table id="calendarEl">
          <tr>
            <th class="dyOfWk">Sun</th>
            <th class="dyOfWk">Mon</th>
            <th class="dyOfWk">Tue</th>
            <th class="dyOfWk">Wed</th>
            <th class="dyOfWk">Thu</th>
            <th class="dyOfWk">Fri</th>
            <th class="dyOfWk">Sat</th>
            <th class="wkVw">&nbsp;</th>
          </tr>`+rtrn+'</table>';
  return rtrn;
  }

  
}

var calObj=new cal();
document.getElementById('mainEl').innerHTML=calObj.genCal();
document.getElementById('leftNavMod').innerHTML=calObj.genLeftNavCal();

