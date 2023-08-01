if(typeof appt==='undefined'){
  class appt{
    constructor(apptId=null){
      if(state.pageVars&&!state.pageVars.appt){
      state.pageVars.appt={};
      }
    state.pageVars.appt.id=apptId;
    this.tmpl={};
    this.tmpl["mainEl"]=[];
    this.tmpl.mainEl[0]=`
      <div id="apptAdd">
        <div id="apptAddBtn">⨁</div>
      </div>
    `;
    this.lftModForm=`
    <div id="apptNewApptForm">
      <div class="lbl">Add new appointment</div>
      <div id="apptNewApptFormUser">
        <div id="apptNewApptFormUserSlct">
          <select id="apptNewApptFormUserLastName" onchange="apptObj.testFunc(event)">
            <option value="lastnameval">lastname</option>
            <option>null</option>
            <option>null</option>
            <option>null</option>
          </select>
          <select id="apptNewApptFormUserFirstName" onchange="apptObj.testFunc(event)">
            <option value="firstnameval">firstname</option>
            <option>null</option>
            <option>null</option>
            <option>null</option>
          </select>
          <select id="apptNewApptFormUserEmail" onchange="apptObj.testFunc(event)">
            <option value="emailval">email</option>
            <option>null</option>
            <option>null</option>
            <option>null</option>
          </select>
          <select id="apptNewApptFormUserPhone" onchange="apptObj.testFunc(event)">
            <option value="phoneval">phone</option>
            <option>null</option>
            <option>null</option>
            <option>null</option>
          </select>
        </div>
        <div id="apptNewApptFormUserNew">
          <input id="apptNewApptFormUserNewUser" type="submit" value="NewUser">
        </div>
      </div>
      <div id="apptNewApptFormUserInfo">
        <div class="row" style="margin-bottom: 26px;">
          <textarea name="contact[surName]" type="text" placeholder="Last Name"></textarea>
          <textarea name="contact[mName]" type="text" style="width:60px;" placeholder="M."></textarea>
          <textarea name="contact[fName]" type="text" style="flex-grow: 100;" placeholder="First Name"></textarea>
        </div>
        <div class="row" style="margin-bottom: 22px;">
          <textarea name="contact[phone]" type="text" placeholder="home phone"></textarea>
          <textarea name="contact[email]" type="text" placeholder="email address"></textarea>
        </div>
      </div
      <div id="apptNewApptFormApptInfo">
      &nbsp;
      </div>
    </div>
    `;
    }

    testFunc(e){
    console.log("asdfasdfasfdasdfd");
    console.log(e.target.value);
    }

    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
      document.getElementById("apptAddBtn").onclick=(e)=>{
      let el=document.getElementById('lftMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      };
    }

    /*-----------------------------------------------
    pre: none
    post: generates leftNav Element
    generates HTML of leftNav element for calendar
    -----------------------------------------------*/
    genLeftNavAppt(){
    var rtrn='Appointments';
    return rtrn;
    }

    /*-----------------------------------------------
    pre: none
    post: none
    -----------------------------------------------*/
    genAppts(){
    /*
CREATE TABLE events(uuid text not null primary key, forUser_id text not null, byUser_id text not null, create_date int not null, on_date int not null, done_date int null, duration int null, notes text, foreign key(forUser_id) references users(uuid), foreign key(byUser_id) references users(uuid));
sqlite> .schema events_invntSrv
CREATE TABLE events_invntSrv(uuid text not null, create_date int not null, events_id text not null, invntSrv_id text not null, foreign key(events_id) references events(uuid), foreign key(invntSrv_id) references invntSrv(uuid));
sqlite> .schema events_type
CREATE TABLE events_type(uuid text not null primary key, event_uuid text not null, type_uuid text not null, foreign key(event_uuid) references events(uuid), foreign key(type_uuid) references type(uuid));
    */
    var appts=sqlObj.runQuery(`
    select
    *
    from events
    `);
    var rtrn='';
    rtrn+=this.tmpl.mainEl[0];
    return rtrn;
    }

    /*-----------------------------------------------
    pre: none
    post: none
    -----------------------------------------------*/
    
    

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){
    document.getElementById('mainEl').innerHTML=this.genAppts();
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavAppt();
    document.getElementById('lftMod').getElementsByClassName("content")[0].innerHTML=this.lftModForm;
    document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML='';
    this.hookEl();
    }
  }

var apptObj=new appt();
state.depModuleObjs['appt']=apptObj;
}
