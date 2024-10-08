if(typeof cal==='undefined'){
  class cal{

    constructor(yr=null, mn=null, dy=null){

    const date=new Date();
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

    this.appts=[];

    this.tmpl={};
    this.tmpl['leftNav']=[];
    this.tmpl.leftNav[0]='<div class="calNav"><div id="calYear"><div name="calNavYear" class="calNavNum" contenteditable="true" oninput=calObj.modDate() title="Current Year">';
    this.tmpl.leftNav[1]='</div><div class="calNavMod"><div for="calNavYear" padLen=4 padChar="0" minVal=0 maxVal=99999 onclick=calObj.modToElNum()>+</div><div for="calNavYear" padLen=4 padChar="0" minVal=0 maxVal=99999 onclick="calObj.modToElNum(false)">-</div></div></div><div id="calMon"><div name="calNavMon" class="calNavNum" padLen=2 padChar="0" minVal=1 maxVal=12 contenteditable="true" title="Current Month">';
    this.tmpl.leftNav[2]='</div><div class="calNavMod"><div for="calNavMon" onclick="calObj.modToElNum()">+</div><div for="calNavMon" onclick="calObj.modToElNum(false)">-</div></div></div><div name="calToday" class="menuIcon calToday" onclick=calObj.goToday() title="Set to today">'+getEvalIcon(iconSets, state.user.config.iconSet, 'today')+'</div></div>';
    }

    //---------------------------------------------------
    //updates html elements with the current date
    dateUpdt(year=this.year, mon=this.mon){
    const yrEl=document.getElementsByName("calNavYear")[0];
    const mnEl=document.getElementsByName("calNavMon")[0];
    
    padVal(yrEl, year);
    padVal(mnEl, Number(mon)+1);

    }

    //changes the calendar to today/this month.
    goToday(){
    const dt=new Date();
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
    
    const el=document.getElementsByName(event.target.getAttribute("for"))[0];
    let num=Number(el.innerText);
      if(isNaN(num)){
      return false;
      }
    
    
    add?num++:num--;

      //check if element being changed is the month
      //if so, see if need to inc or dec year.
      if(el.getAttribute('name')=='calNavMon'){
        const yrEl=document.getElementsByName('calNavYear')[0];
        const yrNm=yrEl.innerText;
        if(num>el.getAttribute('maxVal')){
        //increment year
        padVal(yrEl, parseInt(yrNm)+1);
        }
        if(num<el.getAttribute('minVal')){
        //decrement year
        padVal(yrEl, parseInt(yrNm)-1);
        }
      }

      padVal(el, num);

    const year=document.getElementsByName("calNavYear")[0].innerText;
    const mon=Number(document.getElementsByName("calNavMon")[0].innerText)-1;

    this.modDate(year, mon);
    return true;
    }

    /*-----------------------------------------------
    pre: none
    post: generates leftNav Element
    generates HTML of leftNav element for calendar
    -----------------------------------------------*/
    genLeftNavCal(year=this.year, mon=this.mon){
    const rtrn=this.tmpl.leftNav[0]+year+this.tmpl.leftNav[1]+padDate(mon+1)+this.tmpl.leftNav[2];
    return rtrn;
    }

    /*----------------------------------------------
    pre: state and mainObj.setState()
    post: state changed
    used for moving from monthly calendar to weekly calendar on click
    sets the shwDate on state and then sets the state for pos
    ----------------------------------------------*/
    setDteGoWk(yr, mn='0', dy='1'){
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
    const ptrDt=new Date(year, mon, 1);
    const today=new Date();
    let curDy=(1 - ptrDt.getDay())%7;
    ptrDt.setFullYear(year, mon, curDy);
    let rtrn="";
    let end=false;
    let i=0; //thnis always starts as 0 because we're always starting on a sunday.
    const endDt=new Date(year, mon+1, 0);
    endDt.setFullYear(endDt.getFullYear(), endDt.getMonth(), endDt.getDate()+(7-endDt.getDay()));//last day of calendar +1 day
    this.appts=selectEventDateRngUser(state.user.uuid, dtTmDbFrmt(ptrDt.toISOString()), dtTmDbFrmt(endDt.toISOString()));
    let apptI=0;

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
      
      const dayAppts=[];
      const ptrDtT=new Date(ptrDt.toISOString())
      ptrDtT.setDate(ptrDtT.getDate()+1)
        while(apptI<this.appts.length){
          //if appointment exists and on_date for said appointment is valid and it's within the day in question
          if(this.appts[apptI].hasOwnProperty('on_date') && this.appts[apptI].on_date && Date.parse(this.appts[apptI].on_date)>=Date.parse(ptrDt) && Date.parse(this.appts[apptI].on_date)<Date.parse(ptrDtT)){
          dayAppts.push(this.appts[apptI]);
          }
          else if(Date.parse(this.appts[apptI].on_date)>=Date.parse(ptrDtT)){
          break;
          }
        apptI++;
        }
      let dayNum=dayAppts.length>0?'<div class="calApptNum" title="Number of appointsments today: '+dayAppts.length+'">'+dayAppts.length+'</div>':'';
      let dayApptsStr='';
      let tmpDt='';
      let tmpNm='';
        for(const apptIn in dayAppts){
          if(apptIn>1){
          dayApptsStr+='<div>...</div>';
          break;
          }
          //tmpDt=new Date(dayAppts[apptIn].on_date).toLocaleTimeString();
          //tmpDt=tmpDt.replace(/:[0-9]{2} /,'');
          tmpDt=timeOnly(dayAppts[apptIn].on_date,'nospace');
          tmpNm=dayAppts[apptIn].cust_fName;
          tmpNm=tmpNm.length>=8?tmpNm.substr(0,5)+'...':tmpNm;
          dayApptsStr+='<div class="calApptSum"><div>'+tmpDt+'</div><div>'+tmpNm+'</div></div>';
        }
      rtrn+='<td id="date-'+toTimeStr(ptrDt)+'"'+tdy+cls+'><div><div>'+ptrDt.getDate()+'</div><div class="calAppts">'+dayNum+dayApptsStr+'</div></div></td>';

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

    // run main function
    run(){
    document.getElementById('mainEl').innerHTML=this.genCal();
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavCal();
    //eventsLib.selectEventDateRngUser(state.user.uuid,)
    }
  }

var calObj=new cal(state['shwDate']['year'], state['shwDate']['mon'], state['shwDate']['day']);
state.depModuleObjs['cal']=calObj;
}

