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
    let dt=toInptValFrmt();
    this.lftModForm=`
    <div id="apptNewApptForm">
      <div class="lbl">Add new appointment</div>
      <div id="apptNewApptFormUser">
        <div id="apptNewApptFormUserSlct">
          <select id="apptNewApptFormUserLastName" name="contactSelect[surName]">
          </select>
          <select id="apptNewApptFormUserFirstName" name="contactSelect[fName]">
          </select>
          <select id="apptNewApptFormUserEmail" name="contactSelect[email]">
          </select>
          <select id="apptNewApptFormUserPhone" name="contactSelect[cellphone]">
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
          <div class="row" id="apptNewApptFormApptInfoDateUser">
            <input id="apptNewApptFormApptInfoOnDate" name="event[on_date]" type="datetime-local" value="${dt}"/>
	          <select id="apptNewApptFormApptInfoByUser" name="event[byUser_id]">
	            <option>by user</option>
            </select>
            <div id="apptNewApptFormApptInfoByUserType">&nbsp;</div>
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
    this.slctIdArr=["apptNewApptFormUserLastName","apptNewApptFormUserFirstName","apptNewApptFormUserEmail","apptNewApptFormUserPhone"];
    this.users=null;
    this.customers=null;
    }

    testFunc(e){
    console.log("asdfasdfasfdasdfd");
    console.log(e.target.value);
    }


    /*----------------------------------
    pre: select elements
    post: change sync select elements
    changes all select elements in array to select a value
    ----------------------------------*/
    syncSlctEls(slctIdArr, val){
      for(const id of slctIdArr){
      const el=document.getElementById(id);
        if(el){
        el.value=val||"";
        }
      }
    }

    
    /*----------------------------------
    pre:
    post:
    gets the string within the brackets. i.e contact[subname] gets subname
    ----------------------------------*/
    getSubs(str, head="contact"){
      if(str){
      const patt=new RegExp('(^'+head+'\\[|\\]$)','g');
      return str.replace(patt,"");
      }
    return "";
    }

 
    /*----------------------------------
    pre:
    post:
    fills out "apptNewApptFormUserInfo"
    ----------------------------------*/
    syncUserInfo(val){
    const cust=this.customers.find(c=>c.uuid==val);
    const els=document.querySelectorAll('#apptNewApptFormUserInfo textarea[name^="contact["]');
      if(cust){
        for(let ta of els){
        let subName=getSubs(ta.name);
          if(subName&&cust[subName]){
          ta.value=cust[subName];
          }
          else{
          ta.value="";
          }
        }
      }
      else{
        for(let ta of els){
        ta.value="";
        }
      }
    }

    /*----------------------------------
    pre: select elements 
    post: sets event hooks
    sets the event hooks for select
    ----------------------------------*/
    hookElSlct(){
      //set select elements on change
      for(const id of this.slctIdArr){
      const el=document.getElementById(id);
        if(el){
          el.onchange=(e)=>{
            if(e.target){
            this.syncSlctEls(this.slctIdArr,e.target.value||"");
            this.syncUserInfo(e.target.value||"");
            }
          }
        }
      }
    }

    /*----------------------------------
    pre: left modal elements 
    post: sets event hooks
    sets the event hooks for the left modal
    ----------------------------------*/
    hookElLftMod(){
      //add new appointment
      document.getElementById("apptNewApptFormApptInfoAddBtn").onclick=(e)=>{
      let els=document.getElementById("apptNewApptForm").querySelectorAll("*[name^=event]");
      console.log(els);
      }

      //add service to new appointment form
      document.getElementById("apptNewApptFormApptInfoAddSrv").onclick=(e)=>{
      let el=document.getElementById("apptNewApptFormApptInfoSrv");
      this.invntSrvAddedArr.push(el.value);
      this.genInvntSrvListEls();
      }
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
    }

    /*-----------------------------------------------
    pre: none
    post: generates leftNav Element
    generates HTML of leftNav element for calendar
    -----------------------------------------------*/
    genLeftNavAppt(){
    let rtrn='Appointments';
    return rtrn;
    }

    /*-----------------------------------------------
    pre: none
    post: none
    -----------------------------------------------*/
    genAppts(){
    let appts=sqlObj.runQuery(`
    select
    *
    from events
    `);
    let rtrn='';
    rtrn+=this.tmpl.mainEl[0];
    return rtrn;
    }


    /*----------------------------------------------
    pre: sqlObj
    post: none
    gets all the invntSrv records 
    ----------------------------------------------*/
    getInvntSrv(username=null, excldNull=false){
    let whereUsr=' where username is null or username=$username';
      if(excldNull){
      whereUsr=' where username=$username';
      }
    const q=`select invntSrv.uuid, invntSrv.name, type_uuid, type.name as type, invntSrv.create_date, invntSrv.mod_date, invntSrv.status, users.username as username, invntSrv.srv_durtn, invntSrv.sku, invntSrv.amnt, invntSrv.buy, invntSrv.sell, invntSrv.notes from invntSrv left join type on invntSrv.type_uuid=type.uuid left join invntSrv_users on invntSrv.uuid=invntSrv_users.invntSrv_uuid left join users on invntSrv_users.users_id=users.uuid${whereUsr}`;
    let invntSrv=sqlObj.runQuery(q,{$email:username});
    let invntSrvObj={};
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
    let invntSrv=this.getInvntSrv(username);
    this.invntSrvList={...invntSrv};
    let keys=Object.keys(invntSrv);
    let html='';
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
      if(!val){
      return null;
      }
    let i=this.invntSrvAddedArr.findIndex(el=>el===val);
      if(i>=0){
      this.invntSrvAddedArr.splice(i,1);
      }
    }
 
    /*-----------------------------------------------
    pre: this.invntSrvList filled
    post: none
    -----------------------------------------------*/
    genInvntSrvListEls(){
    let html="";
    let total=0;
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
    pre: none
    post: none
    params: users= array of users, prop=property to display, dfltVal=default value, slsctdPrp=which property to match slctdVl against, slctdVl= the value to choose to select
    generates <option/> for select elements for users
    -----------------------------------------------*/
    genUsrSlct(users,prop,dfltVal='none',slctdPrp=null,slctdVl=null){
      let html="";
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
    -----------------------------------------------*/
    hookUsrTyp(){
      document.getElementById('apptNewApptFormApptInfoByUser').onchange=(e)=>{
      let el=document.getElementById('apptNewApptFormApptInfoByUserType');
      let user=this.users.find(u=>u.uuid==e.target.value);
        if(user){
        el.innerHTML=user.type;
        }
        else{
        el.innerHTML="N/A";
        }
      }
    }

    /*-----------------------------------------------
    pre: this class
    post: left modal filled
    generates left modal content
    -----------------------------------------------*/
    genLftMod(){
    this.users=getUsers();
    const {customer:customers, '':users}=spltUsr(this.users);
    this.customers=[...customers];
    document.getElementById('lftMod').getElementsByClassName("content")[0].innerHTML=this.lftModForm;
    this.hookElLftMod();
    document.getElementById('apptNewApptFormUserLastName').innerHTML=this.genUsrSlct(customers,'surName','Last Name');
    document.getElementById('apptNewApptFormUserFirstName').innerHTML=this.genUsrSlct(customers,'fName','First Name');
    document.getElementById('apptNewApptFormUserEmail').innerHTML=this.genUsrSlct(customers,'cEmail', 'E-Mail');
    document.getElementById('apptNewApptFormUserPhone').innerHTML=this.genUsrSlct(customers,'cellphone','Cell Phone');
    this.hookElSlct();
    document.getElementById('apptNewApptFormApptInfoSrv').innerHTML=this.genInvntSrv();
    document.getElementById('apptNewApptFormApptInfoByUser').innerHTML=this.genUsrSlct(users,'username','Username','uuid',state.user.uuid);
    this.hookUsrTyp();
    document.getElementById('apptNewApptFormApptInfoByUserType').innerHTML=state.user.type;
    }


    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){
    document.getElementById('mainEl').innerHTML=this.genAppts();
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavAppt();
    this.genLftMod();
    document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML='';
    this.hookEl();
    }
  }

var apptObj=new appt();
state.depModuleObjs['appt']=apptObj;
}
