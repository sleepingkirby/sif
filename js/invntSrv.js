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
    this.invntSrvLnkList=null;
//CREATE TABLE invntSrv(uuid text primary key, name text not null, type_uuid text null, create_date int not null, mod_date int not null, status text not null, srv_durtn int null, sku text, amnt int, buy real, sell real, price_type_id text not null, notes text, foreign key(status) references status(uuid), foreign key(type_uuid) references type(uuid), foreign key(price_type_id) references type(uuid));

    this.tmpl.rghtModForm=`
      <div id="invntSrvNewForm">
        <div class="lbl">Inventory/Service</div>
        <div id="invntSrvNewFormUUID">
          <input id="invntSrvNewFormInfoUUID" type="hidden" />
        </div>
        <div id="invntSrvNewFormInfo">
          <div class="row mdRow">
            <div>
              <textarea name="invntSrv[name]" type="text" placeholder="Name"></textarea>
              <textarea name="invntSrv[sku]" type="text" placeholder="Sku"></textarea>
            </div>
            <div id="invntSrvAmntDrtn" style="margin-left:80px;">
              <label class="inptLbl" for="invntSrvNewType" title="Product, service or discount">
              Type:
              </label>
              <select id="invntSrvNewType" name="invntSrv[type_uuid]">
                <option>type</option>
              </select>
            </div>
          </div>
          <div class="row mdRow">
            <div>
              <label class="inptLbl" for="invntSrvNewType" title="Product, service or discount">
              Price Type:
              </label>
              <select id="invntSrvPrcTypeId" name="invntSrv[price_type_id]">
                <option>price type</option>
              </select>
            </div>
          </div>
          <div id="invntSrvNewFormPrcs">
            &nbsp;
          </div>
          <div class="row mdRow">
            <div>
              <div class="inptLbl">
              Buy Price:
              </div>
              $
              <div class="inptNumNumRszWrap inptNumPrc" title="Sell price">
                <input class="inptNumRsz" type="number" name="invntSrv[buy]" step=".2"/>
              </div>
            </div>
          </div>
          <div class="row mdRow">
            <div>
              <div class="inptLbl">
              Sell Price:
              </div>
              $
              <div class="inptNumNumRszWrap inptNumPrc" title="Sell price">
                <input class="inptNumRsz" type="number" name="invntSrv[sell]" step=".2"/>
              </div>
            </div>
          </div>
          <div class="mdlSubBox mdlSubBoxPad">
            <div class="row mdRow">
              <div class="lbl">
              Bundled Inventory/Services
              </div>
            </div>
            <div class="row mdRow invntSrvMdlFltr">
              <div>
                <input class="mdltxtInpt" type="text" placeholder="Filter by name, price, amnts, duration, sku" title="Filter by name, price, amnts, duration, sku"/>
              </div>
              <div class="">
                <label class="inptLbl">
                Status Filter:
                </label>
                <select title="Status Filter">
                <option>all</option>
                </select>
              </div>
              <div class="">
                <label class="inptLbl">
                Type Filter:
                </label>
                <select title="Type Filter">
                <option>all</option>
                </select>
              </div>
            </div>
            <div id="invntSrvNewFormInvntSrvLst" class="row mdRow">
            &nbsp;
            </div>
          </div>
        </div>
      </div>
`;

    this.tmpl.rghtModFormPrcType={
    'static':`
          <div class="row mdRow">
            <div>
              <div class="inptLbl">
              Sell Price:
              </div>
              $
              <div class="inptNumNumRszWrap inptNumPrc" title="Sell price">
                <input class="inptNumRsz" type="number" name="invntSrv[sell]" step=".2"/>
              </div>
            </div>
          </div>
          <div class="row mdRow">
            <div>
              <div class="inptLbl">
              Buy Price:
              </div>
              $
              <div class="inptNumNumRszWrap inptNumPrc" title="BUy price">
                <input class="inptNumRsz" type="number" name="invntSrv[buy]" step=".2"/>
              </div>
            </div>
          </div>
    `,
    'percentage':`
          <div class="row mdRow">
            <div>
              <div class="inptLbl">
              Price:
              </div>
              <div class="inptNumNumRszWrap inptNumPrc" title="Sell price">
                <input class="inptNumRsz" type="number" name="invntSrv[sell]" step=".1"/>
              </div>
              %
            </div>
          </div>
    `,
    'deferred':``
    };

    this.tmpl.rghtModFormInvntLst=`
    `;

    this.tmpl.headers=`
      <div id="invntSrvAdd" class="moduleAdd">
        <div id="invntSrvAddBtn" class="moduleAddBtn" title="New Inventory/Service" tabindex=0>⨁</div>
      </div>
      <div id="invntSrvFltr" class="fltrRow">
        <div id="invntSrvFltrInptWrap" class="fltrRowCell">
          <input id="invntSrvFltrInpt" name="invntSrvFilter[input]" class="fltrInpt" type="text" placeholder="Filter by name, price, amnts, duration, sku" title="Filter by name, price, amnts, duration, sku"/>
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
    {'name':'srv_durtn','title':'duration', 'sort':true},
    {'name':'amnt','title':'amnt', 'sort':true},
    {'name':'buy','title':'buy price', 'sort':true},
    {'name':'sell','title':'sell price', 'sort':true},
    {'name':'actions','title':'actions', 'sort':false}
    ];
    this.tmpl.invntSrvRghtMdlTblHdArr=[
    {'name':'name','title':'name', 'sort':true},
    {'name':'type','title':'type', 'sort':true},
    {'name':'status_name','title':'status', 'sort':true},
    {'name':'srv_durtn','title':'duration', 'sort':true},
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

    this.tmpl.invntSrvRghtMdlTblStrt=`
        <table id="invntSrvNewFormInvntSrvLstTbl">
          <tr>
    `;
    this.tmpl.invntSrvRghtMdlTblHdCll=[];
    this.tmpl.invntSrvRghtMdlTblHdCll[0]=`
          <th>
    `;
    this.tmpl.invntSrvRghtMdlTblHdCll[1]=`
          </th>
    `;
    this.tmpl.invntSrvRghtMdlTblHdEnd=`
          </tr>
    `;
    this.tmpl.invntSrvRghtMdlTblEnd=`
        </table>
    `;


    this.mainTblId="invntSrvMain";
    this.fltrProps=['name','sell','buy','amnt','srv_durtn','sku'];
    this.sortCol="name";
    this.sortColDir="asc";
    this.rghtMdlTblCol="name";
    this.rghtMdlTblColDir="name";
    this.typeStr=null;
    this.statusStr=null;
    this.rghtMdlTblStatusStr=null;
    this.statuses=null;
    this.types=null;
    this.typesHsh=null;
    this.newInvntSrvTypesSlctId='invntSrvNewType';
    this.newInvntSrvPrcTypesSlctId='invntSrvPrcTypeId';
    this.newInvntSrvInvntSrvLstId='invntSrvNewFormInvntSrvLst';
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
    this.drawTbl();
    }

    /*-----------------------------------------------
    pre: this class
    post: right modal filled
    generates right modal content
    -----------------------------------------------*/
    genRghtMod(){
    document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML=this.tmpl.rghtModForm;
      if(this.typesHsh&&this.typesHsh.hasOwnProperty("invntSrv")&&this.typesHsh.invntSrv.hasOwnProperty('')){
      let typesSlct=[];
        for(let i of Object.keys(this.typesHsh.invntSrv[''])){
        typesSlct.push({'uuid':this.typesHsh.invntSrv[''][i], 'name':i});
        }
      document.getElementById(this.newInvntSrvTypesSlctId).innerHTML=genSttsSlct(typesSlct,null,'product');
      this.hookNewInvntSrvType();
      let prcTypesSlct=[];
        for(let i of Object.keys(this.typesHsh.invntSrv['price_type'])){
        prcTypesSlct.push({'uuid':this.typesHsh.invntSrv['price_type'][i], 'name':i});
        }
      document.getElementById(this.newInvntSrvPrcTypesSlctId).innerHTML=genSttsSlct(prcTypesSlct,null,'static');
      this.hookInvntSrvPrcType();

      this.drawRghtMdlTbl('545030ee-f0f8-4b1f-9f29-db6378bb5639');
      }
    }

    /*-----------------------------------------------
    pre: none
    post: updates rghtModal
    update rghtModal 
    -----------------------------------------------*/
    updtInvntSrvRghtMod(uuid=null){
      if(!uuid){
      return null;
      }
      /*
      if(this.apptsHsh.hasOwnProperty(uuid)&&this.apptsHsh[uuid]){
      this.apptsHsh[uuid];
      this.fillRghtMod(this.apptsHsh[uuid]);
      this.addUpdtBtnFlip(true);
      let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      }
      */
    }


    /*----------------------------------
    pre: this.newInvntSrvPrcTypesSlctId filled and element exists
    post: event hook added
    addes event hook to this.newInvntSrvPrcTypesSlctId element
    ----------------------------------*/
    hookInvntSrvPrcType(){
      document.getElementById(this.newInvntSrvPrcTypesSlctId).onchange=(e)=>{
      console.log(e.target.value);
      }
    }

    /*----------------------------------
    pre: this.newInvntSrvTypesSlctId filled and element exists
    post: event hook added
    addes event hook to this.newInvntSrvTypesSlctId element
    ----------------------------------*/
    hookNewInvntSrvType(){
      document.getElementById(this.newInvntSrvTypesSlctId).onchange=(e)=>{
      console.log(e.target.value);
      }
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
    pre: apptAddBtn element exists, mainObj.modPrcClsCall()
    post: event hook added
    addes event hook to apptAddBtn element
    ----------------------------------*/
    hookNewInvntBtn(){
      document.getElementById("invntSrvAddBtn").onclick=(e)=>{
      //this.addUpdtBtnFlip();

      //this.cleanRghtModForm();

      let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      };
    }

    /*----------------------------------
    pre: this.fltrStr, this.invntSrvList
    post: none
    filters the inventory services
    ----------------------------------*/
    fltrInvntSrvs(){
    let invntSrvs=[];
      if(this.fltrStr){
        for(let invntSrv of this.invntSrvList){
          for(let prop of this.fltrProps){
            if(invntSrv[prop]&&invntSrv[prop].toString().toLocaleLowerCase().search(this.fltrStr.toLocaleLowerCase())>=0){
            invntSrvs.push({...invntSrv});
            break;
            }
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
    post: inventory
    draws table
    -----------------------------------------------*/
    drawRghtMdlTbl(invntSrvId){
    let rtrn='';
    let hdrs='';
    let el=document.getElementById(this.newInvntSrvInvntSrvLstId);
    //if element doesn't exist, don't do anything.
      if(!el){
      return null;
      }

      for(let hdr of this.tmpl.invntSrvRghtMdlTblHdArr){
      hdrs+=this.tmpl.invntSrvRghtMdlTblHdCll[0]+sortTblHdrTmplng(this.tmpl.invntSrvTblHdCllIcn,hdr,this.sortCol==hdr.name?this.sortColDir:null)+this.tmpl.invntSrvRghtMdlTblHdCll[1];
      }

    let lnkedRow='';
    console.log(invntSrvId);
      if(invntSrvId){
      this.invntSrvLnkList=getInvntSrvLnkArr({'invntSrvLnkPrnt':invntSrvId}, this.rghtMdlTblCol, this.rghtMdlTblColDir);
      console.log(this.invntSrvLnkList);
        for(let isl of this.invntSrvLnkList){
        let dur=isl.srv_durtn||'0';
        //if the isl is not type product, the buy price doesn't make sense. Setting format of buying price to N/A
        let buyType=null;
          if(isl.type=='product'){
          buyType=isl.price_type_name;
          }

          lnkedRow+=`
          <tr>
            <td>${isl.name}</td>
            <td>${isl.type}</td>
            <td>${isl.status_name}</td>
            <td>${dur}</td>
            <td>${isl.amnt}</td>
            <td>`+invntSrvPrcFormat(isl.buy,buyType)+`</td>
            <td>${isl.sell}</td>
            <td>
              <div class="moduleTblCellActns">
                <div name="invntSrvEdit" class="menuIcon" onclick=console.log("${invntSrv.uuid}"); title="Edit Inventory/Service">`+getEvalIcon(iconSets, state.user.config.iconSet, 'edit')+`</div>
                <div name="invntSrvDisable" class="menuIcon" onclick=console.log("${invntSrv.uuid} disabled"); title="Disable Inventory/Service">`+getEvalIcon(iconSets, state.user.config.iconSet, 'disable')+`</div>
              </div>
            </td>
          </tr>
          `;
        }
      }
    console.log(lnkedRow); 
    

    el.innerHTML=this.tmpl.invntSrvRghtMdlTblStrt+hdrs+lnkedRow+this.tmpl.invntSrvRghtMdlTblEnd;
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
      //if the invntSrv is not type product, the buy price doesn't make sense. Setting format of buying price to N/A
      let buyType=null;
        if(invntSrv.type=='product'){
        buyType=invntSrv.price_type_name;
        }
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
            <div name="invntSrvEdit" class="menuIcon" onclick=invntSrvObj.updtApptRghtMod("`+invntSrv.uuid+`"); title="Edit Inventory/Service">`+getEvalIcon(iconSets, state.user.config.iconSet, 'edit')+`</div>
            <div name="invntSrvDisable" class="menuIcon" onclick=invntSrvObj.updtEvntStts("`+invntSrv.uuid+`","disabled"); title="Disable Inventory/Service">`+getEvalIcon(iconSets, state.user.config.iconSet, 'disable')+`</div>
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
    this.hookNewInvntBtn();
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
    this.typesHsh=sepTypesHsh(this.types);
    this.statuses=selectStatus();
    document.getElementById('leftNavMod').innerHTML=this.genLeftNavInvntSrv();
    this.genRghtMod();
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
