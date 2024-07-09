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
    this.tmpl.headers=`
      <div id="apptAdd" class="moduleAdd">
        <div id="apptAddBtn" class="moduleAddBtn" title="Add New Appointment" tabindex=0>⨁</div>
      </div>
      <div id="apptFltr" class="fltrRow">
        <div id="apptFltrInptWrap" class="fltrRowCell">
          <input id="apptFltrInpt" name="apptFilter[input]" class="fltrInpt" type="text" placeholder="Customer Info Filter. Ex. Smith" title="Customer Info Filter"/>
        </div>
        <div class="">
          <div class="fltrRowCellLbl">
          Status Filter:
          </div>
          <select id="apptFilterStatus" name="apptFilter[status]" class="fltrSlct" title="Status Filter">
          <option>all</option>
          </select>
        </div>
      </div>
      <div id="apptMain" class="moduleTblMain">
      </div>
    `;
    this.tmpl.apptTblStrt=`
        <table id="apptList">
          <tr>
    `;
    this.tmpl.apptTblHdCll=[];
    this.tmpl.apptTblHdCll[0]=`
          <th>
    `;
    this.tmpl.apptTblHdCll[1]=`
          </th>
    `;
    //<div class="tblHdSrt ##pntClass##" tabindex=0 name="##hdrNm##" onclick="apptRghtModObj.setColSrtHookFunc(event)">
    this.tmpl.apptTblHdCllIcn=`
            <div class="tblHdSrt ##pntClass##" tabindex=0 name="##hdrNm##" onclick="apptObj.setColSrtHookFunc(this)">
              <div>##hdrTtl##</div>
              <div class="tblHdSrtArrw" title="sort via ##hdlTtl">##icon##</div>
            </div>
    `;
    this.tmpl.apptTblHdEnd=`
          </tr>
    `;
    this.tmpl.apptTblEnd=`
        </table>
    `;
    this.tmpl.apptTblHdArr=[
    {'name':'on_date','title':'on date', 'sort':true},
    {'name':'status','title':'status', 'sort':true},
    {'name':'cust_info','title':'cust. info', 'sort':false},
    {'name':'cust_status_name','title':'cust. status', 'sort':true},
    {'name':'create_date','title':'create date', 'sort':true},
    {'name':'done_date','title':'done date', 'sort':true},
    {'name':'duration','title':'duration', 'sort':true},
    {'name':'actions','title':'actions', 'sort':false}
    ];
    this.tmpl["invntSrvListEls"]=[];
    this.usrAddedArr=[];
    this.invntSrvAddedArr=[];
    this.invntSrvList=null;
    this.users=null;
    this.usrHsh=null;
    this.customers=null;
    this.custHsh=null;
    this.appts=null;
    this.apptsHsh=null;
    this.statuses=null;
    this.sttsHsh=null;
    this.sortCol='on_date';
    this.sortColDir='desc';
    this.fltrStr=null;
    this.fltrProps=['cust_email','cust_phone','cust_cellphone','cust_surName','cus_firstName','cust_username','cust_nickName']; //filter properties
    this.fltrStts=null;

    this.cntctPatt=new RegExp(/(contact\[|\])/,"g");
    }


    /*----------------------------------
    pre:this.sortCol,this.sortColDir
    post:figure out sorting and sets variables
    function to set proper variables
    ----------------------------------*/
    setColSrt(srt){
      if(this.sortCol!=srt){
      this.sortCol=srt;
      this.sortColDir="desc";
      return null;
      }

      this.sortColDir=this.sortColDir=="desc"?"asc":"desc";
    }

    /*----------------------------------
    pre:this.setColSrt()
    post:none
    function to set to hook for table header sort
    ----------------------------------*/
    setColSrtHookFunc(e){
    let nm=e.getAttribute("name");
      if(nm){
      this.setColSrt(nm);
      }
    this.reDrwAppts();
    }

    /*----------------------------------
    pre: this.sortColDir, this.sortCol, this.fltrStr, this.appts, this.customers
    post:none.
    takes this.appts and sort and/or filter appointments by this.sortColDir, this.sortCol and this.fltrStr
    ----------------------------------*/
    fltrAppts(){
    let appts=[];
      if(this.fltrStr){
        for(let appt of this.appts){
          if(appt.status==this.fltrStts){
          appts.push({...appt});
          break;
          }
          for(let prop of this.fltrProps){
            if(appt[prop]&&appt[prop].toLocaleLowerCase().search(this.fltrStr.toLocaleLowerCase())>=0){
            appts.push({...appt});
            break;
            }
          }
        }
      }
      else{
      appts=[...this.appts];
      }
    return appts; 
    }    

    /*----------------------------------
    pre: select elements
    post: change sync select elements
    changes all select elements in array to select a value
    ----------------------------------*/
    updtEvntStts(uuid, stts){
      if(!uuid||!stts){
      return null;
      }
    updateEventStatus(uuid,stts);
    mainObj.setFloatMsg(`Appointment Status Updated to "${stts}"`);
    this.reDrwAppts();
    }

    /*----------------------------------
    pre: this.rghtModForm 
    post: none
    generates right modal content
    ----------------------------------*/
    apptRghtMod(id=null){
      apptRghtModObj.popRghtMod(id);
      mainObj.modRghtOpenClose();
    }

    /*----------------------------------
    pre: apptAddBtn element exists, mainObj.modRghtOpenClose();
    post: event hook added
    addes event hook to apptAddBtn element
    ----------------------------------*/
    hookNewApptBtn(){
      document.getElementById("apptAddBtn").onclick=(e)=>{
      this.apptRghtMod();
      };
    }

    /*----------------------------------
    pre: apptFltrInptWrap element
    post: event hook added
    addes event hook to apptFltrInptWrap element
    ----------------------------------*/
    hookFltrInpt(){
      //why the wrapper and not the input itself? Keyup/down/press is fired BEFORE the input value is set by the key press. The event bubbles up AFTER the input value is pressed
      document.getElementById("apptFltrInptWrap").onkeyup=(e)=>{
      this.fltrStr=e.target.value;
      this.reDrwAppts(); 
      };
    }

    /*----------------------------------
    pre: apptFilterStatus element
    post: event hook added
    addes event hook to apptFilterStatus element
    ----------------------------------*/
    hookFltrStts(){
      document.getElementById("apptFilterStatus").onchange=(e)=>{
      this.fltrStts=e.target.value;
      this.reDrwAppts(); 
      }
    }

    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
    this.hookNewApptBtn();
    this.hookFltrInpt();
    this.hookFltrStts();
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
    this.genInvntSrvListEls(appt.duration);
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
      stts.value=appt.status_uuid;
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
      /*
      if(this.apptsHsh.hasOwnProperty(uuid)&&this.apptsHsh[uuid]){
      this.apptsHsh[uuid];
      this.fillRghtMod(this.apptsHsh[uuid]);
      this.addUpdtBtnFlip(true);
      mainObj.modRghtOpenClose();
      }
      */
      this.apptRghtMod(uuid);
    }

    /*-----------------------------------------------
    pre: this.appts
    post: none
    generates the HTML table for the mainEl()
    -----------------------------------------------*/
    drawApptMainEl(){
    let rtrn='';
    let cntnt='';
    let appts=this.fltrAppts();
      for(const appt of appts){
      let doneDate=appt.done_date||'';
      cntnt+=`
      <tr>
        <td>`+appt.on_date+`</td>
        <td>`+statusColor(appt.status)+`</td>
        <td>`+appt.cust_fName+` `+appt.cust_surName+`<br><br>`+appt.cust_email+`<br>`+appt.cust_phone+`<br>`+appt.cust_cellphone+`</td>
        <td>`+statusColor(appt.cust_status_name)+`</td>
        <td>`+appt.create_date+`</td>
        <td>`+doneDate+`</td>
        <td>`+appt.duration+`</td>
        <td>
          <div class="moduleTblCellActns">
            <div name="apptEdit" class="menuIcon" onclick=apptObj.apptRghtMod("`+appt.event_id+`"); title="Edit Appointment">`+getEvalIcon(iconSets, state.user.config.iconSet, 'edit')+`</div>
            <div name="apptDone" class="menuIcon" onclick=apptObj.updtEvntStts("`+appt.event_id+`","done"); title="Mark Appoint As Done">`+getEvalIcon(iconSets, state.user.config.iconSet, 'done')+`</div>
            <div name="apptDoneInvcs" class="menuIcon" onclick=(function(){state.pageVars.appt.id="`+appt.event_id+`"})();apptObj.updtEvntStts("`+appt.event_id+`","done");mainObj.setState("pos","invcs"); title="Mark Appoint As Done And Generate Invoice">`+getEvalIcon(iconSets, state.user.config.iconSet, 'receipt')+`</div>
            <div name="apptCancel" class="menuIcon" onclick=apptObj.updtEvntStts("`+appt.event_id+`","cancelled"); title="Mark Appoint As Cancelled">`+getEvalIcon(iconSets, state.user.config.iconSet, 'cancel')+`</div>
          </div>
        </td>
      </tr>
      `;
      }

    let hdrs='';
      for(let hdr of this.tmpl.apptTblHdArr){
      //function sortTblHdrTmplng(tmpl, obj, sortDir, srtClss='tblHdSrtPnt')
      hdrs+=this.tmpl.apptTblHdCll[0]+sortTblHdrTmplng(this.tmpl.apptTblHdCllIcn,hdr,this.sortCol==hdr.name?this.sortColDir:null)+this.tmpl.apptTblHdCll[1];
      }
    rtrn+=this.tmpl.apptTblStrt+hdrs+this.tmpl.apptTblHdEnd+cntnt+this.tmpl.apptTblEnd;
    return rtrn;
    }

    /*-----------------------------------------------
    pre: selectViewEventUser(), drawApptMainEl(), getEvalIcon()
    post: html updated with appt
    set mainEl with appointments
    -----------------------------------------------*/
    genAppts(){
    let pObj={'byUser_uuid':state.user.uuid};
      if(this.fltrStts!=='null'){
      pObj['status_uuid']=this.fltrStts;
      }
//function selectViewEventUser(paramObj, ord, desc=false, limit=null, offset=null){
    this.appts=selectViewEventUser(pObj,this.sortCol,this.sortColDir=='desc');
    this.apptsHsh=arrOfHshToHshHsh('event_id',this.appts);
    return this.drawApptMainEl();
    }

    /*-----------------------------------------------
    pre: element#apptFilterStatus, this.statuses
    post: html updated with appt
    set mainEl with appointments
    -----------------------------------------------*/
    genFltrSttsSlct(){
    let tmpStts=[...this.statuses];
    tmpStts.unshift({'uuid':'null','name':'all'});
    let html=genSttsSlct(tmpStts);
    return html;
    }


    /*-----------------------------------------------
    pre: mainEl, genAppts(), hookNewApptBtn();
    post: html updated with apt
    wrapper to do genAppts() then the hook as it's getting done mulitple places
    -----------------------------------------------*/
    reDrwAppts(){
    document.getElementById('apptMain').innerHTML=this.genAppts();
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
    genInvntSrvListEls(dur=null){
    let iSEls={...genInvntSrvListEls(this.invntSrvList,this.invntSrvAddedArr,'apptObj')};
    document.getElementById("apptNewApptFormFullApptInfoSrvLst").innerHTML=iSEls.html;
    document.getElementById("apptNewApptFormFullApptInfoDur").value=dur?dur:iSEls.total;
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
    this.users=getUsers();
    
    this.invntSrvList=getInvntSrv();
    const {customer:customers, '':users}=spltUsr(this.users);
    this.usrHsh=arrOfHshToHshHsh('uuid',users);
    this.customers=[...customers];
    this.custHsh=arrOfHshToHshHsh('uuid',this.customers);
    this.statuses=selectStatus();
    this.sttsHsh=arrOfHshToHshHsh('name',this.statuses);
    this.fltrStts=this.sttsHsh.hasOwnProperty('active')?this.sttsHsh['active'].uuid:null;
    document.getElementById('mainEl').innerHTML=this.tmpl.headers;
    document.getElementById('apptFilterStatus').innerHTML=this.genFltrSttsSlct();
    this.reDrwAppts();
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavAppt();
    this.hookEl();
    }
  }

var apptObj=new appt();
state.depModuleObjs['appt']=apptObj;
}
