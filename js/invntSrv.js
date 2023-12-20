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
    this.invntSrvHsh=null;
    this.invntSrvLnkList=null;
    this.invntSrvLnkIndxHsh=null; //has of uuid -> this.invntSrvLnkList index needs to be modified everytime this.invntSrvLnkList is modified

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
                <input id="invntSrvNewFormFltrStr" class="mdltxtInpt" type="text" placeholder="Filter by name, price, amnts, duration, sku" title="Filter by name, price, amnts, duration, sku"/>
              </div>
              <div class="">
                <label class="inptLbl">
                Status Filter:
                </label>
                <select id="invntSrvNewFormFltrStts" title="Status Filter">
                <option>all</option>
                </select>
              </div>
              <div class="">
                <label class="inptLbl">
                Type Filter:
                </label>
                <select id="invntSrvNewFormFltrTyp" title="Type Filter">
                <option>all</option>
                </select>
              </div>
            </div>
            <div id="invntSrvNewFormInvntSrvLst" class="row mdRow">
            &nbsp;
            </div>
          </div>
          <div class="row">
            <input id="invntSrvNewFormUpdtBtn" style="display:none;" type="submit" value="Update"/>
            <input id="invntSrvNewFormAddBtn" style="" type="submit" value="Create" disabled/>
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
    {'name':'&nbsp;','title':'&nbsp;', 'sort':false},
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
    this.tmpl.invntSrvMdlTblHdCllIcn=`
            <div class="tblHdSrt ##pntClass##" tabindex=0 name="##hdrNm##" onclick="invntSrvObj.setColSrtMdlHookFunc(this)">
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
        <table id="invntSrvNewFormInvntSrvLstTbl" class="mdlTbl">
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
    this.fltrPropsMdl=['name','sell','buy','amnt','srv_durtn','sku'];
    this.sortCol="name";
    this.sortColDir="asc";
    this.rghtMdlTblCol="name";
    this.rghtMdlTblColDir="asc";
    this.typeStr=null;
    this.rghtMdlTblTypeStr=null;
    this.statusStr=null;
    this.rghtMdlTblStatusStr=null;
    this.statuses=null;
    this.types=null;
    this.typesHsh=null;
    this.newInvntSrvFormId='invntSrvNewFormInfo';
    this.newInvntSrvTypesSlctId='invntSrvNewType';
    this.newInvntSrvPrcTypesSlctId='invntSrvPrcTypeId';
    this.newInvntSrvInvntSrvLstId='invntSrvNewFormInvntSrvLst';
    this.newInvntSrvUpdtBtnId='invntSrvNewFormUpdtBtn';
    this.newInvntSrvAddBtnId='invntSrvNewFormAddBtn';
    this.fltrStr=null;
    this.rghtMdlTblFltrStr=null;
    this.invntSrvId=null;
    this.invntSrvNewLnkHsh=null;
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
      this.sortColDir="asc";
      return null;
      }

      this.sortColDir=this.sortColDir=="desc"?"asc":"desc";
    }

    /*----------------------------------
    pre:this.sortCol,this.sortColDir
    post:figure out sorting and sets variables
    function to set proper variables
    ----------------------------------*/
    setColSrtMdl(srt){
      if(this.rghtMdlTblCol!=srt){
      this.rghtMdlTblCol=srt;
      this.rghtMdlTblColDir="asc";
      return null;
      }

      this.rghtMdlTblColDir=this.rghtMdlTblColDir=="desc"?"asc":"desc";
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
    pre:right modal
    post:none
    function to set to hook for table header sort in the right modal 
    ----------------------------------*/
    setColSrtMdlHookFunc(e){
    let nm=e.getAttribute("name");
      if(nm){
      this.setColSrtMdl(nm);
      }
    this.drawRghtMdlTbl();
    }

    /*-----------------------------------------------
    pre: this.rghtMdlTblTypeStr, this.rghtMdlTblStatusStr, this.rghtMdlTblFltrStr,  elements
    post: filters in right modal cleared
    clear modal filter inputs
    -----------------------------------------------*/
    clearRghtModFltr(){
    this.rghtMdlTblTypeStr=null;
    this.rghtMdlTblStatusStr=null;
    this.rghtMdlTblFltrStr=null;
    document.getElementById('invntSrvNewFormFltrStts').value=null;
    document.getElementById('invntSrvNewFormFltrTyp').value=null;
    document.getElementById('invntSrvNewFormFltrStr').value=null;
    }

    /*-----------------------------------------------
    pre: this class, this.invntSrvId, this.invntSrvHsh, this.clearRghtModFltr, elements
    post: right modal cleared
    clear modal form's input
    -----------------------------------------------*/
    clearRghtMod(){
    this.invntSrvId=null;
    let formInpt=document.querySelectorAll('#'+this.newInvntSrvFormId+' *[name^="invntSrv["]');
      for(let fld of formInpt){
        if(fld.tagName=='SELECT'){
        slctToDefault(fld);
        }
        else{
        fld.value=null;
        }
      }
    this.clearRghtModFltr();
    }

    /*-----------------------------------------------
    pre: this class, this.invntSrvId, this.invntSrvHsh, elements
    post: right modal filled
    fill modal form's input
    -----------------------------------------------*/
    fillRghtMod(){
    //fill inputs with invntSrv values
      if(this.invntSrvId&&this.invntSrvHsh.hasOwnProperty(this.invntSrvId)){
      let formInpt=document.querySelectorAll('#'+this.newInvntSrvFormId+' *[name^="invntSrv["]');
      let curIs=this.invntSrvHsh[this.invntSrvId];
        for(let fld of formInpt){
        fld.value=curIs[getSubs(fld.name,'invntSrv')];
        }
      }
    }

    /*-----------------------------------------------
    pre: this class
    post: right modal filled
    generates right modal content
    -----------------------------------------------*/
    genRghtMod(){
      if(this.invntSrvId&&(!this.invntSrvList||!Array.isArray(this.invntSrvList))){
      this.invntSrvList=getInvntSrvArr();
      this.invntSrvHsh={};
        for(let is of this.invntSrvList){
        this.invntSrvHsh[is.uuid]={...is};
        }
      }

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

      document.getElementById('invntSrvNewFormFltrStts').innerHTML=this.genFltrSttsSlct();
      document.getElementById('invntSrvNewFormFltrTyp').innerHTML=this.genFltrTypeSlct();

      btnFlip(this.newInvntSrvAddBtnId,this.newInvntSrvUpdtBtnId,this.invntSrvId?true:false);

      //fill inputs with invntSrv values
        if(this.invntSrvId&&this.invntSrvHsh.hasOwnProperty(this.invntSrvId)){
        let formInpt=document.querySelectorAll('#'+this.newInvntSrvFormId+' *[name^="invntSrv["]');
        let curIs=this.invntSrvHsh[this.invntSrvId];
          for(let fld of formInpt){
          fld.value=curIs[getSubs(fld.name,'invntSrv')];
          }
        }

      this.drawRghtMdlTbl();
      }
    }

    /*-----------------------------------------------
    pre: this.invntSrvLnkList, this.invntSrvLnkIndxHsh 
    post: this.invntSrvLnkHsh redone
    used for when this.invntSrvLnkIndxHsh needs to be redone. Like on initialization or this.invntSrvLnkList was spliced
    -----------------------------------------------*/
    hshInvntSrvLnkList(){
      this.invntSrvLnkIndxHsh={};
      for(let i in this.invntSrvLnkList){
      this.invntSrvLnkIndxHsh[this.invntSrvLnkList[i].invntSrvuuid]=i;
      }
    }

    /*-----------------------------------------------
    pre: this.invntSrvLnkList, this.invntSrvLnkHsh, this.rghtMdlTblStatusStr, this.rghtMdlTblTypeStr, getInvntSrvLnkArr(), this.hshInvntSrvLnkList()
    post: this.invntSrvList and this.invntSrvLnkHsh filled
    get/fill this.invntSrvLnkList depending on uuid
    -----------------------------------------------*/
    getInvntSrvLnkList(uuid=null){
      if(!uuid){
      return null;
      }
    let pObj={};
    pObj['invntSrvLnkPrnt']=this.invntSrvId;
      if(this.rghtMdlTblStatusStr){
      pObj['status']=this.rghtMdlTblStatusStr;
      }
      if(this.rghtMdlTblTypeStr){
      pObj['type_uuid']=this.rghtMdlTblTypeStr;
      }
    this.invntSrvLnkList=getInvntSrvLnkArr(pObj, this.rghtMdlTblCol, this.rghtMdlTblColDir);
    this.hshInvntSrvLnkList();
    }

    /*-----------------------------------------------
    pre: this.invntSrvLnkList, this.invntSrvLnkIndxHsh
    post: this.invntSrvLnkList, this.invntSrvLnkIndxHsh modified
    this.invntSrvLnkList, this.invntSrvLnkIndxHsh cleared
    -----------------------------------------------*/
    clearInvntSrvLnkList(){
    this.invntSrvLnkList=null;
    this.invntSrvLnkIndxHsh=null
    }

    /*-----------------------------------------------
    pre: this.invntSrvLnkList this.invntSrvLnkIndxHsh this.invntSrvHsh
    post: this.invntSrvLnkList this.invntSrvLnkIndxHsh modified 
    add to this.invntSrvLnkList this.invntSrvLnkIndxHsh
    -----------------------------------------------*/
    addInvntSrvLnkList(uuid){
      if(!uuid||!this.invntSrvHsh.hasOwnProperty(uuid)){
      return null;
      }
    let i=this.invntSrvLnkList.push({'invntSrvuuid':uuid, ...this.invntSrvHsh[uuid]});
      if(!this.invntSrvLnkIndxHsh){
      this.invntSrvLnkIndxHsh={};
      }
    this.invntSrvLnkIndxHsh[uuid]=Number(i-1).toString();
    }

    /*-----------------------------------------------
    pre: this.addInvntSrvLnkList(uuid), this.drawRghtMdlTbl();
    post: this.invntSrvLnkList this.invntSrvLnkIndxHsh modified, page drawn
    add to this.invntSrvLnkList and redraw table
    -----------------------------------------------*/
    addDrawInvntSrvLnkList(uuid){
    this.addInvntSrvLnkList(uuid);
    this.drawRghtMdlTbl();
    }

    /*-----------------------------------------------
    pre: this.invntSrvLnkList this.invntSrvLnkIndxHsh
    post: this.invntSrvLnkList this.invntSrvLnkIndxHsh modified 
    add to this.invntSrvLnkList this.invntSrvLnkIndxHsh
    -----------------------------------------------*/
    rmInvntSrvLnkList(uuid){
      if(!uuid||!this.invntSrvLnkIndxHsh.hasOwnProperty(uuid)){
      return null;
      }
    let i=this.invntSrvLnkIndxHsh[uuid];
    let len=this.invntSrvLnkList.length;
    this.invntSrvLnkList.splice(i,1);
      if(Number(i)==len-1){
      delete this.invntSrvLnkIndxHsh[uuid];
      }
      else{
      this.hshInvntSrvLnkList();
      }
    }

    /*-----------------------------------------------
    pre: this.addInvntSrvLnkList(uuid), this.drawRghtMdlTbl();
    post: this.invntSrvLnkList this.invntSrvLnkIndxHsh modified, page drawn
    add to this.invntSrvLnkList and redraw table
    -----------------------------------------------*/
    rmDrawInvntSrvLnkList(uuid){
    this.rmInvntSrvLnkList(uuid);
    this.drawRghtMdlTbl();
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
    this.invntSrvId=uuid;
      if(this.invntSrvHsh.hasOwnProperty(uuid)&&this.invntSrvHsh[uuid]){
      this.clearRghtModFltr();
      this.clearInvntSrvLnkList();
      this.fillRghtMod();
      this.getInvntSrvLnkList(uuid);

      this.drawRghtMdlTbl();
      btnFlip(this.newInvntSrvAddBtnId,this.newInvntSrvUpdtBtnId,this.invntSrvId?true:false);
      let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      }
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
      btnFlip(this.newInvntSrvAddBtnId,this.newInvntSrvUpdtBtnId,false);
      this.rghtMdlTblCol='name';
      this.rghtMdlTblColDir='asc';
      this.rghtMdlTblFltrStr=null;
      this.clearRghtMod();
      this.clearInvntSrvLnkList();
      this.invntSrvLnkList=[];
      this.drawRghtMdlTbl();

      let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      };
    }

    /*----------------------------------
    pre: invntSrvNewFormFltrStts element exists,
    post: event hook added
    addes event hook to invntSrvNewFormFltrStts element
    ----------------------------------*/
    hookMdlFltrSlctStts(){
      document.getElementById('invntSrvNewFormFltrStts').onchange=(e)=>{
      this.rghtMdlTblStatusStr=e.target.value=='null'?null:e.target.value;
      console.log(e.target.value);
      this.drawRghtMdlTbl();
      }
    }

    /*---------------------------------
    pre: invntSrvNewFormFltrType element exists,
    post: event hook added
    addes event hook to invntSrvNewFormFltrTyp element
    ----------------------------------*/
    hookMdlFltrSlctType(){
      document.getElementById('invntSrvNewFormFltrTyp').onchange=(e)=>{
      this.rghtMdlTblTypeStr=e.target.value=='null'?null:e.target.value;
      this.drawRghtMdlTbl();
      }
    }

    /*---------------------------------
    pre: invntSrvNewFormFltrStr element exists,
    post: event hook added
    addes event hook to invntSrvNewFormFltrStr element
    ----------------------------------*/
    hookMdlFltrInpt(){
      //why the wrapper and not the input itself? Keyup/down/press is fired BEFORE the input value is set by the key press. The event bubbles up AFTER the input value is pressed
      document.getElementById("invntSrvNewFormFltrStr").onkeyup=(e)=>{
      this.rghtMdlTblFltrStr=e.target.value;
      this.drawRghtMdlTbl();
      };
    }


    /*----------------------------------
    pre: this.fltrStr, this.invntSrvList
    post: none
    filters the inventory services
    ----------------------------------*/
    fltrInvntSrvs(){
    let invntSrvs=[];
      if(!this.fltrStr){
      return this.invntSrvList;
      }
      for(let invntSrv of this.invntSrvList){
        for(let prop of this.fltrProps){
          if(invntSrv[prop]&&invntSrv[prop].toString().toLocaleLowerCase().search(this.fltrStr.toLocaleLowerCase())>=0){
          invntSrvs.push({...invntSrv});
          break;
          }
        }
      }
    return invntSrvs;
    }

    /*----------------------------------
    pre: this.fltrStr, this.invntSrvList
    post: none
    filters the inventory services
    ----------------------------------*/
    fltrInvntSrvsMdl(lnkList,pObj=null,sortCol=null,sortDir=null){
      if(!lnkList){
      return lnkList;
      }
    let invntSrvs=[];
    let list=[...lnkList];

    //===== array of object sort (when db sort isn't available)========
      if(sortCol){
        if(sortDir=='desc'){
          list=list.sort((b,a)=>{
            if(a[sortCol]<b[sortCol]){
            return -1;
            }
            if(a[sortCol]>b[sortCol]){
            return 1;
            }
          return 0;
          });
        }
        else{
          list=list.sort((a,b)=>{
            if(a[sortCol]<b[sortCol]){
            return -1;
            }
            if(a[sortCol]>b[sortCol]){
            return 1;
            }
          return 0;
          });
        }
      }

      let pObjInds=null;
      for(let invntSrv of list){
      //========filter by pObj=========
        if(pObj&&typeof pObj=="object"&&Object.keys(pObj).length>0){
          if(!pObjInds){
          pObjInds=Object.keys(pObj);
          }
        let flag=0;
          //if the current invntSrv doesn't have any of the pObj values on the appropriate properties, don't include.
          for(let inds of pObjInds){
            if(invntSrv[inds]==pObj[inds]){
            flag=1;
            break;
            }
          }
          if(flag==0){
          continue;
          }
        }
      //====== filter by String, if this.rghtMdlTblFltrStr is null, don't filter ===========
        if(this.rghtMdlTblFltrStr){ 
          for(let prop of this.fltrPropsMdl){
            if(invntSrv[prop]&&invntSrv[prop].toString().toLocaleLowerCase().search(this.rghtMdlTblFltrStr.toLocaleLowerCase())>=0){
            invntSrvs.push({...invntSrv});
            break;
            }
          }
        }
        else{
        invntSrvs.push({...invntSrv});
        }
      }
    return invntSrvs;
    }

    /*-----------------------------------------------
    pre: this.invntSrvLnkList, this.tmpl, 
    post: inventory
    draws table
    -----------------------------------------------*/
    drawRghtMdlTbl(){
    let rtrn='';
    let hdrs='';
    let el=document.getElementById(this.newInvntSrvInvntSrvLstId);
    //if element doesn't exist, don't do anything.
      if(!el){
      return null;
      }
      //generate table header
      for(let hdr of this.tmpl.invntSrvRghtMdlTblHdArr){
      hdrs+=this.tmpl.invntSrvRghtMdlTblHdCll[0]+sortTblHdrTmplng(this.tmpl.invntSrvMdlTblHdCllIcn,hdr,this.rghtMdlTblCol==hdr.name?this.rghtMdlTblColDir:null)+this.tmpl.invntSrvRghtMdlTblHdCll[1];
      }

    let lnkedRow='';
    let invntSrvsRow='';
    let lnkedHsh={};
    let pObj={};
      if(this.invntSrvLnkList){
        if(this.rghtMdlTblStatusStr){
        pObj['status']=this.rghtMdlTblStatusStr;
        }
        if(this.rghtMdlTblTypeStr){
        pObj['type_uuid']=this.rghtMdlTblTypeStr;
        }

      let invntSrvLnkList=this.fltrInvntSrvsMdl(this.invntSrvLnkList,pObj,this.rghtMdlTblCol,this.rghtMdlTblColDir);
        for(let isl of invntSrvLnkList){
        let dur=isl.srv_durtn===null?'None':isl.srv_durtn;
        //if the isl is not type product, the buy price doesn't make sense. Setting format of buying price to N/A
        let buyType=null;
          if(isl.type=='product'){
          buyType=isl.price_type_name;
          }

        lnkedRow+=`
        <tr class="mdlTblSlct">
          <td>*</td>
          <td>${isl.name}</td>
          <td>${isl.type}</td>
          <td>${isl.status_name}</td>
          <td>${dur}</td>
          <td>${isl.amnt}</td>
          <td>`+invntSrvPrcFormat(isl.buy,buyType)+`</td>
          <td>${isl.sell}</td>
          <td>
            <div class="moduleTblCellActns">
              <div name="invntSrvDisable" class="menuIcon" onclick=invntSrvObj.rmDrawInvntSrvLnkList("${isl.invntSrvuuid}"); title="Remove from Inventory/Services">`+getEvalIcon(iconSets, state.user.config.iconSet, 'disable')+`</div>
            </div>
          </td>
        </tr>
        `;
        }
      }

    //not linked items
    pObj={};
      if(this.rghtMdlTblStatusStr){
      pObj['status']=this.rghtMdlTblStatusStr;
      }
      if(this.rghtMdlTblTypeStr){
      pObj['type_uuid']=this.rghtMdlTblTypeStr;
      }


    //grabbing the list fresh because this.invntSrvList is used for the main table of this module
    let invntSrvList=getInvntSrvArr(pObj,this.rghtMdlTblCol,this.rghtMdlTblColDir);
    invntSrvList=this.fltrInvntSrvsMdl(invntSrvList);
      for(let is of invntSrvList){
        //don't list if item is linked or the item in question
        if(is.uuid==this.invntSrvId||(this.invntSrvLnkIndxHsh&&this.invntSrvLnkIndxHsh.hasOwnProperty(is.uuid))){
        continue;
        }
      let dur=is.srv_durtn===null?'None':is.srv_durtn;
      //if the isl is not type product, the buy price doesn't make sense. Setting format of buying price to N/A
      let buyType=null;
        if(is.type=='product'){
        buyType=is.price_type_name;
        }
    
      invntSrvsRow+=`
      <tr class="invntSrvsNA">
        <td>&nbsp;</td>
        <td>${is.name}</td>
        <td>${is.type}</td>
        <td>${is.status_name}</td>
        <td>${dur}</td>
        <td>${is.amnt}</td>
        <td>`+invntSrvPrcFormat(is.buy,buyType)+`</td>
        <td>${is.sell}</td>
        <td>
          <div class="moduleTblCellActns">
            <div name="invntSrvDisable" class="menuIcon" onclick=invntSrvObj.addDrawInvntSrvLnkList("${is.uuid}"); title="Add to Inventory/Service">`+getEvalIcon(iconSets, state.user.config.iconSet, 'addBox')+`</div>
          </div>
        </td>
      </tr>
      `;
      }

    el.innerHTML=this.tmpl.invntSrvRghtMdlTblStrt+hdrs+lnkedRow+invntSrvsRow+this.tmpl.invntSrvRghtMdlTblEnd;
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
      pObj['type_uuid']=this.typeStr;
      }

    this.invntSrvList=getInvntSrvArr(pObj,this.sortCol,this.sortColDir);
    let invntSrvList=this.fltrInvntSrvs();
    this.invntSrvHsh={};
      for(let is of this.invntSrvList){
      this.invntSrvHsh[is.uuid]={...is};
      }
    let cntnt='';
      for(let invntSrv of invntSrvList){
      let dur=invntSrv.srv_durtn===null?'None':invntSrv.srv_durtn;
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
            <div name="invntSrvEdit" class="menuIcon" onclick=invntSrvObj.updtInvntSrvRghtMod("`+invntSrv.uuid+`"); title="Edit Inventory/Service">`+getEvalIcon(iconSets, state.user.config.iconSet, 'edit')+`</div>
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
    this.hookMdlFltrSlctStts();
    this.hookMdlFltrSlctType();
    this.hookMdlFltrInpt();
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
