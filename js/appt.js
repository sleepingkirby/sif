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
    var dt=toInptValFrmt();
    this.lftModForm=`
    <div id="apptNewApptForm">
      <div class="lbl">Add new appointment</div>
      <div id="apptNewApptFormUser">
        <div id="apptNewApptFormUserSlct">
          <select id="apptNewApptFormUserLastName" name="conactSelect[surName]" onchange="apptObj.testFunc(event)">
            <option value="lastnameval">lastname</option>
            <option>null</option>
            <option>null</option>
            <option>null</option>
          </select>
          <select id="apptNewApptFormUserFirstName" name="contactSelect[fName]" onchange="apptObj.testFunc(event)">
            <option value="firstnameval">firstname</option>
            <option>null</option>
            <option>null</option>
            <option>null</option>
          </select>
          <select id="apptNewApptFormUserEmail" name="contactSelect[email]" onchange="apptObj.testFunc(event)">
            <option value="emailval">email</option>
            <option>null</option>
            <option>null</option>
            <option>null</option>
          </select>
          <select id="apptNewApptFormUserPhone" name="contactSelect[cellphone]" onchange="apptObj.testFunc(event)">
            <option value="cellphoneval">cell phone</option>
            <option>null</option>
            <option>null</option>
            <option>null</option>
          </select>
        </div>
        <div id="apptNewApptFormUserNew">
          <input id="apptNewApptFormUserNewUser" type="submit" value="NewUser" disabled>
        </div>
      </div>
      <div id="apptNewApptFormUserInfo">
        <div class="row">
          <textarea name="contact[surName]" type="text" placeholder="Last Name"></textarea>
          <textarea name="contact[mName]" type="text" style="width:60px;" placeholder="M."></textarea>
          <textarea name="contact[fName]" type="text" style="flex-grow: 100;" placeholder="First Name"></textarea>
        </div>
        <div class="row" style="margin-bottom: 6px;">
          <textarea name="contact[phone]" type="text" placeholder="home phone"></textarea>
          <textarea name="contact[email]" type="text" style="margin-left:40px;flex-grow:100;" placeholder="email address"></textarea>
        </div>
      </div
      <div id="apptNewApptFormApptInfo">
        <div class="row" style="justify-content:flex-start;">
          <input id="apptNewApptFormApptInfoOnDate" name="event[on_date]" type="datetime-local" value="${dt}"/>
          <select id="apptNewApptFormApptInfoSrv">
          </select>
        </div>       
      </div>
    </div>
    `;
/*
CREATE TABLE events(uuid text not null primary key, forUser_id text not null, byUser_id text not null, create_date int not null, on_date int not null, done_date int null, duration int null, notes text, foreign key(forUser_id) references users(uuid), foreign key(byUser_id) references users(uuid));
sqlite> .schema events_type
CREATE TABLE events_type(uuid text not null primary key, event_uuid text not null, type_uuid text not null, foreign key(event_uuid) references events(uuid), foreign key(type_uuid) references type(uuid));
sqlite> .schema events_invntSrv
CREATE TABLE events_invntSrv(uuid text not null, create_date int not null, events_id text not null, invntSrv_id text not null, foreign key(events_id) references events(uuid), foreign key(invntSrv_id) references invntSrv(uuid));
sqlite> .schema invntSrv
CREATE TABLE invntSrv(uuid text primary key, name text not null, create_date int not null, mod_date int not null, status text not null, srv_durtn int null, sku text, amnt int, buy real, sell real, notes text, foreign key(status) references status(uuid));
*/
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

    /*----------------------------------------------
    pre: sqlObj
    post: none
    gets all the invntSrv records 
    ----------------------------------------------*/
    getInvntSrv(username=null){
    const q=`select invntSrv.uuid, invntSrv.name, type_uuid, type.name as type, invntSrv.create_date, invntSrv.mod_date, invntSrv.status, users.username as username, invntSrv.srv_durtn, invntSrv.sku, invntSrv.amnt, invntSrv.buy, invntSrv.sell, invntSrv.notes from invntSrv left join type on invntSrv.type_uuid=type.uuid left join invntSrv_users on invntSrv.uuid=invntSrv_users.invntSrv_uuid left join users on invntSrv_users.users_id=users.uuid where username is null or username="${username}"`;
    var invntSrv=sqlObj.runQuery(q);
    var invntSrvObj={};
      for(const r of invntSrv){
        if(!invntSrvObj.hasOwnProperty(r.uuid)){
        invntSrvObj[r.uuid]={...r};
        delete invntSrvObj[r.uuid].username;
        invntSrvObj[r.uuid].users=[r.username];
        }
        else{
        invntSrvObj[r.uuid].users.push(r.username);
        }
      }
    return invntSrvObj;
    }

    /*-----------------------------------------------
    pre: getInvntSrv() and everything it requires
    post: none
    -----------------------------------------------*/
    genInvntSrv(username, selectedUUID){
    var invntSrv=this.getInvntSrv(username);
    var keys=Object.keys(invntSrv);
    var html='';
      if(keys.length<=0){
      return html;
      }

      for(const uuid of keys){
        html+=`<option value="uuid"${selectedUUID==uuid?" selected":""}>${invntSrv[uuid].name}</option>`;
      }
    return html;
    }
    

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){
    document.getElementById('mainEl').innerHTML=this.genAppts();
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavAppt();
    document.getElementById('lftMod').getElementsByClassName("content")[0].innerHTML=this.lftModForm;
    document.getElementById("apptNewApptFormApptInfoSrv").innerHTML=this.genInvntSrv();
    document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML='';
    this.hookEl();
    }
  }

var apptObj=new appt();
state.depModuleObjs['appt']=apptObj;
}
