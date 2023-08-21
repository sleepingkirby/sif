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
    this.tmpl.usersSelect=[];
    this.tmpl.usersSelect[0]=`<option value="`;
    this.tmpl.usersSelect[1]=`"`
    this.tmpl.usersSelect[2]=`>`;
    this.tmpl.usersSelect[3]=`</option>`;
    this.tmpl["invntSrvListEls"]=[];
    this.tmpl.invntSrvListEls[0]=`
    `;
    this.tmpl.invntSrvListEls[1]=`
    `;
    this.invntSrvAddedArr=[];
    this.invntSrvList=null;
    var dt=toInptValFrmt();
    this.lftModForm=`
    <div id="apptNewApptForm">
      <div class="lbl">Add new appointment</div>
      <div id="apptNewApptFormUser">
        <div id="apptNewApptFormUserSlct">
          <select id="apptNewApptFormUserLastName" name="contactSelect[surName]" onchange="apptObj.testFunc(event)">
          </select>
          <select id="apptNewApptFormUserFirstName" name="contactSelect[fName]" onchange="apptObj.testFunc(event)">
          </select>
          <select id="apptNewApptFormUserEmail" name="contactSelect[email]" onchange="apptObj.testFunc(event)">
          </select>
          <select id="apptNewApptFormUserPhone" name="contactSelect[cellphone]" onchange="apptObj.testFunc(event)">
          </select>
          <input id="apptNewApptFormApptInfoForUsr" type="hidden" name="event[forUser_id]" />
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
        <div class="row" style="justify-content:space-between;">
          <div class="row">
            <input id="apptNewApptFormApptInfoOnDate" name="event[on_date]" type="datetime-local" value="${dt}"/>
	          <select id="apptNewApptFormApptInfoByUser" name="event[byUser_id]">
	            <option>by user</option>
            </select>
          </div>
          <div class="row">
            <label for="apptNewApptFormApptInfoDur" title="in minutes" style="margin-right:8px;">Duration:</label>
            <input id="apptNewApptFormApptInfoDur" title="in minutes" type="number" name="event[duration]" max="999" min="1" placeholder="0" style="margin-right:0px;"/>
          </div>
        </div>
        <div class="row" style="justify-content:flex-start;">
          <select id="apptNewApptFormApptInfoSrv" name="event[invntSrv]">
            <option>service</option>
	        </select>
          <input id="apptNewApptFormApptInfoAddSrv" type="submit" value="Add Service"/>
        </div>
        <div class="row" style="justify-content:flex-start; align-items:stretch; flex-direction:column; margin-top:18px;">
          <div id="apptNewApptFormApptInfoSrvLstLbl" class="row" title="Services Added" style="justify-content:flex-start; margin-bottom:6px;">
          Services to be added
          </div>
          <div id="apptNewApptFormApptInfoSrvLst" class="row" title="Services Added">
          </div>
        </div>
        <div class="row" style="margin-bottom:24px;">
          <input id="apptNewApptFormApptInfoAddBtn" type="submit" value="Add Appointment"/>
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
      //open/close left modal
      document.getElementById("apptAddBtn").onclick=(e)=>{
      let el=document.getElementById('lftMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      };
      //add new appointment
      document.getElementById("apptNewApptFormApptInfoAddBtn").onclick=(e)=>{
      var els=document.getElementById("apptNewApptForm").querySelectorAll("*[name^=event]");
      console.log(els);
      }
      //
      document.getElementById("apptNewApptFormApptInfoAddSrv").onclick=(e)=>{
      var el=document.getElementById("apptNewApptFormApptInfoSrv");
      this.invntSrvAddedArr.push(el.value);
      this.genInvntSrvListEls();
      }
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
    getInvntSrv(username=null, excldNull=false){
    var whereUsr=' where username is null or username=$username';
      if(excldNull){
      whereUsr=' where username=$username';
      }
    const q=`select invntSrv.uuid, invntSrv.name, type_uuid, type.name as type, invntSrv.create_date, invntSrv.mod_date, invntSrv.status, users.username as username, invntSrv.srv_durtn, invntSrv.sku, invntSrv.amnt, invntSrv.buy, invntSrv.sell, invntSrv.notes from invntSrv left join type on invntSrv.type_uuid=type.uuid left join invntSrv_users on invntSrv.uuid=invntSrv_users.invntSrv_uuid left join users on invntSrv_users.users_id=users.uuid${whereUsr}`;
    var invntSrv=sqlObj.runQuery(q,{$email:username});
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
    this.invntSrvList={...invntSrv};
    var keys=Object.keys(invntSrv);
    var html='';
      if(keys.length<=0){
      return html;
      }

      for(const uuid of keys){
        html+=`<option value="${uuid}"${selectedUUID==uuid?" selected":""}>${invntSrv[uuid].name}</option>`;
      }
    return html;
    }
   
    /*-----------------------------------------------
    pre: this.invntSrvList filled
    post: none
    -----------------------------------------------*/
    delFromInvntSrvAddedArr(val){
      console.log(`delFromInvntSrvAddedArr()<<<<<<< ${val}`);
      if(!val){
      return null;
      }
    var i=this.invntSrvAddedArr.findIndex(el=>el===val);
    console.log(i);
      if(i>=0){
      this.invntSrvAddedArr.splice(i,1);
      }
    }
 
    /*-----------------------------------------------
    pre: this.invntSrvList filled
    post: none
    -----------------------------------------------*/
    genInvntSrvListEls(){
    var html="";
    var total=0;
      if(this.invntSrvList&&this.invntSrvAddedArr){
        for(const uuid of this.invntSrvAddedArr){
        html+=`
        <div class="invntSrvListItem" onclick='apptObj.delFromInvntSrvAddedArr("${uuid}");apptObj.genInvntSrvListEls();'>
          <div class="invntSrvListItemName">${this.invntSrvList[uuid].name}</div>
          <div class="invntSrvListItemDel">x</div>
        </div>
        `;
        total+=this.invntSrvList[uuid]&&Number.isFinite(this.invntSrvList[uuid].srv_durtn)?this.invntSrvList[uuid].srv_durtn:0;
        }
      document.getElementById("apptNewApptFormApptInfoSrvLst").innerHTML=html;
      document.getElementById("apptNewApptFormApptInfoDur").value=total;
      }
    }

    /*-----------------------------------------------
    pre: this.invntSrvList filled
    post: none
    -----------------------------------------------*/
    getUsers(){
      try{
      return sqlObj.runQuery("select u.uuid as uuid, c.fName as fName, c.surName as surName, c.mName as mName, c.email as email, s.name as status, c.phone as phone, c.cellphone as cellphone from users as u left join contacts as c on u.uuid=c.user_id left join status as s on u.status_id=s.uuid");
      }
      catch(e){
      console.log(e);
      }
    }

    /*-----------------------------------------------
    -----------------------------------------------*/
    genUsrSlct(users,prop,dfltVal='none',slctdPrp=null,slctdVl=null){
      if(!users||users.length<=0){
      return "";
      }
      var html="";
      html+=this.tmpl.usersSelect[0]+this.tmpl.usersSelect[1]+this.tmpl.usersSelect[2]+dfltVal+this.tmpl.usersSelect[3];
      for(const usr of users){
        if(slctdPrp&&slctdVl&&usr[slctdPrp]==slctdVl){
        html+=this.tmpl.usersSelect[0]+usr.uuid+this.tmpl.usersSelect[1]+" selected"+this.tmpl.usersSelect[2]+usr[prop]+this.tmpl.usersSelect[3];
        }
        else{
        html+=this.tmpl.usersSelect[0]+usr.uuid+this.tmpl.usersSelect[1]+this.tmpl.usersSelect[2]+usr[prop]+this.tmpl.usersSelect[3];
        }
      }
    return html;
    }


    /*-----------------------------------------------
    pre:
    post: left modal filled
    generates left modal content
    -----------------------------------------------*/
    genLftMod(){
/*
          <select id="apptNewApptFormUserLastName" name="contactSelect[surName]" onchange="apptObj.testFunc(event)">
          </select>
          <select id="apptNewApptFormUserFirstName" name="contactSelect[fName]" onchange="apptObj.testFunc(event)">
          </select>
          <select id="apptNewApptFormUserEmail" name="contactSelect[email]" onchange="apptObj.testFunc(event)">
          </select>
          <select id="apptNewApptFormUserPhone" name="contactSelect[cellphone]" onchange="apptObj.testFunc(event)">
          </select>
*/
    var users=this.getUsers();
    document.getElementById('lftMod').getElementsByClassName("content")[0].innerHTML=this.lftModForm;
    document.getElementById('apptNewApptFormUserLastName').innerHTML=this.genUsrSlct(users,'surName','Last Name');
    document.getElementById('apptNewApptFormUserFirstName').innerHTML=this.genUsrSlct(users,'fName','First Name');
    document.getElementById('apptNewApptFormUserEmail').innerHTML=this.genUsrSlct(users,'email', 'eMail');
    document.getElementById('apptNewApptFormUserPhone').innerHTML=this.genUsrSlct(users,'cellphone', 'Cell Phone');

    }


    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){
    document.getElementById('mainEl').innerHTML=this.genAppts();
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavAppt();
    this.genLftMod();
    document.getElementById("apptNewApptFormApptInfoSrv").innerHTML=this.genInvntSrv();
    document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML='';
    this.hookEl();
    }
  }

var apptObj=new appt();
state.depModuleObjs['appt']=apptObj;
}
