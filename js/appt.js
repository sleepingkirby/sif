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
        <div id="apptAddBtn" title="Add New Appointment">⨁</div>
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
      <div class="lbl">Appointment</div>
      <div id="apptNewApptFormFullApptUUID">
        <input id="apptNewApptFormFullApptInfoUUID" type="hidden" />
      </div>
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
              <select id="apptNewApptFormFullUserPhone" name="contactSelect[phone]">
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
        <div id="apptNewApptFormFullApptStatusRow" class="row">
          <select id="apptNewApptFormFullApptStatus" name="event[status]">
            <option>status</option>
          </select>
        </div>
        <div class="row" style="margin-bottom:24px;">
          <input id="apptNewApptFormFullApptInfoUpdtBtn" style="display:none;" type="submit" value="Update Appointment"/>
          <input id="apptNewApptFormFullApptInfoAddBtn" style="" type="submit" value="Add Appointment" disabled/>
        </div>
      </div>
    </div>
    `;
    this.usrAddedArr=[];
    this.invntSrvAddedArr=[];
    this.invntSrvList=null;
    this.slctIdArrFullForm=["apptNewApptFormFullUserLastName","apptNewApptFormFullUserFirstName","apptNewApptFormFullUserEmail","apptNewApptFormFullUserPhone"];
    this.users=null;
    this.usrHsh=null;
    this.customers=null;
    this.custHsh=null;
    this.appts=null;
    this.apptsHsh=null;
    this.statuses=null;
    this.userInfoFrmID='apptNewApptFormFullUserFormFields';
    this.userInfoFrmTA='.apptNewApptFormFullUserFormFields textarea[name^="contact["]';
    this.addApptBtnId="apptNewApptFormFullApptInfoAddBtn";
    this.updtApptBtnId="apptNewApptFormFullApptInfoUpdtBtn";
    this.addApptSrvBtnId="apptNewApptFormFullApptInfoAddSrv";
    this.fullApptAddUser="apptNewApptFormFullUserAddUser"
    this.creatUserBtnId="contactsUserFormAddBtn";

    this.cntctPatt=new RegExp(/(contact\[|\])/,"g");
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
    pre: this.addApptBtnId, this.updtApptBtnId
    post: flip display updtApptBtn and addApptBtn
    change display of element
    ----------------------------------*/
    addUptBtnFlip(updt=false){
    let updtEl=document.getElementById(this.updtApptBtnId);
    let addEl=document.getElementById(this.addApptBtnId);
      if(updtEl&&addEl){
        updtEl.style.display=updt?"flex":"none";
        addEl.style.display=updt?"none":"flex";
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
    pre: button exists, createCustUser()
    post: db updated, cust user select udpated
    set event to Create User Button
    ----------------------------------*/
    hookElCreateUser(){
    let el=document.getElementById(this.creatUserBtnId);
      if(el){
        el.onclick=(e)=>{
        let els=document.querySelectorAll(this.userInfoFrmTA);
        let hsh={};
          els.forEach((nd, i)=>{
          let nm=nd.name.replace(/(contact\[|\])/g, "");
          hsh[nm]=nd.value;
          });

          if(Object.keys(hsh).length>0){
            createCustUser(hsh,(val)=>{
            //refresh users and customers list.
            this.users=getUsers();
            const {customer:customers, '':users}=spltUsr(this.users);
            this.usrHsh=arrOfHshToHshHsh('uuid',users);
            this.customers=[...customers];
            this.custHsh=arrOfHshToHshHsh('uuid',this.customers);
            //refresh select menus
            document.getElementById('apptNewApptFormFullUserLastName').innerHTML=genUsrSlct(this.customers,'surName','Last Name');
            document.getElementById('apptNewApptFormFullUserFirstName').innerHTML=genUsrSlct(this.customers,'fName','First Name');
            document.getElementById('apptNewApptFormFullUserEmail').innerHTML=genUsrSlct(this.customers,'cEmail', 'E-Mail');
            document.getElementById('apptNewApptFormFullUserPhone').innerHTML=genUsrSlct(this.customers,'phone','Phone');
            //sync the select menu
            this.syncSlctEls(this.slctIdArrFullForm,val||"");
            el.disabled=true;
            });
          }
        }
      }
      else{
      console.log(`Cannot find element with ID ${this.creatUserBtnId}.`);
      } 
    }

    /*----------------------------------
    pre: form exists.
    post: set event
    ----------------------------------*/
    hookUserInfoFrm(){
    let els=document.getElementsByClassName(this.userInfoFrmID);

      if(els&&els.length>0){
      let el=els[0];
        el.onkeyup=(e)=>{
          if(e&&e.target&&e.target.name){
          let nm=e.target.name.replace(this.cntctPatt,'');
          let phn=document.querySelectorAll('.apptNewApptFormFullUserFormFields textarea[name^="contact[phone]');
          let email=document.querySelectorAll('.apptNewApptFormFullUserFormFields textarea[name^="contact[email]');
          let fname=document.querySelectorAll('.apptNewApptFormFullUserFormFields textarea[name^="contact[fName]');
          let crtUsrBtn=document.getElementById(this.creatUserBtnId);
            if(crtUsrBtn&&phn&&phn.length>0&&phn[0].value&&email&&email.length>0&&email[0].value&&fname&&fname.length>0&&fname[0].value){
            crtUsrBtn.disabled=false;
            }
            else{
            crtUsrBtn.disabled=true;
            }
          }
        }
      }
    }

    /*----------------------------------
    pre: form exists.
    post: set event
    ----------------------------------*/
    hookAddApptBtn(){
    //this.addApptBtnId=
    let btn=document.getElementById(this.addApptBtnId);
      btn.onclick=(e)=>{
      //get data
      let onDt=document.getElementById("apptNewApptFormFullApptInfoOnDate");
      let byUser=document.getElementById("apptNewApptFormFullApptInfoByUser");
      let dur=document.getElementById("apptNewApptFormFullApptInfoDur");
      let stts=document.getElementById("apptNewApptFormFullApptStatus");
        if(byUser&&byUser.value&&this.usrAddedArr.length>0){
        createEvent(this.usrAddedArr[0],byUser.value,onDt?.value,dur?.value,null,stts?.value,this.invntSrvAddedArr,this.usrAddedArr);
        mainObj.setFloatMsg("Appointment Created");
        let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
          if(el){
          mainObj.modPrcClsCall(el);
          }
        }
      this.invntSrvAddedArr=[];
      this.usrAddedArr=[];
      this.genInvntSrvListEls();
      this.genUsrLstEls();
      this.enblAddApptBtn();

      document.getElementById('mainEl').innerHTML=this.genAppts();
      this.hookNewApptBtn();
      }
    }

    /*----------------------------------
    pre: this.updtApptBtnId
    post: sets event hooks
    update service button hook
    ----------------------------------*/
    hookUpdtApptBtn(){
    let btn=document.getElementById(this.updtApptBtnId);
      btn.onclick=(e)=>{
      let uuid=document.getElementById("apptNewApptFormFullApptInfoUUID");
      let onDt=document.getElementById("apptNewApptFormFullApptInfoOnDate");
      let byUser=document.getElementById("apptNewApptFormFullApptInfoByUser");
      let dur=document.getElementById("apptNewApptFormFullApptInfoDur");
      let stts=document.getElementById("apptNewApptFormFullApptStatus");
        if(uuid&&uuid.value&&byUser&&byUser.value&&this.usrAddedArr.length>0){

        updateEvent(uuid?.value,this.usrAddedArr[0],byUser.value,onDt?.value,null,dur?.value,null,stts?.value,this.invntSrvAddedArr,this.usrAddedArr);
        mainObj.setFloatMsg("Appointment Updated");
        let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
          if(el){
          mainObj.modPrcClsCall(el);
          }
        }
      this.invntSrvAddedArr=[];
      this.usrAddedArr=[];
      this.genInvntSrvListEls();
      this.genUsrLstEls();
      this.enblAddApptBtn();

      document.getElementById('mainEl').innerHTML=this.genAppts();
      this.hookNewApptBtn();
      }
    } 

    /*----------------------------------
    pre: 
    post:
    ----------------------------------*/
    cleanRghtModForm(){
    let onDt=document.getElementById("apptNewApptFormFullApptInfoOnDate");
      if(onDt){
      onDt.value=toInptValFrmt();
      }
    let byUser=document.getElementById('apptNewApptFormFullApptInfoByUser');
    let byUserType=document.getElementById('apptNewApptFormFullApptInfoByUserType');
      if(byUser){
      byUser.value=state.user.uuid;
        if(byUserType){
        byUserType.innerHTML=state.user.type;
        }
        else{
        byUserType.innerHTML="N/A";
        }
      }
    this.usrAddedArr=[];
    this.invntSrvAddedArr=[];
    this.genUsrLstEls();
    this.genInvntSrvListEls();
    }

    /*----------------------------------
    pre: apptAddBtn element exists, mainObj.modPrcClsCall()
    post: event hook added
    addes event hook to apptAddBtn element
    ----------------------------------*/
    hookNewApptBtn(){
      document.getElementById("apptAddBtn").onclick=(e)=>{
      this.addUptBtnFlip();

      this.cleanRghtModForm();

      let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      };
    }

    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
    this.hookNewApptBtn();
    this.hookAddSrvBtn();
    this.hookUpdtApptBtn();
    this.hookElSlctFullForm();
    this.hookElAddUserToUserLst();
    this.hookElCreateUser();
    this.hookUserInfoFrm();
    this.hookAddApptBtn();
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
    pre: this class
    post: right modal filled
    generates right modal content
    -----------------------------------------------*/
    fillRghtMod(appt){
    let users=selectEventUsers(appt.event_id);
    let invntSrv=selectEventInvntSrv(appt.event_id);

    this.usrAddedArr=users.map(e=>e.users_id);
    this.usrAddedArr[0]=appt.cust_uuid;
    this.invntSrvAddedArr=invntSrv.map(e=>e.invntSrv_id);

    this.genUsrLstEls();
    this.genInvntSrvListEls();
    let evntId=document.getElementById("apptNewApptFormFullApptInfoUUID");
      if(evntId){
      evntId.value=appt.event_id;
      }
    let dt=document.getElementById("apptNewApptFormFullApptInfoOnDate");
      if(dt){
      dt.value=appt.on_date;
      }
    let byUser=document.getElementById("apptNewApptFormFullApptInfoByUser");
      if(byUser){
      byUser.value=appt.byUser_uuid;
      }
    let byUserType=document.getElementById("apptNewApptFormFullApptInfoByUserType");
      if(byUserType&&this.usrHsh.hasOwnProperty(appt.byUser_uuid)){
      byUserType.innerHTML=this.usrHsh[appt.byUser_uuid].type;
      }
    let stts=document.getElementById("apptNewApptFormFullApptStatus");
      if(stts){
      stts.value=appt.status_id;
      }
    }

    /*-----------------------------------------------
    pre: none
    post: updates form
     
    -----------------------------------------------*/
    updtApptRghtMod(uuid=null){
      if(!uuid){
      return null;
      }
      if(this.apptsHsh.hasOwnProperty(uuid)&&this.apptsHsh[uuid]){
      this.apptsHsh[uuid];
      this.fillRghtMod(this.apptsHsh[uuid]);
      this.addUptBtnFlip(true);
      let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      }
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
          <div name="apptEdit" class="menuIcon" onclick=apptObj.updtApptRghtMod("`+appt.event_id+`"); title="Edit Appointment">`+getEvalIcon(iconSets, state.user.config.iconSet, 'edit')+`</div>
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
    genAppts(qStatus='active'){
    this.appts=selectViewEventUser('byUser_uuid',state.user.uuid,'on_date',false,qStatus);
    this.apptsHsh=arrOfHshToHshHsh('event_id',this.appts);
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
      this.enblAddApptBtn();
      }
    }
 
    /*-----------------------------------------------
    pre: this.invntSrvList filled
    post: none
    -----------------------------------------------*/
    genInvntSrvListEls(){
      let iSEls={...genInvntSrvListEls(this.invntSrvList,this.invntSrvAddedArr,'apptObj')};
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
      this.enblAddApptBtn();
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
    document.getElementById('apptNewApptFormFullUserPhone').innerHTML=genUsrSlct(this.customers,'phone','Phone');
    document.getElementById('apptNewApptFormFullApptInfoSrv').innerHTML=genInvntSrv(this.invntSrvList);
    document.getElementById('apptNewApptFormFullApptInfoByUser').innerHTML=genUsrSlct(users,'username','Username','uuid',state.user.uuid);
    this.hookUsrTyp();
    document.getElementById('apptNewApptFormFullApptInfoByUserType').innerHTML=state.user.type;
    this.statuses=selectStatus();
    document.getElementById('apptNewApptFormFullApptStatus').innerHTML=genSttsSlct(this.statuses);
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
    this.usrHsh=arrOfHshToHshHsh('uuid',users);
    this.customers=[...customers];
    this.custHsh=arrOfHshToHshHsh('uuid',this.customers);
    this.genRghtMod();
    this.hookEl();
    }
  }

var apptObj=new appt();
state.depModuleObjs['appt']=apptObj;
}
