if(typeof home==='undefined'){
  /*-------------------------------------------
  pre: state variable
  post: html changed, db updated
  class for the main page that people will live for most the day
  -------------------------------------------*/
  class home{

    constructor(){
      this.rghtModForm=``;
      this.mainElHtml=[];
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
    document.getElementById('contactsMain').innerHTML=this.drawTbl();
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
    }

  }

var homeObj=new contacts();
state.depModuleObjs['home']=homeObj;
}
