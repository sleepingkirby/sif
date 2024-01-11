if(typeof invcs==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
manage inventory and services
-------------------------------------------*/
  class invcs{
    constructor(){
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
        <div class="">
          <div class="fltrRowCellLbl">
          Type Filter:
          </div>
          <select id="invcFilterType" name="invcFilter[type]" class="fltrSlct" title="Type Filter">
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

    //CREATE TABLE invcs(uuid text not null primary key, create_date int not null, due_date int null, paid_date int null, status_id text not null, sub_total real not null, total_dscntd real null, total real not null, total_paid real null, forUser_id text not null, byUser_id text not null, event_id text null, foreign key(forUser_id) references users(uuid), foreign key(byUser_id) references users(uuid), foreign key(event_id) references events(uuid), foreign key(status_id) references type(uuid));
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

    this.mainTblId='invcMain';


    }

    /*-----------------------------------------------
    pre: none
    post: draws top left nav
    draws top left nav
    -----------------------------------------------*/
    genLeftNavInvntSrv(){
    return "Invoices";
    }

    /*----------------------------------
    pre: apptAddBtn element exists, mainObj.modPrcClsCall()
    post: event hook added
    addes event hook to apptAddBtn element
    ----------------------------------*/
    hookNewInvntBtn(){
      document.getElementById("invcAddBtn").onclick=(e)=>{
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
    this.hookNewInvntBtn();
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

    let cntnt='';
    /*
      cntnt+=`
      <tr>
        <td>`+invntSrv.create_date+`</td>
        <td>`+invntSrv.mod_date+`</td>
        <td>`+invntSrv.name+`</td>
        <td>`+invntSrv.type+`</td>
        <td>`+statusColor(invntSrv.status_name)+`</td>
        <td>`+dur+`</td>
        <td>`+Number(invntSrv.amnt).toString()+`</td>
        <td>`+invntSrvPrcFormat(Number(invntSrv.buy).toString(),buyType)+`</td>
        <td>`+invntSrvPrcFormat(Number(invntSrv.sell).toString(),invntSrv.price_type_name)+`</td>
        <td>
          <div class="moduleTblCellActns">
            <div name="invntSrvEdit" class="menuIcon" onclick=invntSrvObj.updtInvntSrvRghtMod("`+invntSrv.uuid+`"); title="Edit Inventory/Service">`+getEvalIcon(iconSets, state.user.config.iconSet, 'edit')+`</div>
            <div name="invntSrvDisable" class="menuIcon" onclick=invntSrvObj.updtInvntSrvStts("`+invntSrv.uuid+`","active"); title="Activate Inventory/Service">`+getEvalIcon(iconSets, state.user.config.iconSet, 'done')+`</div>
            <div name="invntSrvDisable" class="menuIcon" onclick=invntSrvObj.updtInvntSrvStts("`+invntSrv.uuid+`","disabled"); title="Disable Inventory/Service">`+getEvalIcon(iconSets, state.user.config.iconSet, 'disable')+`</div>
          </div>
        </td>
      </tr>
      `;
      }
    */

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
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavInvntSrv();
    document.getElementById('mainEl').innerHTML=this.mainEl();
    this.drawTbl();
    this.hookNewInvntBtn()
    }
  }

var invcsObj=new invcs();
state.depModuleObjs['invcs']=invcsObj;
}
