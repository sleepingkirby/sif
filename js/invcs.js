if(typeof invcs==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
manage inventory and services
-------------------------------------------*/
  class invcs{
    constructor(){

    this.invcsList=null;
//CREATE TABLE invcs_items(uuid text not null primary key, type_id text null, invntSrv_id text null, ord int null, name text not null, price real, price_type_id text null, notes null, foreign key(invntSrv_id) references invntSrv(uuid), foreign key(type_id) references type(uuid), foreign key(price_type_id) references type(uuid));
    //this.invcsNewItemsList=null;
    this.invcsNewItemsList=[
      {
      'addAmnt':1,
      'amnt':20,
      'buy':6.4,
      'create_date':"2023-11-27 12:15:00",
      'fName':null,
      'mName':null,
      'mod_date':"2023-11-27 12:15:00",
      'name':"conditioner",
      'notes':null,
      'parentIds':['545030ee-f0f8-4b1f-9f29-db6378bb5639', 'af2cca44-5f6c-4278-b17a-f100fbbf8466'],
      'price_type_id':"6a2f0079-b8fc-450e-b432-85d42932318e",
      'price_type_name':"percentage",
      'sell':2.5,
      'sku':"sku56789",
      'srv_durtn':null,
      'status':"79255733-6d34-4999-8ee0-b5e824269cc9",
      'status_name':"active",
      'surName':null,
      'type':"product",
      'type_uuid':"59a69f74-1d26-4b25-8de1-b1fac23b3839",
      'users':[],
      'uuid':"9be012af-ac42-42b4-8b7d-5607153279de"
      },
      {
      'addAmnt':1,
      'amnt':20,
      'buy':6.4,
      'create_date':"2023-11-27 12:15:00",
      'fName':null,
      'mName':null,
      'mod_date':"2023-11-27 12:15:00",
      'name':"conditioner2",
      'notes':null,
      'parentIds':['545030ee-f0f8-4b1f-9f29-db6378bb5639', 'af2cca44-5f6c-4278-b17a-f100fbbf8466'],
      'price_type_id':"6a2f0079-b8fc-450e-b432-85d42932318e",
      'price_type_name':"percentage",
      'sell':2.5,
      'sku':"sku56789",
      'srv_durtn':null,
      'status':"79255733-6d34-4999-8ee0-b5e824269cc9",
      'status_name':"active",
      'surName':null,
      'type':"product",
      'type_uuid':"59a69f74-1d26-4b25-8de1-b1fac23b3839",
      'users':[],
      'uuid':"9be012af-ac42-42b4-8b7d-5607153279de"
      },
    ];
    this.statuses=null;
    this.types=null;
    this.typesHsh=null;
    this.typesIdHsh=null;
    this.users=null;
    this.customers=null;
    this.invntSrvItems=null;
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
        <div class="row">
          <select id="invcsSelectForUser" name="invcs[ForUser_id]" title="User created for">
            <option>for user</option>
          </select>
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
          <input id="invcsNewFormAddBtn" style="display:none;" type="submit" value="Update" disabled/>
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
    pre: this.updtInvcsNewItemsTbl, ths, this.typesIdHsh['invntSrv']
    post: this.updtInvcsNewItemsTbl
    updates this.updtInvcsNewItemsTbl
    -----------------------------------------------*/
    updtInvcsNewItemsTbl(indx, propNm=null, ths){
      if(!this.invcsNewItemsList||!this.invcsNewItemsList.hasOwnProperty(indx)){
      return null;
      }
    this.invcsNewItemsList[indx][propNm]=ths.value;
      if(propNm=='price_type_id'){
      this.invcsNewItemsList[indx]["price_type_name"]=this.typesIdHsh['invntSrv']["price_type"][ths.value];
      }
      if(propNm=='type_uuid'){
      this.invcsNewItemsList[indx]["type"]=this.typesIdHsh['invntSrv'][""][ths.value];
      }
    }

    /*-----------------------------------------------
    pre: this.updtInvcsNewItemsTbl, ths, this.genInvcsNewItemsTbl(), document.getElementById('invcsNewItems')
    post: this.updtInvcsNewItemsTbl
    updates this.updtInvcsNewItemsTbl, redraw the table
    -----------------------------------------------*/
    updtInvcsNewItemsTblRdrw(indx, propNm=null, ths){
    this.updtInvcsNewItemsTbl(indx, propNm, ths);
    document.getElementById('invcsNewItems').innerHTML=this.genInvcsNewItemsTbl();
    }

    /*-----------------------------------------------
    pre: this.invcsNewItemsList
    post:
    swaps 2 elements in this.invcsNewItemsList
    -----------------------------------------------*/
    swapInvcsNewItemsList(indx=null, dir=null){
      if(indx===null||!dir){
      return null;
      }
    let newIndx=null;

      if(dir=='up'){
      newIndx=indx - 1;
      }
      else if(dir=='down'){
      newIndx=indx + 1;
      }

    //newIndx invalid.
      if(newIndx<0||newIndx>=this.invcsNewItemsList.length){
      return null;
      }

    let tmp=this.invcsNewItemsList[indx];
    this.invcsNewItemsList[indx]=this.invcsNewItemsList[newIndx];
    this.invcsNewItemsList[newIndx]=tmp;
    return true;
    }

    /*-----------------------------------------------
    pre: this.invcsNewItemsList, this.genInvcsNewItemsTbl()
    post:
    swaps 2 elements in this.invcsNewItemsList via genInvcsNewItemsTbl() and redraw table
    -----------------------------------------------*/
    swapInvcsNewItemsListRedrw(indx=null, dir=null){
      if(this.swapInvcsNewItemsList(indx, dir)){
      document.getElementById('invcsNewItems').innerHTML=this.genInvcsNewItemsTbl();
      }
    }

    /*-----------------------------------------------
    pre: this.genInvcsNewItemsTbl()
    post:
    delete indx from this.invcsNewItemsList via genInvcsNewItemsTbl() and redraw table
    -----------------------------------------------*/
    delInvcsNewItemsListRedrw(indx=null){
      if(indx===null||indx<0||indx>=this.invcsNewItemsList.length){
      return null;
      }
    this.invcsNewItemsList.splice(indx,1);
    document.getElementById('invcsNewItems').innerHTML=this.genInvcsNewItemsTbl();
    }

    /*-----------------------------------------------
    pre:
    post:
    -----------------------------------------------*/
    genInvcsNewItemsTbl(){
    //let tmp=this.tmpl.invcsNewItemsTbl['tableStart']+this.tmpl.invcsNewItemsTbl['headStart']+"test"+this.tmpl.invcsNewItemsTbl['headEnd']+`<tr><td>test</td></tr>`+this.tmpl.invcsNewItemsTbl['tableEnd'];
    //CREATE TABLE invcs_items(uuid text not null primary key, invc_id text not null, type_id text null, invntSrv_id text null, ord int null, name text not null, price real not null, price_dscntd real null, notes null, foreign key(invc_id) references invcs(uuid), foreign key(type_id) references type(uuid), foreign key(invntSrv_id) references invntSrv(uuid));
    let newItmTbl='';
    let prodTypeHsh=this.typesHsh['invntSrv'][""]; 
    let prcTypeHsh=this.typesHsh['invntSrv']["price_type"];
    let prdSlct=null;
    let prcSlct=null;
    let subTtl=null;
    let lastSubTtl=null;
    let sell=null;

      for(let i in this.invcsNewItemsList){
      let addAmnt=this.invcsNewItemsList[i].hasOwnProperty('addAmnt')?this.invcsNewItemsList[i].addAmnt:0;
      prdSlct=genSlctHshIndx(prodTypeHsh, this.invcsNewItemsList[i].type_uuid);
      prcSlct=genSlctHshIndx(prcTypeHsh, this.invcsNewItemsList[i].price_type_id);
        switch(this.invcsNewItemsList[i].price_type_name){
          case 'percentage':
            if(lastSubTtl!==null){
              if(this.invcsNewItemsList[i].type=='discount'){
              subTtl=lastSubTtl * (1 - Number(this.invcsNewItemsList[i].sell) / 100).toFixed(2);
              }
              else if(this.invcsNewItemsList[i].type=='service'){
              subTtl=lastSubTtl * (Number(this.invcsNewItemsList[i].sell) / 100).toFixed(2);
              }
            lastSubTtl=subTtl;
            }
            //anything else doesn't make sense.
          break;
          case 'deferred':
            //no price
          break;
          default:
          //static
            if(this.invcsNewItemsList[i].hasOwnProperty('subTtl')){
            subTtl=this.invcsNewItemsList[i].subTtl;
            }
            else{
            subTtl=Number(this.invcsNewItemsList[i].sell) * Number(addAmnt);
            }
          lastSubTtl=subTtl;
          break;
        }
        if(subTtl===null){
        subTtl='';
        }
        else{
        subTtl=Number(subTtl).toFixed(2);
        }
      let dlrSgn=this.invcsNewItemsList[i].price_type_name=='static'?'$':'';
      let prcntSgn=this.invcsNewItemsList[i].price_type_name=='percentage'?'%':'';
        switch(this.invcsNewItemsList[i].price_type_name){
          case 'static':
          dlrSgn='$';
          prcntSgn='';
          sell=Number(this.invcsNewItemsList[i].sell).toFixed(2);
          break;
          case 'percentage':
          dlrSgn='';
          prcntSgn='%';
          sell=this.invcsNewItemsList[i].sell;
          break;
          default:
          break;
        }
      let prcHtml='';
      let amntHtml='';
      let subTtlHtml='';

        if(this.invcsNewItemsList[i].price_type_name!='deferred'){
        prcHtml=`
               <div class="inptNumNumRszWrap minInptNumWarp">
                 `+dlrSgn+`
                 <input class="inptNumRsz minInptNum" type="number" name="invcsNewItems[0][prc]" step=".2" value="${this.invcsNewItemsList[i].sell}" onchange=invcsObj.updtInvcsNewItemsTblRdrw(${i},"sell",this) />
                 `+prcntSgn+`
               </div>
        `;
        amntHtml=`
               <div class="inptNumNumRszWrap minInptNumWarp">
                 <input class="inptNumRsz minInptNum" type="number" name="invcsNewItems[0][prc]" step="1" value="${addAmnt}" onchange=invcsObj.updtInvcsNewItemsTblRdrw(${i},"addAmnt",this) />
               </div>
        `;
        subTtlHtml=`
               <div class="inptNumNumRszWrap minInptNumWarp">
                 <input class="inptNumRsz minInptNum" type="number" name="invcsNewItems[0][prc]" step=".2" value="${subTtl}" onchange=invcsObj.updtInvcsNewItemsTblRdrw(${i},"subTtl",this) />
               </div>
        `;
        }

      let up=i>0?`<div onclick=invcsObj.swapInvcsNewItemsListRedrw(${i},'up')>`+getEvalIcon(iconSets, state.user.config.iconSet, 'arrowUpCrcl')+`</div>`:``;
      let dwn=i<this.invcsNewItemsList.length-1?`<div onclick=invcsObj.swapInvcsNewItemsListRedrw(${i},'down')>`+getEvalIcon(iconSets, state.user.config.iconSet, 'arrowDwnCrcl')+`</div>`:``;
      newItmTbl+=`
         <tr>
           <td>
             <div class="invcsNewItemActns">
               <div onclick=invcsObj.delInvcsNewItemsListRedrw(${i})>`+getEvalIcon(iconSets, state.user.config.iconSet, 'delete')+`</div>
               `+up+`
               `+dwn+`
             </div>
           </td>
           <td>
             <textarea class="smallTAInpt" name="invcsNewItems[0][name]" type="text" placeholder="Name">${this.invcsNewItemsList[i].name}</textarea>
           </td>
           <td>
             <select class="invcsNewItemsSlct" name="invcsNewItems[0][type]" onchange=invcsObj.updtInvcsNewItemsTblRdrw(${i},"type_uuid",this) >
             `+prdSlct+`
             </select>
           </td>
           <td>
             <select class="invcsNewItemsSlct" name="invcsNewItems[0][type]" onchange=invcsObj.updtInvcsNewItemsTblRdrw(${i},"price_type_id",this) >
             `+prcSlct+`
             </select>
           </td>
           <td>
             `+prcHtml+`
           </td>
           <td>
             `+amntHtml+`
           </td>
           <td>
             `+subTtlHtml+`
           </td>
         </tr>
      `; 
     
      }
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
          type
          </th>
          <th>
          price type
          </th>
          <th>
          item
          price
          </th>
          <th>
          num
          </th>
          <th>
          price
          </th>
        </tr>
        `+newItmTbl+`
    `;
    
    return tmp;
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
    post: html drawn
    fill the right modal
    -----------------------------------------------*/
    fillRghtMod(){

    }

    /*-----------------------------------------------
    pre: none 
    post: html drawn
    drawn right modal
    -----------------------------------------------*/
    genRghtMod(){
    console.log("genRghtMod");
    document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML=this.tmpl.rghtMod;
    document.getElementById('invcsNewItems').innerHTML=this.genInvcsNewItemsTbl();

    //status dropdown
    let stts=document.getElementById('invcsSelectStatus');
      if(stts){
      stts.innerHTML=this.genSttsSlct();  
      }

    //for and by users for drop down
    this.users=getUsers();
    const {customer:customers, '':users}=spltUsr(this.users);
    this.customers=customers;
    document.getElementById('invcsSelectByUser').innerHTML=genUsrSlct(users,'username','Username','uuid',state.user.uuid);
    document.getElementById('invcsSelectForUser').innerHTML=genUsrSlct(customers,'username','Username','uuid',state.user.uuid);

    //fill inventory/services items
    //function getInvntSrv(username=null, excldNull=false, ord=null, desc='desc'){
    this.invntSrvItems=getInvntSrv(null, false, 'name', 'asc');
    //function genSlct(arr, vlProp=null, nmProp=null, slctVl=null, dfltVl=null){
    document.getElementsByName('invcsNewItem')[0].innerHTML=genSlctHsh(this.invntSrvItems, 'uuid', 'name');
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
    this.statuses=selectStatus();
    this.types=selectType('invntSrv');
    this.typesHsh=sepTypesHsh(this.types);
    this.typesIdHsh=sepTypesIdHsh(this.types);
    document.getElementById('leftNavMod').innerHTML=this.genLeftNav();
    document.getElementById('mainEl').innerHTML=this.mainEl();
    this.genRghtMod();
    //document.getElementById('invcsNewItems').innerHTML=this.genInvcsNewItemsTbl();
    this.drawTbl();
    this.hookNewInvntBtn()
    }
  }

var invcsObj=new invcs();
state.depModuleObjs['invcs']=invcsObj;
}
