if(typeof invntSrv==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
manage inventory and services
-------------------------------------------*/
  class invntSrv{
    constructor(){
    this.tmpl={};
    this.invntSrvList=null;
    this.tmpl.headers=`
      <div id="invntSrvAdd" class="moduleAdd">
        <div id="invntSrvAddBtn" class="moduleAddBtn" title="Add New Appointment" tabindex=0>⨁</div>
      </div>
      <div id="invntSrvFltr" class="fltrRow">
        <div id="invntSrvFltrInptWrap" class="fltrRowCell">
          <input id="invntSrvFltrInpt" name="invntSrvFilter[input]" class="fltrInpt" type="text" placeholder="Inventory/Service Name Filter"/>
        </div>
        <div class="">
          <div class="fltrRowCellLbl">
          Status Filter:
          </div>
          <select id="invntSrvFilterStatus" name="invntSrvFilter[status]" class="fltrSlct" title="Status Filter">
          <option>all</option>
          </select>
        </div>
        <div class="">
          <div class="fltrRowCellLbl">
          Type Filter:
          </div>
          <select id="invntSrvFilterType" name="invntSrvFilter[type]" class="fltrSlct" title="Type Filter">
          <option>all</option>
          </select>
        </div>
      </div>
      <div id="invntSrvMain" class="moduleTblMain">
      </div>
    `;
    this.tmpl.invntSrvTblStrt=`
        <table id="invntSrvList">
          <tr>
    `;
    this.tmpl.invntSrvTblHdCll=[];
    this.tmpl.invntSrvTblHdCll[0]=`
          <th>
    `;
    this.tmpl.invntSrvTblHdCll[1]=`
          </th>
    `;
    this.tmpl.invntSrvTblHdArr=[
    {'name':'create_date','title':'created date', 'sort':true},
    {'name':'mod_date','title':'mod date', 'sort':true},
    {'name':'name','title':'name', 'sort':true},
    {'name':'type','title':'type', 'sort':true},
    {'name':'status_name','title':'status', 'sort':true},
    {'name':'srv_duration','title':'duration', 'sort':true},
    {'name':'amnt','title':'amnt', 'sort':true},
    {'name':'buy','title':'buy price', 'sort':true},
    {'name':'sell','title':'sell price', 'sort':true},
    {'name':'actions','title':'actions', 'sort':false}
    ];
    //<div class="tblHdSrt ##pntClass##" tabindex=0 name="##hdrNm##" onclick="apptObj.setColSrtHookFunc(event)">
    this.tmpl.invntSrvTblHdCllIcn=`
            <div class="tblHdSrt ##pntClass##" tabindex=0 name="##hdrNm##" onclick="invntSrvObj.setColSrtHookFunc(this)">
              <div>##hdrTtl##</div>
              <div class="tblHdSrtArrw" title="sort via ##hdlTtl">##icon##</div>
            </div>
    `;
    this.tmpl.invntSrvTblHdEnd=`
          </tr>
    `;
    this.tmpl.invntSrvTblEnd=`
        </table>
    `;

    this.mainTblId="invntSrvMain";
    this.sortCol="name";
    this.sortColDir="asc";
    this.typeStr=null;
    this.statusStr=null;
    this.statuses=null;
    this.types=null;
    this.fltrStr=null;
    }

    /*-----------------------------------------------
    pre: none
    post: draws top left nav
    draws top left nav
    -----------------------------------------------*/
    genLeftNavInvntSrv(){
    return "Inventory/Service";
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
    pre: none
    post: none
    generate type dropdown
    -----------------------------------------------*/
    genFltrTypeSlct(){
    let tmpStts=[...this.types.filter(e=>e.col=='')];
    tmpStts.unshift({'uuid':'null','name':'all'});
    let html=genSttsSlct(tmpStts,null,'all');
    return html;
    }

    /*----------------------------------
    pre: invntSrvFilterStatus element
    post: event hook added
    addes event hook to invntSrvFilterStatus element
    ----------------------------------*/
    hookFltrStts(){
      document.getElementById("invntSrvFilterStatus").onchange=(e)=>{
      this.statusStr=e.target.value!='null'?e.target.value:null;
      this.drawTbl();
      }
    }

    /*----------------------------------
    pre: invntSrvFilterType element
    post: event hook added
    addes event hook to invntSrvFilterType element
    ----------------------------------*/
    hookFltrTyp(){
      document.getElementById("invntSrvFilterType").onchange=(e)=>{
      this.typeStr=e.target.value!='null'?e.target.value:null;
      this.drawTbl();
      }
    }

    /*----------------------------------
    pre: invntSrvFltrInptWrap element
    post: event hook added
    addes event hook to invntSrvFltrInptWrap element
    ----------------------------------*/
    hookFltrInpt(){
      //why the wrapper and not the input itself? Keyup/down/press is fired BEFORE the input value is set by the key press. The event bubbles up AFTER the input value is pressed
      document.getElementById("invntSrvFltrInptWrap").onkeyup=(e)=>{
      this.fltrStr=e.target.value;
      this.drawTbl();
      };
    }

    /*----------------------------------
    pre:
    post:
    ----------------------------------*/
    fltrInvntSrvs(){
    let invntSrvs=[];
      if(this.fltrStr){
        for(let invntSrv of this.invntSrvList){
          if(invntSrv.name.toLocaleLowerCase().search(this.fltrStr.toLocaleLowerCase())>=0){
          invntSrvs.push({...invntSrv});
          }
        }
      }
      else{
      invntSrvs=[...this.invntSrvList];
      }
    return invntSrvs;
    }

    /*-----------------------------------------------
    pre: none
    post: inventory/service drawn
    draws table
    -----------------------------------------------*/
    drawTbl(){
    let rtrn='';
    let hdrs='';
      //generate header
      for(let hdr of this.tmpl.invntSrvTblHdArr){
      //function sortTblHdrTmplng(tmpl, obj, sortDir, srtClss='tblHdSrtPnt')
      hdrs+=this.tmpl.invntSrvTblHdCll[0]+sortTblHdrTmplng(this.tmpl.invntSrvTblHdCllIcn,hdr,this.sortCol==hdr.name?this.sortColDir:null)+this.tmpl.invntSrvTblHdCll[1];
      }
    let pObj={};
      if(this.statusStr){
      pObj['status']=this.statusStr;
      }

      if(this.typeStr){
      pObj['type_id']=this.typeStr;
      }

    this.invntSrvList=getInvntSrvArr(pObj,this.sortCol,this.sortColDir);
    let invntSrvList=this.fltrInvntSrvs();
    let cntnt='';
      for(let invntSrv of invntSrvList){
      let dur=invntSrv.srv_durtn||'0';
      let buyType=invntSrv.type?'service':null;
      cntnt+=`
      <tr>
        <td>`+invntSrv.create_date+`</td>
        <td>`+invntSrv.mod_date+`</td>
        <td>`+invntSrv.name+`</td>
        <td>`+invntSrv.type+`</td>
        <td>`+statusColor(invntSrv.status_name)+`</td>
        <td>`+dur+`</td>
        <td>`+invntSrv.amnt+`</td>
        <td>`+invntSrvPrcFormat(invntSrv.buy,buyType)+`</td>
        <td>`+invntSrvPrcFormat(invntSrv.sell,invntSrv.price_type_name)+`</td>
        <td>
          <div class="moduleTblCellActns">
            <div name="invntSrvEdit" class="menuIcon" onclick=invntSrvObj.updtApptRghtMod("`+invntSrv.uuid+`"); title="Edit Appointment">`+getEvalIcon(iconSets, state.user.config.iconSet, 'edit')+`</div>
            <div name="invntSrvDone" class="menuIcon" onclick=invntSrvObj.updtEvntStts("`+invntSrv.uuid+`","done"); title="Mark Appoint As Done">`+getEvalIcon(iconSets, state.user.config.iconSet, 'done')+`</div>
            <div name="invntSrvCancel" class="menuIcon" onclick=invntSrvObj.updtEvntStts("`+invntSrv.uuid+`","cancelled"); title="Mark Appoint As Cancelled">`+getEvalIcon(iconSets, state.user.config.iconSet, 'cancel')+`</div>
            <div name="invntSrvDisable" class="menuIcon" onclick=invntSrvObj.updtEvntStts("`+invntSrv.uuid+`","disabled"); title="Disable Appointment">`+getEvalIcon(iconSets, state.user.config.iconSet, 'disable')+`</div>
          </div>
        </td>
      </tr>
      `;
      }

    //rtrn+=this.tmpl.invntSrvTblStrt+hdrs+this.tmpl.invntSrvTblHdEnd+cntnt+this.tmpl.invntSrvTblEnd;
    rtrn+=this.tmpl.invntSrvTblStrt+hdrs+this.tmpl.invntSrvTblHdEnd+cntnt+this.tmpl.invntSrvTblEnd;

    document.getElementById(this.mainTblId).innerHTML=rtrn;
    }
  

    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
    this.hookFltrStts();
    this.hookFltrTyp();
    this.hookFltrInpt();
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
    pre: none
    post: lots, Draws mainEl, RghtMdl, LeftNav.
    main run of class
    -----------------------------------------------*/
    run(){
    this.types=selectType('invntSrv');
    this.statuses=selectStatus();
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavInvntSrv();
    document.getElementById('mainEl').innerHTML=this.mainEl();
    document.getElementById('invntSrvFilterStatus').innerHTML=this.genFltrSttsSlct();
    document.getElementById('invntSrvFilterType').innerHTML=this.genFltrTypeSlct();
    this.hookEl();
    this.drawTbl();
    }
  }

var invntSrvObj=new invntSrv();
state.depModuleObjs['invntSrv']=invntSrvObj;
}
