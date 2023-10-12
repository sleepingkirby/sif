if(typeof appt==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
class to appointment events. Events DOESN'T HAVE TO BE APPOINTMENTS
-------------------------------------------*/
  class appt{
    constructor(apptId=null){
      if(state.pageVars&&!state.pageVars.appt){
      state.pageVars.appt={};
      }
    state.pageVars.appt.id=apptId;
    let dt=toInptValFrmt();
    this.tmpl={};
    this.tmpl["mainEl"]=[];
/* view_events_user(event_id,cust_uuid,cust_username,cust_status_id,cust_status_name,cust_email,phone,cellphone,byUser_uuid,byUser_username,byUser_status_id,byUserStatus_status_name,byUser_email,create_date,on_date,done_date,duration) */
    this.tmpl.mainEl[0]=`
      <div id="apptAdd">
        <div id="apptAddBtn">⨁</div>
      </div>
      <div id="apptMain">
        <table id="apptList">
          <tr>
          <th>on date</th>
          <th>status</th>
          <th>cust. contact</th>
          <th>cust. status</th>
          <th>create date</th>
          <th>done date</th>
          <th>duration</th>
          <th>action</th>
          </tr>
    `;
    this.tmpl.mainEl[1]=`
        </table>
      </div>
    `;
    this.tmpl["invntSrvListEls"]=[];
    this.tmpl.rghtModForm=[];
    this.tmpl.rghtModForm[0]=`
    <div id="apptNewApptFormFull">
      <div class="lbl">Add new appointment</div>
      <div id="apptNewApptFormFullUser">
        <div id="apptNewApptFormFullUserToggle">
          <input id="apptNewApptFormFullUserCheck" class="lblTggl" name="apptNewApptFormFullUserCheck" type="checkbox" />
          <label id="apptNewApptFormFullUserCheckToggle" class="lblTgglLbl" for="apptNewApptFormFullUserCheck">New User</label>
          <div class="userForm lblTgglLblHd">
            <div class="apptNewApptFormFullUserFormFields">
              <div class="row" style="margin-bottom: 26px;"><textarea name="contact[surName]" type="text" placeholder="Last Name"></textarea> <textarea name="contact[mName]" type="text" style="width:60px;" placeholder="M."></textarea><textarea name="contact[fName]" type="text" style="flex-grow: 100;" placeholder="First Name"></textarea></div>
              <div class="row" style="margin-bottom: 22px;"><textarea name="contact[email]" type="text" placeholder="email address"></textarea></div>
              <div class="row"><textarea name="contact[addr]" type="text" style="flex-grow: 100;" placeholder="ex. 123 main st."></textarea></div>
              <div class="row"><textarea name="contact[addr2]" type="text" style="flex-grow: 100;" placeholder="suite 123"></textarea></div>
              <div class="row"><textarea name="contact[city]" type="text" style="flex-grow: 100;" placeholder="city"></textarea><textarea name="contact[prov]" type="text" style="width: 60px;" placeholder="ST."></textarea><textarea name="contact[zip]" type="text" placeholder="zip code"></textarea></div>
              <div class="row" style="margin-bottom: 26px;"><textarea name="contact[country]" type="text" style="flex-grow: 100;" placeholder="country"></textarea></div>
              <div class="row"><textarea name="contact[phone]" type="text" placeholder="primary phone"></textarea></div>
              <div class="row" style="margin-bottom: 40px;"><textarea name="contact[cellphone]" type="text" placeholder="cell phone"></textarea></div>
              <div class="row" style="justify-content: flex-end; align-items: center;"><input id="contactsUserFormAddBtn" type="submit" value="Create User" disabled/></div>
            </div>
          </div>
        </div>
        <div id="apptNewApptFormFullUserSlct">
            <div>
              <select id="apptNewApptFormFullUserLastName" name="contactSelect[surName]">
              </select>
              <select id="apptNewApptFormFullUserFirstName" name="contactSelect[fName]">
              </select>
              <select id="apptNewApptFormFullUserEmail" name="contactSelect[email]">
              </select>
              <select id="apptNewApptFormFullUserPhone" name="contactSelect[cellphone]">
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
          <input id="apptNewApptFormFullApptInfoAddSrv" type="submit" value="Add Service"/>
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
        <div class="row" style="margin-bottom:24px;">
          <input id="apptNewApptFormFullApptInfoAddBtn" type="submit" value="Add Appointment" disabled/>
        </div>
      </div>
    </div>
    `;
    this.usrAddedArr=[];
    this.invntSrvAddedArr=[];
    this.invntSrvList=null;
    this.slctIdArrFullForm=["apptNewApptFormFullUserLastName","apptNewApptFormFullUserFirstName","apptNewApptFormFullUserEmail","apptNewApptFormFullUserPhone"];
    this.users=null;
    this.customers=null;
    this.custHsh=null;
    this.appts=null;
    this.addApptBtnId="apptNewApptFormFullApptInfoAddBtn";
    this.addApptSrvBtnId="apptNewApptFormFullApptInfoAddSrv";
    this.fullApptAddUser="apptNewApptFormFullUserAddUser"
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
    pre: this.addApptBtnId
    post: sets event hooks
    add service button hook
    ----------------------------------*/
    hookAddSrvBtn(){
    let addSrvBtn=document.getElementById(this.addApptSrvBtnId);
      if(addSrvBtn){
        addSrvBtn.onclick=(e)=>{
        let el=document.getElementById("apptNewApptFormFullApptInfoSrv");
        
          if(el&&el.value){
          this.invntSrvAddedArr.push(el.value);
          }
        this.genInvntSrvListEls();
        this.enblAddApptBtn();
        }
      }
    }


    /*----------------------------------
    pre: this.customers, this.custHsh, arrOfHshToHshHsh()
    post: user list redrawn
    delete from this.customers and this.custHsh
    ----------------------------------*/
    delFromUsrLst(uuid){
      if(!uuid){
      return null;
      }
    let i=this.usrAddedArr.findIndex(e=>e==uuid);
      this.usrAddedArr.splice(i,1);
      this.genUsrLstEls();
      this.enblAddApptBtn();
    }


    /*----------------------------------
    pre: elementId "apptNewApptFormFullApptInfoUsrLst" 
    post: HTML redrawn
    draws the user into the box with elementId
    ----------------------------------*/
    genUsrLstEls(){
    let html="";
    let hsh={};
    let el=document.getElementById("apptNewApptFormFullApptInfoUsrLst");
      if(el&&this.usrAddedArr){
        for(const uuid of this.usrAddedArr){
        let cust=this.custHsh[uuid];
        let fname=cust.fName.length>=10?cust.fName.substr(0,10)+'...':cust.fName;
        let sname=cust.surName.length>1?cust.surName.substr(0,1)+'.':cust.surName;
        html+=`
        <div class="multiBoxListItem" title="${cust.surName}, ${cust.fName} ${cust.mName} - ${cust.email} - ${cust.phone}">
          <div class="multiBoxListItemInfo">
            <div class="multiBoxListItemName">${sname}</div>
            <div class="multiBoxListItemName">${fname}</div>
          </div>
          <div class="multiBoxListItemDel" onclick='apptObj.delFromUsrLst("${uuid}");'>x</div>
        </div>
        `;
        }
      el.innerHTML=html;
      }
    }

    /*----------------------------------
    pre: select elements 
    post: sets event hooks
    sets the event hooks for select
    ----------------------------------*/
    hookElSlctFullForm(){
      for(const id of this.slctIdArrFullForm){
      const el=document.getElementById(id);
        if(el){
          el.onchange=(e)=>{
            if(e.target){
            this.syncSlctEls(this.slctIdArrFullForm,e.target.value||"");
            }
          }
        }
      }
    }

    /*----------------------------------
    pre: this.usrAddedArr, this.genUsrLst
    post:
    ----------------------------------*/
    hookElAddUserToUserLst(){
    let el=document.getElementById(this.fullApptAddUser);
      if(el){
        el.onclick=(e)=>{
        let slct=document.getElementById(this.slctIdArrFullForm[0]);
          if(slct&&slct.value){
          this.usrAddedArr.push(slct.value);
          this.genUsrLstEls();
          this.enblAddApptBtn();
          }
        };
      }
    }

    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
      document.getElementById("apptAddBtn").onclick=(e)=>{
      let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      };
      this.hookAddSrvBtn();
      this.hookElSlctFullForm();
      this.hookElAddUserToUserLst();
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
    pre: this.appts
    post: none
    generates the HTML table for the mainEl()
    -----------------------------------------------*/
    drawMainEl(){
    let rtrn='';
    let cntnt='';
      for(const appt of this.appts){
      let doneDate=appt.done_date||'';
      cntnt+=`
      <tr>
        <td>`+appt.on_date+`</td>
        <td>`+appt.status+`</td>
        <td>`+appt.cust_email+`<br>`+appt.cust_phone+`<br>`+appt.cust_cellphone+`</td>
        <td>`+appt.byUserStatus_status_name+`</td>
        <td>`+appt.create_date+`</td>
        <td>`+doneDate+`</td>
        <td>`+appt.duration+`</td>
        <td>
          <div class="apptCellActns">
          <div name="apptEdit" class="menuIcon" onclick=console.log("test"); title="Edit Appointment">`+getEvalIcon(iconSets, state.user.config.iconSet, 'edit')+`</div>
          <div name="apptDel" class="menuIcon" onclick=delEvent("`+appt.event_id+`"); title="Delete Appointment">`+getEvalIcon(iconSets, state.user.config.iconSet, 'delete')+`</div>
          </div>
        </td>
      </tr>
      `;
      }
    rtrn+=this.tmpl.mainEl[0]+cntnt+this.tmpl.mainEl[1];
    return rtrn;
    }

    /*-----------------------------------------------
    pre: selectViewEventUser(), drawMainEl(), getEvalIcon()
    post: html updated with appt
    set mainEl with appointments
    -----------------------------------------------*/
    genAppts(){
    this.appts=selectViewEventUser('byUser_uuid',state.user.uuid,'on_date','desc','active');
    return this.drawMainEl();
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
      this.genInvntSrvListEls();
      this.enblAddApptBtn();
      }
    }
 
    /*-----------------------------------------------
    pre: this.invntSrvList filled
    post: none
    -----------------------------------------------*/
    genInvntSrvListEls(){
      let iSEls={...genInvntSrvListEls(this.invntSrvList,this.invntSrvAddedArr)};
      document.getElementById("apptNewApptFormFullApptInfoSrvLst").innerHTML=iSEls.html;
      document.getElementById("apptNewApptFormFullApptInfoDur").value=iSEls.total;
    }

    /*-----------------------------------------------
    -----------------------------------------------*/
    hookUsrTyp(){
      document.getElementById('apptNewApptFormFullApptInfoByUser').onchange=(e)=>{
      let el=document.getElementById('apptNewApptFormFullApptInfoByUserType');
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
    post: right modal filled
    generates right modal content
    -----------------------------------------------*/
    genRghtMod(){
    const {customer:customers, '':users}=spltUsr(this.users);
    document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML=this.tmpl.rghtModForm[0];
    document.getElementById('apptNewApptFormFullUserLastName').innerHTML=genUsrSlct(this.customers,'surName','Last Name');
    document.getElementById('apptNewApptFormFullUserFirstName').innerHTML=genUsrSlct(this.customers,'fName','First Name');
    document.getElementById('apptNewApptFormFullUserEmail').innerHTML=genUsrSlct(this.customers,'cEmail', 'E-Mail');
    document.getElementById('apptNewApptFormFullUserPhone').innerHTML=genUsrSlct(this.customers,'cellphone','Cell Phone');
    document.getElementById('apptNewApptFormFullApptInfoSrv').innerHTML=genInvntSrv(this.invntSrvList);
    document.getElementById('apptNewApptFormFullApptInfoByUser').innerHTML=genUsrSlct(users,'username','Username','uuid',state.user.uuid);
    this.hookUsrTyp();
    document.getElementById('apptNewApptFormFullApptInfoByUserType').innerHTML=state.user.type;

    }


    /*-----------------------------------------------
    pre: this.usrAddedArr, this.invntSrvAddedArr, apptNewApptFormFullApptInfoOnDate, apptNewApptFormFullApptInfoByUser
    post:
    enables the "add appointment" button
    -----------------------------------------------*/
    enblAddApptBtn(){
    let apptDt=document.getElementById("apptNewApptFormFullApptInfoOnDate");
    let apptByUsr=document.getElementById("apptNewApptFormFullApptInfoByUser");
    let addApptBtn=document.getElementById(this.addApptBtnId);
      if(this.usrAddedArr.length>0&&this.invntSrvAddedArr.length>0&&apptDt&&apptDt.value&&apptByUsr&&apptByUsr.value){
      addApptBtn.disabled=false;
      return null;
      }
    addApptBtn.disabled=true;
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){
    document.getElementById('mainEl').innerHTML=this.genAppts();
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavAppt();
    this.users=getUsers();
    this.invntSrvList=getInvntSrv();
    const {customer:customers, '':users}=spltUsr(this.users);
    this.customers=[...customers];
    this.custHsh=arrOfHshToHshHsh('uuid',this.customers);
    this.genRghtMod();
    this.hookEl();
    }
  }

var apptObj=new appt();
state.depModuleObjs['appt']=apptObj;
}
