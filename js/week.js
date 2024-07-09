if(typeof week==='undefined'){

  class week{

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

    this.appts=[];
    this.apptsHsh={};

    let dt=toInptValFrmt(Date.parse(date.getFullYear()+'-'+Number(date.getMonth()+1)+'-'+date.getDate()+' '+'00:00:00'));

    this.tmpl={};
    this.tmpl['leftNav']=[];
    this.tmpl.leftNav[0]=`
      <div class="calNav">
        <div id="calYear">
          <div name="calNavYear" class="calNavNum" contenteditable="true" oninput=wkObj.modDate() title="Current Year">`;
    this.tmpl.leftNav[1]=`
          </div>
          <div class="calNavMod">
            <div for="calNavYear" padLen=4 padChar="0" minVal=0 maxVal=99999 onclick=wkObj.modToElNum()>+</div>
            <div for="calNavYear" padLen=4 padChar="0" minVal=0 maxVal=99999 onclick="wkObj.modToElNum(false)">-</div>
          </div>
        </div>
        <div id="calMon">
          <div name="calNavMon" class="calNavNum" padLen=2 padChar="0" minVal=1 maxVal=12 contenteditable="true" title="Current Month">`;
    this.tmpl.leftNav[2]=`
          </div>
          <div class="calNavMod">
            <div for="calNavMon" onclick="wkObj.modToElNum()">+</div>
            <div for="calNavMon" onclick="wkObj.modToElNum(false)">-</div>
          </div>
        </div>
        <div id="calDay">
          <div name="calNavDay" class="calNavNum" padLen=2 padChar="0" contenteditable="true" oninput=wkObj.modDate() title="Current Day">`;
    this.tmpl.leftNav[3]=`
          </div>
          <div class="calNavMod">
            <div for="calNavDay" onclick="wkObj.modToElNum()">+</div>
            <div for="calNavDay" onclick="wkObj.modToElNum(false)">-</div>
          </div>
        </div>
        <div name="calToMon" class="menuIcon calToday" onclick=mainObj.setState('pos','cal') title="Month view">`+getEvalIcon(iconSets, state.user.config.iconSet, 'calendar' )+`</div>
        <div name="calToday" class="menuIcon calToday" onclick=wkObj.goToday() title="Set to today">`+getEvalIcon(iconSets, state.user.config.iconSet, 'today' )+`</div>
      </div>`;

    this.tmpl.rghtModForm=[];
    this.tmpl.rghtModForm[0]=`
    <div id="apptNewApptFormFull">
      <div class="lbl">Appointment</div>
      <div id="apptNewApptFormFullApptUUID">
        <input id="apptNewApptFormFullApptInfoUUID" type="hidden" />
      </div>
      <div id="apptNewApptFormFullUser">
        <div id="apptNewApptFormFullUserSlct">
            <div>
              <select id="apptNewApptFormFullUserLastName" name="contactSelect[surName]">
              </select>
              <select id="apptNewApptFormFullUserFirstName" name="contactSelect[fName]">
              </select>
              <select id="apptNewApptFormFullUserEmail" name="contactSelect[email]">
              </select>
              <select id="apptNewApptFormFullUserPhone" name="contactSelect[phone]">
              </select>
            </div>
            <div>
              <input id="apptNewApptFormFullUserAddUser" type="submit" value="Add"/>
            </div>
        </div>
        <div class="row apptFormMultiBox" style="margin-bottom:24px;">
          <div id="apptNewApptFormFullApptInfoUsrLstLbl" class="row apptFormMultiBoxLbl" title="Users For Service">
          Users
          </div>
          <div id="apptNewApptFormFullApptInfoUsrLst" class="row apptFormMultiBoxBox" title="Users List">
          </div>
        </div>
        <div id="apptNewApptFormFullByUserSlct">
            <input id="apptNewApptFormFullApptInfoOnDate" name="event[on_date]" type="datetime-local" value="${dt}"/>
            <select id="apptNewApptFormFullApptInfoByUser" name="event[byUser_id]">
              <option>By User</option>
            </select>
            <div id="apptNewApptFormFullApptInfoByUserType">stylist</div>
        </div>
        <div id="apptNewApptFormFullApptInfoSrvSlct" class="row" style="justify-content:flex-end;">
          <select id="apptNewApptFormFullApptInfoSrv" name="event[invntSrv]">
            <option>service</option>
          </select>
          <input id="apptNewApptFormFullApptInfoAddSrv" type="submit" value="Add Srv/Invnt" title="Add Inventory/Service"/>
        </div>
        <div class="row apptFormMultiBox">
          <div id="apptNewApptFormFullApptInfoSrvLstLbl" class="row apptFormMultiBoxLbl" title="Services Added">
          Services to be added
          </div>
          <div id="apptNewApptFormFullApptInfoSrvLst" class="row apptFormMultiBoxBox" title="Services Added">
          </div>
        </div>
        <div id="apptNewApptFormFullApptInfoSrvTtlDur">
          <label for="apptNewApptFormFullApptInfoDur" title="Total Duration of All Services (in minutes)" style="margin-right:8px; border-width:0px;">Duration:</label>
          <input id="apptNewApptFormFullApptInfoDur" title="in minutes" type="number" name="event[duration]" max="999" min="1" placeholder="0" style="margin-right:0px;"/>
        </div>
        <div id="apptNewApptFormFullApptStatusRow" class="row">
          <select id="apptNewApptFormFullApptStatus" name="event[status]">
            <option>status</option>
          </select>
        </div>
        <div class="row" style="margin-bottom:24px;">
          <input id="apptNewApptFormFullApptInfoUpdtBtn" style="" type="submit" value="Update Appointment"/>
        </div>
      </div>
    </div>
    `;

    this.usrAddedArr=[];
    this.appt=null;
    }

    //---------------------------------------------------
    //updates html elements with the current date
    dateUpdt(year=this.year, mon=this.mon, day=this.day){
    var yrEl=document.getElementsByName("calNavYear")[0];
    var mnEl=document.getElementsByName("calNavMon")[0];
    var dtEl=document.getElementsByName("calNavDay")[0];
    
    padVal(yrEl, year);
    padVal(mnEl, Number(mon)+1);
    padVal(dtEl, day);

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
    this.genWk(state['shwDate']['year'], state['shwDate']['mon'], state['shwDate']['day']);

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


    padVal(yrEl,dt.getFullYear());
    padVal(mnEl,dt.getMonth()+1);
    dyEl?padVal(dyEl,dt.getDate()):null;

    this.modDate(dt.getFullYear(),dt.getMonth(),dt.getDate());
    return true;
    }

    /*----------------------------------
    pre: this.rghtModForm 
    post: none
    generates right modal content
    ----------------------------------*/
    apptRghtMod(id=null){
      apptRghtModObj.popRghtMod(id);
      mainObj.modRghtOpenClose();
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
    var endDt=new Date(ptrDt.getFullYear(), ptrDt.getMonth(), ptrDt.getDate()+7);
    this.appts=selectEventDateRngUser(state.user.uuid, dtTmDbFrmt(ptrDt.toISOString()), dtTmDbFrmt(endDt.toISOString()));
    this.apptsHsh=arrOfHshToHshHsh('event_id',this.appts);
    var apptI=0;

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
        if(ptrDt.getMonth()!=today.getMonth()||ptrDt.getYear()!=today.getYear()){
        cls=' class="fade"';
        }

      let dayAppts=[];
      let ptrDtT=new Date(ptrDt.toISOString())
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
      let dayApptsStr='';
      let tmpDt='';
      let tmpNm='';
      let lastDt=null;
      let ovrlpTtl='';
        for(let apptIn in dayAppts){
        let dt=new Date(dayAppts[apptIn].on_date);
        tmpDt=dt.toLocaleTimeString();
        tmpDt=tmpDt.replace(/:[0-9]{2} /,'');

        //sets style for when appointments overlap
        let ovrlpClss="";
          if(lastDt&&lastDt>dt){
          ovrlpClss="calApptSumDtOverlap";
          ovrlpTtl='title="Appointment overlaps with previous appointment."';
          }
          else{
          ovrlpTtl='';
          }

        dt.setMinutes(dt.getMinutes()+dayAppts[apptIn].duration);
        //updates lastDt for next loop
          if(!lastDt||dt>lastDt){
          lastDt=new Date(dt.toLocaleString());
          }

        let nDt=dt.toLocaleTimeString().replace(/:[0-9]{2} /,'');
        tmpNm=dayAppts[apptIn].cust_fName;
        tmpNm=tmpNm.length>=10?tmpNm.substr(0,7)+'...':tmpNm;
        let dur=dayAppts[apptIn]?.duration||0;
        let eventId=dayAppts[apptIn].event_id;
        
        dayApptsStr+=`
        <div class="calApptSum" onclick="wkObj.apptRghtMod('${eventId}')" ${ovrlpTtl}>
          <div><div class="calApptSumDtRw ${ovrlpClss}"><div>${tmpDt}&nbsp;</div><div class="calApptSumNDt">- ${nDt}</div></div><div class="calApptSumDur" title="Appointment duration: ${dur}">${dur} min</div></div>
          <div class="calApptSumNm">${tmpNm}</div>
        </div>`;
        }
 
      rtrn+='<td id="date-'+toTimeStr(ptrDt)+'"'+tdy+cls+'><div class="dyWrap"><div>'+ptrDt.getDate()+'</div><div class="dyAppts">'+dayApptsStr+'</div></div></td>';

        //set end of week.
        if(i>=6){
        rtrn+='</tr>'+"\n";
        }

      i++;
      ptrDt.setFullYear(ptrDt.getFullYear(),ptrDt.getMonth(),ptrDt.getDate()+1);
      }

    rtrn=`
          <table id="calendarEl" class="calendarElWeek">
            <tr>
              <th class="dyOfWk">Sun</th>
              <th class="dyOfWk">Mon</th>
              <th class="dyOfWk">Tue</th>
              <th class="dyOfWk">Wed</th>
              <th class="dyOfWk">Thu</th>
              <th class="dyOfWk">Fri</th>
              <th class="dyOfWk">Sat</th>
            </tr>`+rtrn+'</table>';
    document.getElementById('mainEl').innerHTML=rtrn;
    }

    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
    }
    
    run(){
    wkObj.genWk();
    document.getElementById('leftNavMod').innerHTML=wkObj.genLeftNavWk();
    this.hookEl();
    }

  }

var wkObj=new week(state['shwDate']['year'], state['shwDate']['mon'], state['shwDate']['day']);
state.depModuleObjs['week']=wkObj;
}
