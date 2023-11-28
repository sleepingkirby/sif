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
    post: inventory/service drawn
    draws table
    -----------------------------------------------*/
    drawTbl(){
    let rtrn='';
    let hdrs='';
      for(let hdr of this.tmpl.invntSrvTblHdArr){
      //function sortTblHdrTmplng(tmpl, obj, sortDir, srtClss='tblHdSrtPnt')
      hdrs+=this.tmpl.invntSrvTblHdCll[0]+sortTblHdrTmplng(this.tmpl.invntSrvTblHdCllIcn,hdr,this.sortCol==hdr.name?this.sortColDir:null)+this.tmpl.invntSrvTblHdCll[1];
      }
    //rtrn+=this.tmpl.invntSrvTblStrt+hdrs+this.tmpl.invntSrvTblHdEnd+cntnt+this.tmpl.invntSrvTblEnd;
    rtrn+=this.tmpl.invntSrvTblStrt+hdrs+this.tmpl.invntSrvTblHdEnd+this.tmpl.invntSrvTblEnd;

    
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
    pre: none
    post: lots, Draws mainEl, RghtMdl, LeftNav.
    main run of class
    -----------------------------------------------*/
    run(){
    this.invntSrvList=getInvntSrvArr();
    console.log(this.invntSrvList);
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavInvntSrv();
    document.getElementById('mainEl').innerHTML=this.mainEl();
    this.drawTbl();
    }
  }

var invntSrvObj=new invntSrv();
state.depModuleObjs['invntSrv']=invntSrvObj;
}
