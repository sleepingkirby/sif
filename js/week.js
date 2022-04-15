class week{

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
          </tr>
        </table>
  `;

  this.tmpl={};
  this.tmpl['leftNav']=[];
  this.tmpl.leftNav[0]=`
    <div class="calNav">
      <div id="calYear">
        <div name="calNavYear" class="calNavNum" contenteditable="true" oninput=wkObj.modDate()>`;
  this.tmpl.leftNav[1]=`
        </div>
        <div class="calNavMod">
          <div for="calNavYear" padLen=4 padChar="0" minVal=0 maxVal=99999 onclick=wkObj.modToElNum()>+</div>
          <div for="calNavYear" padLen=4 padChar="0" minVal=0 maxVal=99999 onclick="wkObj.modToElNum(false)">-</div>
        </div>
      </div>
      <div id="calMon">
        <div name="calNavMon" class="calNavNum" padLen=2 padChar="0" minVal=1 maxVal=12 contenteditable="true">`;
  this.tmpl.leftNav[2]=`
        </div>
        <div class="calNavMod">
          <div for="calNavMon" onclick="wkObj.modToElNum()">+</div>
          <div for="calNavMon" onclick="wkObj.modToElNum(false)">-</div>
        </div>
      </div>
      <div id="calDay">
        <div name="calNavDay" class="calNavNum" padLen=2 padChar="0" contenteditable="true" oninput=wkObj.modDate()>`;
  this.tmpl.leftNav[3]=`
        </div>
        <div class="calNavMod">
          <div for="calNavDay" onclick="wkObj.modToElNum()">+</div>
          <div for="calNavDay" onclick="wkObj.modToElNum(false)">-</div>
        </div>
      </div>
      <div name="calToday" class="calToday" onclick=wkObj.goToday()>T</div>
    </div>`;
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

  //----------------------------
  //determines whether or not the element wants padding
  padVal(el, val){
  let v=val;

  let min=el.getAttribute("minVal");
  let max=el.getAttribute("maxVal");
  let len=el.getAttribute("padLen");
  let chr=el.getAttribute("padChar");

    if(min&&max){
      if(v<min){
      v=max;
      }
      if(v>max){
      v=min;
      }
    }

    if(len&&chr){
    v=String(v).padStart(len, chr);
    }

  el.innerText=v;
  }

  //---------------------------------------------------
  //updates html elements with the current date
  dateUpdt(year=this.year, mon=this.mon, day=this.day){
  var yrEl=document.getElementsByName("calNavYear")[0];
  var mnEl=document.getElementsByName("calNavMon")[0];
  var dtEl=document.getElementsByName("calNavDay")[0];
  
  this.padVal(yrEl, year);
  this.padVal(mnEl, Number(mon)+1);
  this.padVal(dtEl, day);

  }

  //changes the calendar to today/this month.
  goToday(){
  let dt=new Date();
  
  this.modDate(dt.getFullYear(), dt.getMonth(), dt.getDate());
  this.dateUpdt(dt.getFullYear(), dt.getMonth(), dt.getDate()); 
  }

  /*----------------------------
  pre:  
  post: 
  ----------------------------*/ 
  modDate( year=this.year, mon=this.mon, day=this.day){
    if(state['shwDate']['year']==year && state['shwDate']['mon']==mon && state['shwDate']['day']==day){
    //if date is the same, no need to update.
    return false;
    }

  this.year=state['shwDate']['year']=year;
  this.mon=state['shwDate']['mon']=mon;
  this.day=state['shwDate']['day']=day;
  document.getElementById('mainEl').innerHTML=this.genWk(state['shwDate']['year'], state['shwDate']['mon'], state['shwDate']['day']);

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
  var forId=event.target.getAttribute("for");
  var el=document.getElementsByName(forId)[0];
  let num=Number(el.innerText);
    if(isNaN(num)){
    return false;
    }
 
  var yrEl=document.getElementsByName('calNavYear')[0];
  var mnEl=document.getElementsByName('calNavMon')[0];
  var dyEl=document.getElementsByName('calNavDay').length>=1?document.getElementsByName('calNavDay')[0]:null;
 
 
  var dt=new Date(yrEl.innerText,Number(mnEl.innerText)-1,dyEl?dyEl.innerText:this.day);

  add?num++:num--;

    switch(forId){
      case "calNavDay":
      dt.setDate(num);
      break;
      case "calNavMon":
      dt.setMonth(num-1);
      break;
      case "calNavYear":
      dt.setFullYear(num);
      break;
      default:
      break;
    }


  this.padVal(yrEl,dt.getFullYear());
  this.padVal(mnEl,dt.getMonth()+1);
  dyEl?this.padVal(dyEl,dt.getDate()):null;

  this.modDate(dt.getFullYear(),dt.getMonth(),dt.getDate());
  return true;
  }

  /*-----------------------------------------------
  pre: none
  post: generates leftNav Element
  generates HTML of leftNav element for calendar
  -----------------------------------------------*/
  genLeftNavWk(year=this.year, mon=this.mon, day=this.day){
    
    var rtrn="";
    rtrn=this.tmpl.leftNav[0]+year+this.tmpl.leftNav[1]+padDate(mon+1)+this.tmpl.leftNav[2]+padDate(day)+this.tmpl.leftNav[3];
  return rtrn;
  }



  /*-----------------------------------------------
  pre: none
  post: element of id (calendar element) drawn
  draws calendar of month and year on element of id
  params: id=calender element id, yr=year (ex. 2022), mn=month (0~11), dy=day of month(1~31)
  -----------------------------------------------*/
  genWk(year=this.year, mon=this.mon, day=this.day){

  //get where to start building calendar. This could be last month if it's in the week
  var ptrDt=new Date(year, mon, day);
  
  var today=new Date();
  ptrDt.setDate(ptrDt.getDate()-ptrDt.getDay());
  var i=0;
  var rtrn="";

    while(i<7){
      //if start of week.
      if(i<=0){
      rtrn+="<tr>";
      }

      //set today
      let tdy="";
      if(ptrDt.getDate()==today.getDate()&&ptrDt.getMonth()==today.getMonth()&&ptrDt.getFullYear()==today.getFullYear()){
      tdy=' name="today"';
      }
      //set fade days outside the current month to fade
      let cls="";
      if(ptrDt.getMonth()!=today.getMonth()){
      cls=' class="fade"';
      }
    
    rtrn+='<td id="date-'+this.toTimeStr(ptrDt)+'"'+tdy+cls+'><div>'+ptrDt.getDate()+'</div><div></div></td>';

      //set end of week.
      if(i>=6){
      rtrn+='</tr>'+"\n";
      }

    i++;
    ptrDt.setFullYear(ptrDt.getFullYear(),ptrDt.getMonth(),ptrDt.getDate()+1);
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
          </tr>`+rtrn+'</table>';
  return rtrn;


  return "<div>testing</div>";
  }
  

}

var wkObj=new week();
document.getElementById('mainEl').innerHTML=wkObj.genWk();
document.getElementById('leftNavMod').innerHTML=wkObj.genLeftNavWk();
