if(typeof invcs==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
manage inventory and services
-------------------------------------------*/
  class invcs{
    constructor(){

    this.invcsList=null;
    this.invcsListHsh=null;
//CREATE TABLE invcs_items(uuid text not null primary key, type_id text null, invntSrv_id text null, ord int null, name text not null, price real, price_type_id text null, notes null, foreign key(invntSrv_id) references invntSrv(uuid), foreign key(type_id) references type(uuid), foreign key(price_type_id) references type(uuid));
    //this.invcsNewItemsList=null;
    this.statuses=null;
    this.statusStr=null;
    this.types=null;
    this.typesHsh=null;
    this.typesIdHsh=null;
    this.fltrStr=null;
    this.users=null;
    this.customers=null;
    this.invntSrvItems=null;
    this.sortCol='create_date';
    this.sortColDir='desc';
    this.invcsNewApptId=null;
    this.invcsNewFrmId='invcsNewForm';

    this.tmpl={};
    this.tmpl.headers=`
      <div id="invcAdd" class="moduleAdd">
        <div id="invcAddBtn" class="moduleAddBtn" title="New Invoice" tabindex=0>⨁</div>
      </div>
      <div id="invcFltr" class="fltrRow">
        <div id="invcFltrInptWrap" class="fltrRowCell">
          <input id="invcFltrInpt" name="invcFilter[input]" class="fltrInpt" type="text" placeholder="Filter by name, price, amnts, duration, sku" title="Filter by name, price, amnts, duration, sku"/>
        </div>
        <div class="">
          <div class="fltrRowCellLbl">
          Status Filter:
          </div>
          <select id="invcFilterStatus" name="invcFilter[status]" class="fltrSlct" title="Status Filter">
          <option>all</option>
          </select>
        </div>
      </div>
      <div id="invcMain" class="moduleTblMain">
      </div>
    `;

    this.tmpl.invcsTblStrt=`
        <table id="invcsList">
          <tr>
    `;
    this.tmpl.invcsTblHdCll=[];
    this.tmpl.invcsTblHdCll[0]=`
          <th>
    `;
    this.tmpl.invcsTblHdCll[1]=`
          </th>
    `;

    //<div class="tblHdSrt ##pntClass##" tabindex=0 name="##hdrNm##" onclick="apptObj.setColSrtHookFunc(event)">
    this.tmpl.invcsTblHdCllIcn=`
            <div class="tblHdSrt ##pntClass##" tabindex=0 name="##hdrNm##" onclick="invcsObj.setColSrtHookFunc(this)">
              <div>##hdrTtl##</div>
              <div class="tblHdSrtArrw" title="sort via ##hdlTtl">##icon##</div>
            </div>
    `;
    this.tmpl.invcsTblHdEnd=`
          </tr>
    `;
    this.tmpl.invcsTblEnd=`
        </table>
    `;

    this.tmpl.invcsNewItemsTbl={};

    this.tmpl.invcsNewItemsTbl['tableStart']=`
      <table>
        <tr>
    `;

    this.tmpl.invcsNewItemsTbl['headStart']=`
          <th>
    `;

    this.tmpl.invcsNewItemsTbl['headEnd']=`
          </th>
    `;

    this.tmpl.invcsNewItemsTbl['tableEnd']=`
      </tr>
    </table>
    `;

    this.tmpl.invcsTblHdArr=[
    {'name':'create_date','title':'created date', 'sort':true},
    {'name':'due_date','title':'due date', 'sort':true},
    {'name':'event_info','title':'appt.', 'sort':true},
    {'name':'forUser_fName','title':'f. name', 'sort':true},
    {'name':'forUser_surName','title':'surname', 'sort':true},
    {'name':'forUser_email','title':'email', 'sort':true},
    {'name':'status_name','title':'status', 'sort':true},
    {'name':'total','title':'total', 'sort':true},
    {'name':'total_paid','title':'amnt paid', 'sort':true},
    {'name':'actions','title':'actions', 'sort':false}
    ];

    this.fltrProps=['forUser_email','forUser_fName', 'forUser_surName'];

    this.mainTblId='invcMain';
    }

    /*-----------------------------------------------
    pre: none
    post: draws top left nav
    draws top left nav
    -----------------------------------------------*/
    genLeftNav(){
    return "Invoices";
    }

    /*-----------------------------------------------
    pre: none
    post: none 
    -----------------------------------------------*/
    repopInvcsListHsh(){
    this.invcsListHsh={};
      for(let invcs of this.invcsList){
      this.invcsListHsh[invcs.uuid]=invcs;
      }
    }

    /*-----------------------------------------------
    pre: this.invcsList
    post: none
    returns invoices with sorting
    -----------------------------------------------*/
    getInvcsList(rehsh=true){
    let pObj={};
      if(this.statusStr){
      pObj['invcs_status_id']=this.statusStr;
      }

    this.invcsList=getInvcs(pObj,this.sortCol,this.sortColDir);
      if(rehsh){
      this.repopInvcsListHsh();
      }
    return this.invcsList;
    }

    /*----------------------------------
    pre: invntSrvFilterStatus element
    post: event hook added
    addes event hook to invntSrvFilterStatus element
    ----------------------------------*/
    hookFltrStts(){
      document.getElementById("invcFilterStatus").onchange=(e)=>{
      this.statusStr=e.target.value!='null'?e.target.value:null;
      this.drawTbl();
      }
    }

    /*-----------------------------------------------
    pre: el.id="invcsNewFormAddBtn"
    post: element's disable moved or removed.
    flips or set disable on create/update button
    -----------------------------------------------*/
    flipNewInvcsBtn(btn='create', dsbl=null){
    //invcsNewFormAddBtn
    let el=null;
      if(!btn){
      return null;
      }
      if(btn=='create'){
      el=document.getElementById("invcsNewFormAddBtn");
      }
      else if(btn=='update'){
      el=document.getElementById("invcsNewFormUpdtBtn");
      }
      
      if(dsbl===null){
      el.disabled=!el.disabled
      return null;
      }

      if(dsbl===true){
      el.disabled=true;
      return null;
      }

      if(dsbl===false){
      el.removeAttribute('disabled');
      return null;
      }
    }

    /*-----------------------------------------------
    pre: none
    post: none
    generate status dropdown
    -----------------------------------------------*/
    genSttsSlct(){
    let html=genSttsSlct(this.statuses);
    return html;
    }

    /*-----------------------------------------------
    pre: none
    post: none
    generate status dropdown
    -----------------------------------------------*/
    genFltrSttsSlct(){
    let tmpStts=[...this.statuses];
    tmpStts.unshift({'uuid':'null','name':'all'});
    let html=genSttsSlct(tmpStts);
    return html;
    }

    /*-----------------------------------------------
    pre: this.fillRghtMod() 
    post: html drawn
    -----------------------------------------------*/
    updtInvcsRghtMod(uuid=null){
      if(!uuid||!this.invcsListHsh.hasOwnProperty(uuid)){
      return null;
      }
    //this.invcsNewApptId=uuid;
    //fill right mod
    this.rghtMod(uuid,null,true);
    //this.fillRghtMod(uuid);
    //this.flipNewInvcsBtn('update', false);
    //this.flipCrtUpdtBtn('update');
    }

    /*-----------------------------------------------
    pre: this.invcsList
    post: none
    returns filter invoices
    -----------------------------------------------*/
    fltrInvcs(){
      if(!this.fltrStr){
      return this.invcsList;
      }

    let invcsArr=[];
      for(let invcs of this.invcsList){
        for(let prop of this.fltrProps){
          if(invcs[prop]&&invcs[prop].toString().toLocaleLowerCase().search(this.fltrStr.toLocaleLowerCase())>=0){
          invcsArr.push({...invcs});
          break;
          }
        }
      }

    return invcsArr;
    }

    /*-----------------------------------------------
    pre: invcsLib
    post: database updated
    updates the database for that invoice and status
    -----------------------------------------------*/
    updtInvcsStts(uuid=null, stts=null){
      if(!uuid||!stts){
      return null;
      }

      if(updtInvcs(uuid, {'status_name':stts})){
      this.drawTbl();
      }
      else{
      mainObj.setFloatMsg(`updating invoice failed. `);
      }
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
    this.drawTbl();
    }

    /*----------------------------------
    pre:this.sortCol,this.sortColDir
    post:figure out sorting and sets variables
    function to set proper variables
    ----------------------------------*/
    setColSrt(srt){
      if(this.sortCol!=srt){
      this.sortCol=srt;
      this.sortColDir="asc";
      return null;
      }

      this.sortColDir=this.sortColDir=="desc"?"asc":"desc";
    }

    /*----------------------------------
    pre: this.rghtModForm 
    post: none
    generates right modal content
    ----------------------------------*/
    rghtMod(invcsId=null,apptId=null,updt){
      invcsRghtModObj.popRghtMod(invcsId, apptId,updt);
      mainObj.modRghtOpenClose();
    }

    /*----------------------------------
    pre: apptAddBtn element exists, mainObj.modRghtOpenClose()
    post: event hook added
    addes event hook to apptAddBtn element
    ----------------------------------*/
    hookNewInvntBtn(){
      document.getElementById("invcAddBtn").onclick=(e)=>{
      //this.clearRghtMod();
      //mainObj.modRghtOpenClose();
      this.rghtMod();
      };
    }

    /*----------------------------------
    pre: invntSrvFltrInptWrap element
    post: event hook added
    addes event hook to invntSrvFltrInptWrap element
    ----------------------------------*/
    hookFltrInpt(){
      //why the wrapper and not the input itself? Keyup/down/press is fired BEFORE the input value is set by the key press. The event bubbles up AFTER the input value is pressed
      document.getElementById("invcFltrInpt").onkeyup=(e)=>{
      this.fltrStr=e.target.value;
      this.drawTbl();
      };
    }


    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
    this.hookNewInvntBtn();
    this.hookFltrStts();
    this.hookFltrInpt();
    }


    /*-----------------------------------------------
    pre: none
    post: inventory/service drawn
    draws table
    -----------------------------------------------*/
    drawTbl(){
    let rtrn='';
    let hdrs='';

      for(let hdr of this.tmpl.invcsTblHdArr){
      //function sortTblHdrTmplng(tmpl, obj, sortDir, srtClss='tblHdSrtPnt')
      hdrs+=this.tmpl.invcsTblHdCll[0]+sortTblHdrTmplng(this.tmpl.invcsTblHdCllIcn,hdr,this.sortCol==hdr.name?this.sortColDir:null)+this.tmpl.invcsTblHdCll[1];
      }

    this.getInvcsList(false);
    let invcsArr=this.fltrInvcs();
    this.repopInvcsListHsh();


    let cntnt='';
      for(let invcs of invcsArr){
      let evnt=invcs.event_on_date||'';
        cntnt+=`
        <tr>
          <td>`+invcs.create_date+`</td>
          <td>`+invcs.due_date+`</td>
          <td>`+evnt+`</td>
          <td>`+invcs.forUser_fName+`</td>
          <td>`+invcs.forUser_surName+`</td>
          <td>`+invcs.forUser_email+`</td>
          <td>`+statusColor(invcs.status_name)+`</td>
          <td>`+invntSrvPrcFormat(Number(invcs.total).toString(),"static")+`</td>
          <td>`+invntSrvPrcFormat(Number(invcs.total_paid).toString(),"static")+`</td>
          <td>
            <div class="moduleTblCellActns">
              <div name="invcsEdit" class="menuIcon" onclick=invcsObj.updtInvcsRghtMod("`+invcs.uuid+`"); title="Edit Invoice">`+getEvalIcon(iconSets, state.user.config.iconSet, 'edit')+`</div>
              <div name="invcsDisable" class="menuIcon" onclick=invcsObj.updtInvcsStts("`+invcs.uuid+`","done"); title="Mark Invoice as Done">`+getEvalIcon(iconSets, state.user.config.iconSet, 'done')+`</div>
              <div name="invcsDisable" class="menuIcon" onclick=invcsObj.updtInvcsStts("`+invcs.uuid+`","disabled"); title="Mark Invoice as Cancelled">`+getEvalIcon(iconSets, state.user.config.iconSet, 'disable')+`</div>
            </div>
          </td>
        </tr>
        `;
      }
    rtrn+=this.tmpl.invcsTblStrt+hdrs+this.tmpl.invcsTblHdEnd+cntnt+this.tmpl.invcsTblEnd;
    document.getElementById(this.mainTblId).innerHTML=rtrn;
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    draw basics to page mainEl
    -----------------------------------------------*/
    mainEl(){
    let html=this.tmpl.headers;
    return html;
    }


    /*-----------------------------------------------
    pre:
    post:
    -----------------------------------------------*/
    run(){
    this.statuses=selectStatus();
    let actveStts=this.statuses.find((e)=>{return e.name=="active"});
      //set the initial this.statusStr
      if(actveStts){
      this.statusStr=actveStts.uuid;
      }
    this.types=selectType('invntSrv');
    this.typesHsh=sepTypesHsh(this.types);
    this.typesIdHsh=sepTypesIdHsh(this.types);
    document.getElementById('leftNavMod').innerHTML=this.genLeftNav();
    document.getElementById('mainEl').innerHTML=this.mainEl();
    this.drawTbl();
    document.getElementById('invcFilterStatus').innerHTML=this.genFltrSttsSlct();
    this.hookEl();
      //hook for when appointment module redirects and has an id set
      if(state.pageVars.hasOwnProperty('appt')&&state.pageVars.appt.id!==null){
      this.rghtMod(null, state.pageVars.appt.id);
      }
    }
  }

var invcsObj=new invcs();
state.depModuleObjs['invcs']=invcsObj;
}
