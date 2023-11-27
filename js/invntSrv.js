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
          <input id="invntSrvFltrInpt" name="invntSrvFilter[input]" class="fltrInpt" type="text" placeholder="Invoice filter"/>
        </div>
        <div class="">
          <div class="fltrRowCellLbl">
          Status Filter:
          </div>
          <select id="invntSrvFilterStatus" name="invntSrvFilter[status]" class="fltrSlct" title="Status Filter">
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
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    genLeftNavInvntSrv(){
    return "Inventory/Service";
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    mainEl(){
    let html=this.tmpl.headers;    
    return html;
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){
    this.invntSrvList=getInvntSrv();
    console.log(this.invntSrvList);
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavInvntSrv();
    document.getElementById('mainEl').innerHTML=this.mainEl();
    }
  }

var invntSrvObj=new invntSrv();
state.depModuleObjs['invntSrv']=invntSrvObj;
}
