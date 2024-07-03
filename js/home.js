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

        <div class="homeMainAppts">
          <div class="">appoints</div>
        </div>
      </div>
      `;
      this.timerObj=null;
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
    console.log(e);
    //update clock (if exists)
    //update date
    //update which events to highlight
    //update events
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
    ----------------------------------*/
    fillLeftNavHead(){
    let mon=document.getElementsByName("homeCalMon")[0];
    let day=document.getElementsByName("homeCalDay")[0];
    padVal(mon, Number(this.today.getMonth() + 1));
    padVal(day, Number(this.today.getDay()));
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
  
console.log(event);
/* 
    var mnEl=document.getElementsByName('homeCalMon')[0];
    var dyEl=document.getElementsByName('homeCalDay').length>=1?document.getElementsByName('homeCalDay')[0]:null;
   
   
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
  */
    return true;
    }


    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
    } 
  

    /*----------------------------------
    pre: this.rghtModForm 
    post: none
    generates right modal content
    ----------------------------------*/
    rghtMod(){
    }

    /*----------------------------------
    pre: drawTbl(), element contactsmain
    post: draws the table to the html
    generates contacts table
    ----------------------------------*/
    draw(){
    document.getElementById('mainEl').innerHTML=this.mainElHtml;
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
//function selectEventDateRngUser(userId, dtFro, dtTo, stts='active'){
    this.draw();
    this.hookEl();
    this.setsTimer();
    }

  }

var homeObj=new home();
state.depModuleObjs['home']=homeObj;
}
