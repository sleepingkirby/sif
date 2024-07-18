if(typeof home==='undefined'){
  /*-------------------------------------------
  pre: state variable, invcsRghtModObj
  post: html changed, db updated
  class for the main page that people will live for most the day
  -------------------------------------------*/
  class home{

    constructor(){
      this.today=new Date();
      this.lftNavHead=`
      <div class="homeClockWrap">
        <div id="homeCalYear" class="calNav">
          <div name="homeCalYear" class="calNavNum" padLen=4 padChar="0" minVal=1 contenteditable="true" title="Current Year">
          Year
          </div>
          <div class="calNavMod">
            <div for="homeCalYear" onclick=homeObj.modToElNum(true)>+</div>
            <div for="homeCalYear" onclick=homeObj.modToElNum(false)>-</div>
          </div>
        </div>
        <div id="homeCalMon" class="calNav">
          <div name="homeCalMon" class="calNavNum" padLen=2 padChar="0" minVal=1 maxVal=12 contenteditable="true" title="Current Month">
          Mon
          </div>
          <div class="calNavMod">
            <div for="homeCalMon" onclick=homeObj.modToElNum(true)>+</div>
            <div for="homeCalMon" onclick=homeObj.modToElNum(false)>-</div>
          </div>
        </div>
        <div id="homeCalDay" class="calNav">
          <div name="homeCalDay" class="calNavNum" padLen=2 padChar="0" minVal=1 maxVal=31 contenteditable="true" title="Current Day">
          Day
          </div>
          <div class="calNavMod">
            <div for="homeCalDay" onclick=homeObj.modToElNum(true)>+</div>
            <div for="homeCalDay" onclick=homeObj.modToElNum(false)>-</div>
          </div>
        </div>
        <div class="calNav" style="margin-right:0px;">
          <div name="homeCalHr" class="calNavNum" padLen=2 padChar="0" minVal=00 maxVal=23 contenteditable="true" title="Current Hour">
          Hour
          </div>
          <div class="calNavMod">
            <div for="homeCalHr" onclick=homeObj.modToElNum(true)>+</div>
            <div for="homeCalHr" onclick=homeObj.modToElNum(false)>-</div>
          </div>
          <div class="calNavNum" style="border-width:0px; padding:0px; margin:0px 0px 0px 5px;">:</div>
          <div name="homeCalMin" padLen=2 padChar="0" minVal=0 maxVal=59 class="calNavNum" style="border-width:0px;">Mn</div>
        </div>
        <div class="calNav" style="margin-left:0px; margin-right:0px;">
          <div name="calToday" class="menuIcon" onclick=homeObj.goToday() style="margin:0px;" title="Set to today">${getEvalIcon(iconSets, state.user.config.iconSet, 'today')}</div>
        </div>
      </div>
      `;
      this.rghtModForm=``;
      this.mainElHtml=`
      <div class="homeMain">
        <div class="homeMainFltr fltrRow" style="justify-content:center;">
          <div>
            <div class="fltrRowCellLbl">
            Status Filter
            </div>
            <select name="homeMainFltrSlct" class="fltrSlct">
              <option>none</option>
            </select>
          </div>
        </div>

        <div id="homeMainAppts" class="homeMainAppts">
          <div class="">appoints</div>
        </div>
      </div>
      `;
      this.timerObj=null;//object that stores the interval timer
      this.statuses=null;
      this.sttsHsh=null;
      this.appts=null;
      this.editted=false;
      this.destruct=this.destructor;
    }


    /*---------------------------------
    pre: this.destruct
    post: stops setInterval() 
    destructor to run closing any streams when changing modules.
    ---------------------------------*/
    destructor(){
    clearTimeout(this.timerObj);
    }
   

    /*---------------------------------
    pre: functions one wants to put in here 
    post: whatever these functions do.
    Any and all functions that you want to run every x interval, put in here
    whether that be updating a clock, changing the events to be displayed, etc.
    ---------------------------------*/
    runOnInterval(e){
    console.log("<----------runOnInterval()");
    console.log(homeObj.editted);
    //update clock 
      if(homeObj.editted){
      return null;
      }
    let now=new Date();
    let nowHr=Number(now.getHours());
    let nowMin=Number(now.getMinutes());
    let hr=document.getElementsByName("homeCalHr")[0];
      if(hr){
      padVal(hr,nowHr);
      }
    let min=document.getElementsByName("homeCalMin")[0];
      if(min){
      padVal(min,nowMin);
      }

    //update date
    let day=document.getElementsByName("homeCalDay")[0];

    //Checks if the displayed time is yesterday. If so, check if need to update time when reaches midnight...-ish
      if(Number(day.innerText)!=now.getDate()){
      //if the clockInterval is more than a minute
      //should not be able to go beyond one hour 
        if(state.user.config.clockInterval==3600000
        &&nowHr==0){
        homeObj.updtToday(now.getFullYear(),now.getMonth(),now.getDate());
        }
        else if(state.user.config.clockInterval<3600000
        &&state.user.config.clockInterval>60000
        &&nowHr==0
        &&nowMin>=0
        &&nowMin<=Math.floor(state.user.config.clockInterval/60000)
        ){
        homeObj.updtToday(now.getFullYear(),now.getMonth(),now.getDate());
        }
        else if(state.user.config.clockInterval<=60000
        &&state.user.config.clockInterval>=1000
        &&nowHr==0
        &&nowMin==0
        &&now.getSeconds()>=0
        &&now.getSeconds()<=Math.floor(state.user.config.clockInterval/1000)
        ){
        homeObj.updtToday(now.getFullYear(),now.getMonth(),now.getDate());
        }
      }
    //update events
    homeObj.drawApptsCard();
    //update which events to highlight
    //scroll to current event
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    //el[49].scrollIntoView({'behavior':"smooth","block":"center", "inline":"center"}); 
    }
  

    /*----------------------------------
    pre:
    post:
    update this.today and GUI
    ----------------------------------*/
    updtToday(yr=null, mn=null, dt=null, hr=null){
      if(yr&&mn&&dt&&hr){
      this.today.setFullYear(yr);
      this.today.setMonth(mn);
      this.today.setDate(dt);
      this.today.setHours(hr);
      }
    let year=document.getElementsByName("homeCalYear")[0];
    let mon=document.getElementsByName("homeCalMon")[0];
    let day=document.getElementsByName("homeCalDay")[0];
    let hour=document.getElementsByName("homeCalHr")[0];
    padVal(year, Number(this.today.getFullYear()));
    padVal(mon, Number(this.today.getMonth() + 1));
    padVal(day, Number(this.today.getDate()));
    padVal(hour, Number(this.today.getHours()));
    }

    /*----------------------------------
    pre: state.user.config.clockInterval
    post:
    setInterval
    ----------------------------------*/
    setsTimer(){
    this.timerObj=setInterval(this.runOnInterval, state.user?.config?.clockInterval||60000);
    }


    /*----------------------------------
    pre: left navigation element exists
    post: elements filled out.
    Fills out the elements as needed
    ----------------------------------*/
    fillLeftNavHead(){
    let yr=document.getElementsByName("homeCalYear")[0];
    let mon=document.getElementsByName("homeCalMon")[0];
    let day=document.getElementsByName("homeCalDay")[0];
    this.updtToday();
    let hr=document.getElementsByName("homeCalHr")[0];
    let min=document.getElementsByName("homeCalMin")[0];
    padVal(hr,Number(this.today.getHours()));
    padVal(min,Number(this.today.getMinutes()));
    } 


    /*----------------------------------
    ----------------------------------*/
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
  
    var yr=document.getElementsByName("homeCalYear")[0];
    var mn=document.getElementsByName('homeCalMon')[0];
    var dy=document.getElementsByName('homeCalDay').length>=1?document.getElementsByName('homeCalDay')[0]:null;
    var hr=document.getElementsByName('homeCalHr')[0];
 
    add?num++:num--;

      switch(forId){
        case "homeCalHr" :
        this.today.setHours(num);
        break;
        case "homeCalDay" :
        this.today.setDate(num);
        break;
        case "homeCalMon":
        this.today.setMonth(num-1);
        break;
        case "homeCalYear":
        this.today.setFullYear(num);
        break;
        default:
        break;
      }

    let now=new Date();
    this.editted=true;
      if(
      this.today.getFullYear()==now.getFullYear()
      &&this.today.getMonth()==now.getMonth()
      &&this.today.getDate()==now.getDate()
      &&this.today.getHours()==now.getHours()
      ){
      this.editted=false;
      }

    //updates appts when date is changed
    //this.modDate(dt.getFullYear(),dt.getMonth(),dt.getDate());
    this.updtToday();
    this.drawApptsCard();
    return true;
    }

    /*----------------------------------
    pre: 
    post: 
    ----------------------------------*/
    sttsSlctFunc(e){
    console.log(e.target.value);
    }

    /*----------------------------------
    pre: 
    post: 
    ----------------------------------*/
    hookSttsSlct(){
    let el=document.getElementsByName("homeMainFltrSlct")[0];
    el.onchange=this.sttsSlctFunc;
    }


    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
    this.hookSttsSlct();
    } 


    /*----------------------------------
    pre: this.rghtModForm 
    post: none
    generates right modal content
    ----------------------------------*/
    apptRghtMod(id=null){
      //the home page will ONLY have appointments
      apptRghtModObj.popRghtMod(id);
      mainObj.modRghtOpenClose();
    }
 
    /*----------------------------------
    pre: this.rghtModForm 
    post: none
    generates right modal content with appointment
    ----------------------------------*/
    invcsRghtMod(id=null){
      //the home page will ONLY have appointments
      invcsRghtModObj.popRghtMod(null, id);
      mainObj.modRghtOpenClose();
    }

    /*----------------------------------
    pre:
    post:
    ----------------------------------*/
    drawApptsCard(){
    let apptsArr=this.getAppts();
    this.appts=apptsArr;
    let appts=document.getElementById('homeMainAppts');
    let from=new Date(this.today);
    let now=new Date(this.today);
    from.setHours(from.getHours()-Number(state.user.config.behind));
    appts.innerHTML=`<div class="homeApptCardBar"><span>${timeOnly(from)}</span><span>-</span><span>${dateOnly(from)}</span></div>`;
      for(let i in apptsArr){
      let dt=new Date(apptsArr[i].on_date);
      let ndt=new Date(dt);
      ndt.setMinutes(ndt.getMinutes() + Number(apptsArr[i].duration));
      let cur='';
        if(epochTime(now)>=epochTime(dt)&&epochTime(now)<=epochTime(ndt)){
        console.log(apptsArr[i]);
        cur=' homeApptCardCur';
        }
      let fNm=apptsArr[i].cust_fName.length>=11?apptsArr[i].cust_fName.substr(0,8)+'...':apptsArr[i].cust_fName;
      let lNm=apptsArr[i].cust_surName.length>=3?apptsArr[i].cust_surName.substr(0,1)+'.':apptsArr[i].cust_surName;
      let iSArr=apptsArr[i].events.split('|');
      let iSHtml='';
        for(let cnt in iSArr){
          if(cnt>=1){
          iSHtml+='<div style="margin-left:4px;">...</div>';
          break;
          }
          iSHtml+=`
          <div class="homeApprCardInfoIS">
          ${iSArr[cnt]}
          </div>
          `;
        }
        if(iSHtml!=''){
        iSHtml=`
        <div class="homeApptCardInfoCust" title="${apptsArr[i].events.replaceAll('|',', ')} [${iSArr.length}]">
          <div class="homeApptCardInfoCustRowIS">
          ${iSHtml}
          </div>
        </div>`;
        } 
      appts.innerHTML+=`
        <div class="homeApptCard${cur}">
          <div class="homeApptCardInfo" title="Edit Appointment" onclick=homeObj.apptRghtMod("b2511661-871d-4377-bc14-3cbbf50dfb8c")>
            <div class="homeApptCardInfoDateTime">
            <span>${timeOnly(dt)}</span><span>-</span><span>${dateOnly(dt)}</span>
            </div>
            <div class="homeApptCardInfoCust">
              <div class="homeApptCardInfoCustRow">
                <div title="${apptsArr[i].cust_fName} ${apptsArr[i].cust_surName} - ${apptsArr[i].cust_cellphone} - ${apptsArr[i].cust_email}">${fNm} ${lNm}</div>
                <div>${apptsArr[i].duration} min.</div>
              </div>
            </div>
            ${iSHtml}
          </div>
          <div class="homeApptCardActions">
            <div class="menuIcon" title="Pictures">`+getEvalIcon(iconSets, state.user.config.iconSet, 'camera')+`</div>
            <div class="menuIcon" title="Mark as done and generates receipt" onclick=homeObj.invcsRghtMod(${i})>`+getEvalIcon(iconSets, state.user.config.iconSet, 'receipt')+`</div>
            <div class="menuIcon" title="Mark as done (no receipt)">`+getEvalIcon(iconSets, state.user.config.iconSet, 'done')+`</div>
            <div class="menuIcon homeAppCardActionsMore" title="More actions">
            `+getEvalIcon(iconSets, state.user.config.iconSet, 'moreHorz')+`
              <div class="homeAppCardActionsMoreMore">
                <div class="menuIcon" title="Cancel Appointment">`+getEvalIcon(iconSets, state.user.config.iconSet, 'cancel')+`</div>
                <div class="menuIcon" title="Put appointment on hold">`+getEvalIcon(iconSets, state.user.config.iconSet, 'hand')+`</div>
              </div>
            </div>
          </div>
        </div>
      `;
      }
    let to=new Date(this.today);
    to.setHours(to.getHours()+Number(state.user.config.ahead));
    appts.innerHTML+=`<div class="homeApptCardBar"><span>${timeOnly(to)}</span><span>-</span><span>${dateOnly(to)}</span></div>`;
    }

    /*----------------------------------
    pre: state.user.config.shift obj, selectViewEventUser()
    post: 
    gets the appoints for the proper time range.

    I'm so tempted to implement my custom binary search that is able to binary search via a range.
    I have no idea how, that I've written a new type of binary search that, to my knowledge, doesn't exist anywhere and improves on such a fundamental search algorithm for a job interview and I DIDN'T get that job. At some point, it feels like someone going "I've invented an engine that will use the same amount of fuel and power uphill as it does down hill" and someone else going "Yes, but you didn't make the engine green."
    ----------------------------------*/
    getAppts(){
    let stts=document.getElementsByName('homeMainFltrSlct')[0];
    let from=new Date(this.today);
    from.setHours(from.getHours()-Number(state.user.config.behind));
    let to=new Date(this.today);
    to.setHours(to.getHours()+Number(state.user.config.ahead));

    let arr=selectEventDateRngUser(state.user.uuid, dtTmDbFrmt(from.toISOString()), dtTmDbFrmt(to.toISOString()), null, stts.value, true);
    return arr;
    }

    /*----------------------------------
    pre: drawTbl(), element contactsmain
    post: draws the table to the html
    generates contacts table
    ----------------------------------*/
    draw(){
    document.getElementById('mainEl').innerHTML=this.mainElHtml;
    this.drawApptsCard();
    }

    /*-------------------------------------
    pre: this class, mainEl(), rghtMod(), hookEl()
    post: html page changed
    runs the main function to initialize the page
    -------------------------------------*/ 
    run(){
    /*
    page that the user will live for most of the "day" whatever that day is for that person (i.e. 9am~5pm, 10pm~4am, etc.)
    It should have a minimal column for appointments. Each appointment should bring up (either hover over or click on or click on a button) the info/form for that customer (in the right modal)
    That info/form/modal should have customer info, customer notes, pictures taken for the customer (hair), and other things (last few appointments? Last few invoices?)
    That panel should also have the option to take pictures of that customer. The interface thereof should be a overlay modal so the page doesn't have to change.
    The appoints liste item should also change color/status/whatever depending on current time. 
    */

    /*
    features:
    - status filters
    - autoscroll to current event[s] (bias on first event)
    - highlight to current event[2]
    - buttons: camera, done, other (all other status options)
    - interface for selecting current day
    - item block, not row
    - event edit on block click
    - lunch block
    - determine what day to show by time calculation.
      ex. If shift is defined as 10pm to 4am.
        if current datetime is 2024-01-04 7:00 pm
        last end shift date time 2024-01-04 4:00am
        prev start shift date time 2024-01-04 10pm
        LastEndShift - Cur time = 15 hours
        Cur time - PrevStartShift = 3 hours.
        3 > 15 hours. Show next shift

        Logic:
        if cur time within shift, show current shift. 
        else, do cal above.
    */
    document.getElementById('leftNavMod').innerHTML=this.lftNavHead;
    this.fillLeftNavHead();
    this.statuses=selectStatus();
    this.sttsHsh=arrOfHshToHshHsh('name',this.statuses);
//function selectEventDateRngUser(userId, dtFro, dtTo, stts='active'){
    this.draw();
    document.getElementsByName('homeMainFltrSlct')[0].innerHTML=genSttsSlct(this.statuses);
    this.hookEl();
    this.setsTimer();
    }

  }

var homeObj=new home();
state.depModuleObjs['home']=homeObj;
}
