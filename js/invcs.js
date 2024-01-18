if(typeof invcs==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
manage inventory and services
-------------------------------------------*/
  class invcs{
    constructor(){

    this.invcsList=null;
    this.invcsNewItemsList=null;
    this.invcsSrtCol='create_date';
    this.invcsSrtDir='desc';

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

    this.tmpl.rghtMod=`
    <div id="invcsNewForm">
      <div class="lbl">Invoice</div>
      <div id="invcsNewFormUUID">
        <input id="invcsNewFormInfoUUID" name="invcs[uuid]" type="hidden" />
      </div>
      <div id="invcsNewFormInfo">
        <div id="invcsNewFormInvcsStts" class="row">
          <div class="flexLeft flexCol">
            <div class="lbl" style="margin-bottom:6px;">due:</div>
            <div>
              <input type="datetime-local" name="invcs[due_date]" title="Due Date" value="${toInptValFrmt()}"/>
            </div>
          </div>
          <div class="flexRight flexCol">
            <div class="flexRight" style="margin-bottom:6px;">
              <select id="invcsSelectStatus" name="invcs[status_id]" title="Invoice Status">
                <option>status</option>
              </select>
            </div>
            <div class="flexRight">create: 1234-01-23</div>
            <div class="flexRight">paid: 1234-01-23</div>
          </div>
        </div>
        <div class="row">
          <select id="invcsSelectByUser" name="invcs[byUser_id]" title="User created">
            <option>by user</option>
          </select>
          <div>
            <div style="font-weight:600; align-items:center;">$</div>
            <div class="inptNumNumRszWrap inptNumPrc">
              <input class="inptNumRsz" type="number" name="invcs[total]" step=".2" />
            </div>
          </div>
        </div>
        <div class="mdlSubBoxOutln" style="flex-direction:column; align-items:stretch;">
          <div class="row flexRight">
            <select name="invcsNewItem" title="New Invoice Item">
              <option>new item</option>
            </select>
            <div class="midBtn" title="Add New Invoice Item" style="margin-left: 12px;">`+getEvalIcon(iconSets, state.user.config.iconSet, 'addCircle')+`</div>
          </div>
          <div id="invcsNewItems">
          table
          </div>
        </div>
        <div style="justify-content:flex-end;">
          <input id="invcsNewFormAddBtn" style="" type="submit" value="Update" disabled/>
          <input id="invcsNewFormAddBtn" style="" type="submit" value="Create" disabled/>
        </div>
      </div>
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
    genLeftNav(){
    return "Invoices";
    }


    /*-----------------------------------------------
    pre: this.invcsList
    post: none
    returns invoices with sorting
    -----------------------------------------------*/
    getInvcsList(){
    this.invcsSrtCol='create_date';
    this.invcsSrtDir='desc';
    let invcsList=getInvcs({},this.invcsSrtCol,this.invcsSrtDir);
    return invcsList;
    }

    /*-----------------------------------------------
    pre:
    post:
    -----------------------------------------------*/
    genInvcsNewItemsTbl(){
    //let tmp=this.tmpl.invcsNewItemsTbl['tableStart']+this.tmpl.invcsNewItemsTbl['headStart']+"test"+this.tmpl.invcsNewItemsTbl['headEnd']+`<tr><td>test</td></tr>`+this.tmpl.invcsNewItemsTbl['tableEnd'];
    let tmp=`
      <table id="invcsNewItemsTbl">
        <tr>
          <th>
          &nbsp;
          </th>
          <th style="width:100%;">
          name
          </th>
          <th>
          price
          </th>
        </tr>
        <tr>
          <td>
            <div class="invcsNewItemActns">
              <div>`+getEvalIcon(iconSets, state.user.config.iconSet, 'delete')+`</div>
              <div>`+getEvalIcon(iconSets, state.user.config.iconSet, 'arrowUpCrcl')+`</div>
              <div>`+getEvalIcon(iconSets, state.user.config.iconSet, 'arrowDwnCrcl')+`</div>
            </div>
          </td>
          <td>
            <textarea class="smallTAInpt" name="invcsNewItems[0][name]" type="text" placeholder="Name">shampoo</textarea>
          </td>
          <td>
            <div class="inptNumNumRszWrap minInptNumWarp">
              <input class="inptNumRsz minInptNum" type="number" name="invcsNewItems[0][prc]" step=".2" value="5.99"/>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="invcsNewItemActns">
              <div>`+getEvalIcon(iconSets, state.user.config.iconSet, 'delete')+`</div>
              <div>`+getEvalIcon(iconSets, state.user.config.iconSet, 'arrowUpCrcl')+`</div>
              <div>`+getEvalIcon(iconSets, state.user.config.iconSet, 'arrowDwnCrcl')+`</div>
            </div>
          </td>
          <td>
            <textarea class="smallTAInpt" name="invcsNewItems[0][name]" type="text" placeholder="Name">shampoo</textarea>
          </td>
          <td>
            <div class="inptNumNumRszWrap minInptNumWarp">
              <input class="inptNumRsz minInptNum" type="number" name="invcsNewItems[0][prc]" step=".2" value="5.99"/>
            </div>
          </td>
        </tr>
      </table>
    `;
    return tmp;
    }

    /*-----------------------------------------------
    pre: none 
    post: html drawn
    drawn right modal
    -----------------------------------------------*/
    genRghtMod(){
      document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML=this.tmpl.rghtMod;
      document.getElementById('invcsNewItems').innerHTML=this.genInvcsNewItemsTbl();
    }

    /*-----------------------------------------------
    pre: this.invcsList
    post: none
    returns filter invoices
    -----------------------------------------------*/
    fltrInvcs(){
      if(!this.fltrStr){
      return this.invntSrvList;
      }

    let invcsArr=[];
      for(let invntSrv of this.invntSrvList){
        for(let prop of this.fltrProps){
          if(invntSrv[prop]&&invntSrv[prop].toString().toLocaleLowerCase().search(this.fltrStr.toLocaleLowerCase())>=0){
          invntSrvs.push({...invntSrv});
          break;
          }
        }
      }

    return invcsArr;
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

    this.invcsList=this.getInvcsList();
    let invcsArr=this.fltrInvcs(this.invcsList);

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
    document.getElementById('leftNavMod').innerHTML=this.genLeftNav();
    document.getElementById('mainEl').innerHTML=this.mainEl();
    this.genRghtMod();
    this.drawTbl();
    this.hookNewInvntBtn()
    }
  }

var invcsObj=new invcs();
state.depModuleObjs['invcs']=invcsObj;
}
