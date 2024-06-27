if(typeof home==='undefined'){
  /*-------------------------------------------
  pre: state variable
  post: html changed, db updated
  class for the main page that people will live for most the day
  -------------------------------------------*/
  class home{

    constructor(){
      this.lftNavHead=`
      <div class="homeClockWrap">
        <div>
        Home
        </div>
        <div id="homeClockDate">
        Date
        </div>
        <div id="homeClockTime">
        Time
        </div>
      </div>
      `;
      this.rghtModForm=``;
      this.mainElHtml=[];
      this.timerObj=null;
    }

    
    runOnInterval(){

    }
   
    /*----------------------------------
    pre: state.user.config.clockInterval
    post:
    setInterval
    ----------------------------------*/
    setsTimer(){
    

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
    document.getElementById('mainEl').innerHTML="";
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

//function selectEventDateRngUser(userId, dtFro, dtTo, stts='active'){
    this.draw();
    }

  }

var homeObj=new home();
state.depModuleObjs['home']=homeObj;
}
