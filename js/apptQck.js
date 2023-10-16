if(typeof apptQck==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
class to appointment events. Events DOESN'T HAVE TO BE APPOINTMENTS
-------------------------------------------*/
  class apptQck{
    constructor(apptId=null){
      if(state.pageVars&&!state.pageVars.appt){
      state.pageVars.appt={};
      }
    state.pageVars.appt.id=apptId;
    let dt=toInptValFrmt();
    this.invntSrvAddedArr=[];
    this.invntSrvList=null;
    this.lftModForm=`
    <div id="apptNewApptForm">
      <div class="lbl">Quick add new appointment</div>
      <div id="apptNewApptFormUser">
        <div id="apptNewApptFormUserSlct">
          <select id="apptNewApptFormUserLastName" name="contactSelect[surName]">
          </select>
          <select id="apptNewApptFormUserFirstName" name="contactSelect[fName]">
          </select>
          <select id="apptNewApptFormUserEmail" name="contactSelect[email]">
          </select>
          <select id="apptNewApptFormUserPhone" name="contactSelect[phone]">
          </select>
        </div>
        <div id="apptNewApptFormUserNew">
          <input id="apptNewApptFormUserNewUser" type="submit" value="New User" disabled />
        </div>
      </div>
      <div id="apptNewApptFormUserInfo">
        <div class="row">
          <textarea name="contact[surName]" type="text" placeholder="Last Name"></textarea>
          <textarea name="contact[mName]" type="text" style="width:60px;" placeholder="M."></textarea>
          <textarea name="contact[fName]" type="text" style="flex-grow: 100;" placeholder="First Name"></textarea>
        </div>
        <div class="row" style="margin-bottom: 6px;">
          <textarea name="contact[phone]" type="text" placeholder="phone"></textarea>
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
            <label for="apptNewApptFormApptInfoDur" title="Total Duration of All Services (in minutes)" style="margin-right:8px; border-width:0px;">Duration:</label>
            <input id="apptNewApptFormApptInfoDur" title="in minutes" type="number" name="event[duration]" max="999" min="1" placeholder="0" style="margin-right:0px;"/>
          </div>
        </div>
        <div class="row" style="justify-content:flex-start;">
          <select id="apptNewApptFormApptInfoSrv" name="event[invntSrv]">
            <option>service</option>
	        </select>
          <input id="apptNewApptFormApptInfoAddSrv" type="submit" value="Add Service"/>
        </div>
        <div class="row apptFormMultiBox">
          <div id="apptNewApptFormApptInfoSrvLstLbl" class="row apptFormMultiBoxLbl" title="Services Added">
          Services to be added
          </div>
          <div id="apptNewApptFormApptInfoSrvLst" class="row apptFormMultiBoxBox" title="Services Added">
          </div>
        </div>
        <div class="row" style="margin-bottom:24px;">
          <input id="apptNewApptFormApptInfoAddBtn" type="submit" value="Add Appointment" disabled/>
        </div>
      </div>
    </div>
    `;
    this.slctIdArr=["apptNewApptFormUserLastName","apptNewApptFormUserFirstName","apptNewApptFormUserEmail","apptNewApptFormUserPhone"];
    this.users=null;
    this.customers=null;
    this.custHsh=null;
    this.newUserBtnId="apptNewApptFormUserNewUser";
    this.userInfoFrmId="apptNewApptFormUserInfo";
    this.userInfoFrmSlct='#apptNewApptFormUserInfo textarea[name^="contact["]';
    this.addApptBtnId="apptNewApptFormApptInfoAddBtn";
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
    fills out "apptNewApptFormUserInfo"
    ----------------------------------*/
    syncUserInfo(val){
    const cust=this.custHsh[val];
    const els=document.querySelectorAll(this.userInfoFrmSlct);
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
            let btn=document.getElementById(this.newUserBtnId);
            btn.disabled=true;
            const addAppt=document.getElementById(this.addApptBtnId);
              if(addAppt){
              addAppt.disabled=e.target.value?false:true;
              }
            }
          }
        }
      }
    }

    /*----------------------------------
    pre:
    post:
    ----------------------------------*/
    hookElUserInfoBox(){
    let el=document.getElementById(this.userInfoFrmId);
      el.onkeydown=(e)=>{
      let btn=document.getElementById(this.newUserBtnId)
      btn.disabled=false;
      }
    }

    /*----------------------------------
    pre: left modal elements 
    post: sets event hooks
    sets the event hooks for the left modal
    ----------------------------------*/
    hookElLftMod(){
      //add new appointment
      document.getElementById(this.addApptBtnId).onclick=(e)=>{
      let cust=document.getElementById("apptNewApptFormUserLastName");
      let onDt=document.getElementById("apptNewApptFormApptInfoOnDate");
      let byUser=document.getElementById("apptNewApptFormApptInfoByUser");
      let dur=document.getElementById("apptNewApptFormApptInfoDur");
        if(cust&&byUser&&cust.value&&byUser.value){
        createEvent(cust.value,byUser.value,onDt?.value,dur?.value,null,this.invntSrvAddedArr);
        mainObj.setFloatMsg("Quick Appointment Created");
        let el=document.getElementById('lftMod').getElementsByClassName("close")[0];
          if(el){
          mainObj.modPrcClsCall(el);
          }
        }
        this.invntSrvAddedArr=[];
        if(state.pos=="appt"){
        state.depModuleObjs[state.pos].run();
        }
       
      }

      //add service to new appointment form
      document.getElementById("apptNewApptFormApptInfoAddSrv").onclick=(e)=>{
      let el=document.getElementById("apptNewApptFormApptInfoSrv");
      this.invntSrvAddedArr.push(el.value);
      this.genInvntSrvListEls();
      }
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
        <div class="multiBoxListItem">
          <div class="multiBoxListItemName">${this.invntSrvList[uuid].name}</div>
          <div class="multiBoxListItemDel" onclick='apptQckObj.delFromInvntSrvAddedArr("${uuid}");apptQckObj.genInvntSrvListEls();'>x</div>
        </div>
        `;
        total+=this.invntSrvList[uuid]&&Number.isFinite(this.invntSrvList[uuid].srv_durtn)?this.invntSrvList[uuid].srv_durtn:0;
        }
      document.getElementById("apptNewApptFormApptInfoSrvLst").innerHTML=html;
      document.getElementById("apptNewApptFormApptInfoDur").value=total;
      }
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
    pre: createCustUser()
    post: database updated
    add hook to the new user button
    -----------------------------------------------*/
    hookNewUserBtn(){
    let el=document.getElementById(this.newUserBtnId);
      el.onclick=(e)=>{
      let els=document.querySelectorAll(this.userInfoFrmSlct);
      let hsh={};
        els.forEach((nd, i)=>{
        let nm=nd.name.replace(/(contact\[|\])/g, "");
        hsh[nm]=nd.value;
        });

      //this.userInfoFrmSlct
        if(hsh){
          createCustUser(hsh,(val)=>{
          //refresh users and customers list.
          this.users=getUsers();
          const {customer:customers, '':users}=spltUsr(this.users);
          this.customers=[...customers];
          this.custHsh=arrOfHshToHshHsh('uuid',this.customers);
          //refresh select menus
          document.getElementById('apptNewApptFormUserLastName').innerHTML=genUsrSlct(customers,'surName','Last Name');
          document.getElementById('apptNewApptFormUserFirstName').innerHTML=genUsrSlct(customers,'fName','First Name');
          document.getElementById('apptNewApptFormUserEmail').innerHTML=genUsrSlct(customers,'cEmail', 'E-Mail');
          document.getElementById('apptNewApptFormUserPhone').innerHTML=genUsrSlct(customers,'phone','Phone');
          //sync the select menu
          this.syncSlctEls(this.slctIdArr,val||"");
          let btn=document.getElementById(this.newUserBtnId)
          btn.disabled=true;
          });
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
    this.invntSrvList=getInvntSrv();
    const {customer:customers, '':users}=spltUsr(this.users);
    this.customers=[...customers];
    this.custHsh=arrOfHshToHshHsh('uuid',this.customers);
    document.getElementById('lftMod').getElementsByClassName("content")[0].innerHTML=this.lftModForm;
    this.hookElLftMod();
    document.getElementById('apptNewApptFormUserLastName').innerHTML=genUsrSlct(customers,'surName','Last Name');
    document.getElementById('apptNewApptFormUserFirstName').innerHTML=genUsrSlct(customers,'fName','First Name');
    document.getElementById('apptNewApptFormUserEmail').innerHTML=genUsrSlct(customers,'cEmail', 'E-Mail');
    document.getElementById('apptNewApptFormUserPhone').innerHTML=genUsrSlct(customers,'phone','Phone');
    this.hookElSlct();
    document.getElementById('apptNewApptFormApptInfoSrv').innerHTML=genInvntSrv(this.invntSrvList);
    document.getElementById('apptNewApptFormApptInfoByUser').innerHTML=genUsrSlct(users,'username','Username','uuid',state.user.uuid);
    this.hookUsrTyp();
    document.getElementById('apptNewApptFormApptInfoByUserType').innerHTML=state.user.type;
    this.hookElUserInfoBox();
    this.hookNewUserBtn();
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){
    this.genLftMod();
    }
  }

var apptQckObj=new apptQck();
state.depModuleObjs['apptQck']=apptQckObj;
}
