if(typeof cal==='undefined'){
  class cal{

    constructor(yr=null, mn=null, dy=null){

    var date=new Date();
    this.year=yr;
      if(!yr||yr==null){
      this.year=state['shwDate']['year']=date.getFullYear();
      }
     
    this.mon=mn; 
      if(!mn||mn==null){
      this.mon=state['shwDate']['mon']=date.getMonth();
      }
      
    this.day=dy;
      if(!dy||dy==null){
      this.day=state['shwDate']['day']=date.getDate();
      }

    this.dayOfWk=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    this.tmpl={};
    this.tmpl['leftNav']=[];
    this.tmpl.leftNav[0]='<div class="calNav"><div id="calYear"><div name="calNavYear" class="calNavNum" contenteditable="true" oninput=calObj.modDate()>';
    this.tmpl.leftNav[1]='</div><div class="calNavMod"><div for="calNavYear" padLen=4 padChar="0" minVal=0 maxVal=99999 onclick=calObj.modToElNum()>+</div><div for="calNavYear" padLen=4 padChar="0" minVal=0 maxVal=99999 onclick="calObj.modToElNum(false)">-</div></div></div><div id="calMon"><div name="calNavMon" class="calNavNum" padLen=2 padChar="0" minVal=1 maxVal=12 contenteditable="true">';
    console.log(state.user);
    this.tmpl.leftNav[2]='</div><div class="calNavMod"><div for="calNavMon" onclick="calObj.modToElNum()">+</div><div for="calNavMon" onclick="calObj.modToElNum(false)">-</div></div></div><div name="calToday" class="menuIcon calToday" onclick=calObj.goToday() title="Set to today">'+getEvalIcon(iconSets, state.user.config.iconSet, 'today')+'</div></div>';
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
    dateUpdt(year=this.year, mon=this.mon){
    var yrEl=document.getElementsByName("calNavYear")[0];
    var mnEl=document.getElementsByName("calNavMon")[0];
    
    this.padVal(yrEl, year);
    this.padVal(mnEl, Number(mon)+1);

    }

    //changes the calendar to today/this month.
    goToday(){
    let dt=new Date();
    this.modDate(dt.getFullYear(), dt.getMonth());
    
    this.dateUpdt(dt.getFullYear(), dt.getMonth()); 
    }

    /*----------------------------
    pre:  
    post: 
    ----------------------------*/ 
    modDate(year=this.year, mon=this.mon, day=this.day){
      if(state['shwDate']['year']==year && state['shwDate']['mon']==(mon) && state['shwDate']['day']==day){
      //if date is the same, no need to update.
      return false;
      }

    this.year=state['shwDate']['year']=year;
    this.mon=state['shwDate']['mon']=mon;
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
    
    
    add?num++:num--;

      //check if element being changed is the month
      //if so, see if need to inc or dec year.
      if(el.getAttribute('name')=='calNavMon'){
        let yrEl=document.getElementsByName('calNavYear')[0];
        let yrNm=yrEl.innerText;
        if(num>el.getAttribute('maxVal')){
        //increment year
        this.padVal(yrEl, parseInt(yrNm)+1);
        }
        if(num<el.getAttribute('minVal')){
        //decrement year
        this.padVal(yrEl, parseInt(yrNm)-1);
        }
      }

      this.padVal(el, num);

    let year=document.getElementsByName("calNavYear")[0].innerText;
    let mon=Number(document.getElementsByName("calNavMon")[0].innerText)-1;

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

    /*----------------------------------------------
    pre: state and mainObj.setState()
    post: state changed
    used for moving from monthly calendar to weekly calendar on click
    sets the shwDate on state and then sets the state for pos
    ----------------------------------------------*/
    setDteGoWk(yr, mn='1', dy='1'){
    state.shwDate={year: yr, mon: mn, day: dy};
    mainObj.setState('pos', 'week');
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
        rtrn+=`<td class="wkVw" onclick="calObj.setDteGoWk(`+ptrDt.getFullYear()+`, `+ptrDt.getMonth()+`, `+ptrDt.getDate()+`)"><div>🞂</div></td></tr>`+"\n";
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

var calObj=new cal(state['shwDate']['year'], state['shwDate']['mon'], state['shwDate']['day']);
document.getElementById('mainEl').innerHTML=calObj.genCal();
document.getElementById('leftNavMod').innerHTML=calObj.genLeftNavCal();
}

