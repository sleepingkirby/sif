if(typeof home==='undefined'){
  /*-------------------------------------------
  pre: state variable
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
        <div class="calNav">
          <div name="homeCalHr" padLen=2 padChar="0" minVal=0 maxVal=23 class="calNavNum" style="border-width:0px;margin:0px;">Hr</div>
          <div class="calNavNum" style="border-width:0px; padding:0px; margin:0px;">:</div>
          <div name="homeCalMin" padLen=2 padChar="0" minVal=0 maxVal=59 class="calNavNum" style="border-width:0px;">Mn</div>
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
      this.apptCardHtml=[];
      this.apptCardHtml[0]=`
      <div class="homeApptCard">
      `;      

      this.apptCardHtml[1]=`
      </div>
      `;
      this.timerObj=null;
      this.statuses=null;
      this.sttsHsh=null;
      this.destruct=this.destructor;
    }


    /*---------------------------------
    pre: this.destruct
    post: stops setInterval() 
    destructor to run closing any streams when changing modules.
    ---------------------------------*/
    destructor(){
    console.log("asfasdf");
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
    //update clock (if exists)
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
    let yr=document.getElementsByName("homeCalYear")[0];
    let mon=document.getElementsByName("homeCalMon")[0];
    let day=document.getElementsByName("homeCalDay")[0];

    //Checks if the displayed time is yesterday. If so, check if need to update time when reaches midnight...-ish
      if(Number(yr.innerText)==now.getFullYear()&&Number(mon.innerText)==now.getMonth()+1&&Number(day.innerText)==now.getDate()-1){
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
    //update which events to highlight
    //update events
    }
  

    /*----------------------------------
    pre:
    post:
    update this.today and GUI
    ----------------------------------*/
    updtToday(yr=null, mn=null, dt=null){
      if(yr&&mn&&dt){
      this.today.setFullYear(yr);
      this.today.setMonth(mn);
      this.today.setDate(dt);
      }
    let year=document.getElementsByName("homeCalYear")[0];
    let mon=document.getElementsByName("homeCalMon")[0];
    let day=document.getElementsByName("homeCalDay")[0];
    padVal(year, Number(this.today.getFullYear()));
    padVal(mon, Number(this.today.getMonth() + 1));
    padVal(day, Number(this.today.getDate()));
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
   
   
    add?num++:num--;

      switch(forId){
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

    //updates appts when date is changed
    //this.modDate(dt.getFullYear(),dt.getMonth(),dt.getDate());
    this.updtToday();
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
    rghtMod(){
    }

    /*----------------------------------
    pre:
    post:
    ----------------------------------*/
    drawApptsCard(){
    let appts=document.getElementById('homeMainAppts');
    appts.innerHTML='';
      for(let i=0;i<10;i++){
      appts.innerHTML+=this.apptCardHtml[0]+i+this.apptCardHtml[1];
      }
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
    console.log(this.statuses);
    console.log(this.sttsHsh);
    this.draw();
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    document.getElementsByName('homeMainFltrSlct')[0].innerHTML=genSttsSlct(this.statuses);
    
    this.hookEl();
    this.setsTimer();
    }

  }

var homeObj=new home();
state.depModuleObjs['home']=homeObj;
}
