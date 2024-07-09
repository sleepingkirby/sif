if(typeof invcsRghtMod==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
manage inventory and services
-------------------------------------------*/
  class invcsRghtMod{
    constructor(){
    this.invcsList=null;
    this.invcsListHsh=null;
//CREATE TABLE invcs_items(uuid text not null primary key, type_id text null, invntSrv_id text null, ord int null, name text not null, price real, price_type_id text null, notes null, foreign key(invntSrv_id) references invntSrv(uuid), foreign key(type_id) references type(uuid), foreign key(price_type_id) references type(uuid));
    //this.invcsNewItemsList=null;
    this.invcsNewItemsList=[];
    this.statuses=null;
    this.types=null;
    this.typesHsh=null;
    this.typesIdHsh=null;
    this.users=null;
    this.customers=null;
    this.invntSrvItems=null;
    this.invcsNewApptId=null;
    this.invcsNewFrmId='invcsNewForm';
    this.apptId=null;

    this.tmpl={};
    this.tmpl.rghtMod=`
    <div id="invcsNewForm">
      <div class="lbl">Invoice</div>
      <div id="invcsNewFormUUID">
        <input id="invcsNewFormInfoUUID" name="invcs[uuid]" type="hidden" />
      </div>
      <div id="invcsNewFormInfo">
        <div id="invcsNewFormInvcsStts" class="row">
          <div class="flexLeft flexCol">
            <div style="margin-bottom:6px;">
              <select id="invcsSelectStatus" name="invcs[invcs_status_id]" title="Invoice Status">
                <option>status</option>
              </select>
            </div>
            <div class="flexRight">create: <span name="invcs[create_date]" style="margin-left:6px;">0000-00-00</span></div>
          </div>
          <div class="flexRight" style="align-items:center;">
            <div class="lbl" style="margin-right:6px; margin-bottom:0px;">due:</div>
            <input type="datetime-local" name="invcs[due_date]" title="Due Date" value="${toInptValFrmt()}"/>
          </div>
        </div>
        <div class="row" style="justify-content: flex-end;">
          <div style="align-items:center;">
            <div class="lbl" style="margin-right:6px; margin-bottom:0px;">paid:</div>
            <input type="datetime-local" name="invcs[paid_date]" title="Paid Date" value="${toInptValFrmt()}"/>
          </div>
        </div>
        <div class="row">
          <div>
            <div style="font-weight:600; align-items:center;">Total: $</div>
            <div class="inptNumNumRszWrap inptNumPrc">
              <input class="inptNumRsz" type="number" name="invcs[total]" step=".2" title="invoice total"/>
            </div>
          </div>
          <select id="invcsSelectByUser" name="invcs[byUser_id]" title="User created">
            <option>by user</option>
          </select>
        </div>
        <div class="row">
          <div>
            <div style="font-weight:600; align-items:center;">Paid: $</div>
            <div class="inptNumNumRszWrap inptNumPrc">
              <input class="inptNumRsz" type="number" name="invcs[total_paid]" step=".2" title="invoice amount paid"/>
            </div>
          </div>
          <select id="invcsSelectForUser" name="invcs[forUser_id]" title="User created for">
            <option>for user</option>
          </select>
        </div>
        <div class="mdlSubBoxOutln" style="flex-direction:column; align-items:stretch;">
          <div class="row flexRight">
            <select name="invcsNewItem" title="New Invoice Item">
              <option>new item</option>
            </select>
            <div class="midBtn" title="Add New Invoice Item" style="margin-left: 12px; width:30px;" onclick=invcsRghtModObj.addInvcsNewItemsListRedrw()>`+getEvalIcon(iconSets, state.user.config.iconSet, 'addCircle')+`</div>
          </div>
          <div id="invcsNewItems">
          table
          </div>
        </div>
        <div style="justify-content:flex-end;">
          <input id="invcsNewFormUpdtBtn" style="display:none;" type="submit" value="Update" onclick=invcsRghtModObj.updtInvcs() disabled/>
          <input id="invcsNewFormAddBtn" style="" type="submit" value="Create" onclick=invcsRghtModObj.newInvcs()  disabled/>
        </div>
      </div>
    </div>
    `;
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
      if(propNm=='type_id'){
      this.invcsNewItemsList[indx]["type"]=this.typesIdHsh['invntSrv'][""][ths.value];
      }
      //if item price or amount is modified, get rid of override price.
      if(propNm=='sell'||propNm=='addAmnt'){
      delete this.invcsNewItemsList[indx]["ovrrdPrice"];
      }
    }

    /*-----------------------------------------------
    pre: this.updtInvcsNewItemsTbl, ths, this.genInvcsNewItemsTbl(), document.getElementById('invcsNewItems')
    post: this.updtInvcsNewItemsTbl
    updates this.updtInvcsNewItemsTbl, redraw the table
    -----------------------------------------------*/
    updtInvcsNewItemsTblRdrw(indx, propNm=null, ths){
    this.updtInvcsNewItemsTbl(indx, propNm, ths);
    this.newInvcsTblTtlRedrw();
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
      this.newInvcsTblTtlRedrw();
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
    this.newInvcsTblTtlRedrw();

      if(this.invcsNewItemsList.length<=0){
      let mode=this.invcsNewApptId?'update':'create';
      this.flipNewInvcsBtn(mode, true);
      }
    }

    /*-----------------------------------------------
    pre:
    post:
    adds invcs item to table and redraw
    -----------------------------------------------*/
    addInvcsNewItemsListRedrw(){
    //get valuefrom
    let els=document.getElementsByName("invcsNewItem");
      if(!this.invntSrvItems.hasOwnProperty(els[0].value)){
      return null;
      }
    this.invcsNewItemsList.push({'addAmnt':1, ...this.invntSrvItems[els[0].value]});
    this.newInvcsTblTtlRedrw();

      if(this.invcsNewItemsList.length>0){
      let mode=this.invcsNewApptId?'update':'create';
      this.flipNewInvcsBtn(mode, false);
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
    let sellRaw=null;
    let sell=null;
    let ttl=0;

      for(let i in this.invcsNewItemsList){
      let addAmnt=this.invcsNewItemsList[i].hasOwnProperty('addAmnt')?this.invcsNewItemsList[i].addAmnt:0;
      prdSlct=genSlctHshIndx(prodTypeHsh, this.invcsNewItemsList[i].type_id);
      prcSlct=genSlctHshIndx(prcTypeHsh, this.invcsNewItemsList[i].price_type_id);
      sellRaw=this.invcsNewItemsList[i].hasOwnProperty('sell')?this.invcsNewItemsList[i].sell:this.invcsNewItemsList[i].price;
        switch(this.invcsNewItemsList[i].price_type_name){
          case 'percentage':
            if(lastSubTtl!==null){
              if(this.invcsNewItemsList[i].type=='discount'){
              subTtl=Number(lastSubTtl * (1 - (Number(sellRaw) / 100)));
              }
              else if(this.invcsNewItemsList[i].type=='service'){
              //subTtl=Number(lastSubTtl * (Number(this.invcsNewItemsList[i].sell) / 100).toFixed(2)).toFixed(2);
              subTtl=Number(lastSubTtl * Number(sellRaw) / 100);
              //a service with a percentage price type is its own item in invoice. Hence add lastSubTtl to ttl so this one can be counted as own item.
              ttl+=Number(lastSubTtl);
              }
            lastSubTtl=Number(subTtl);
            }
            //anything else doesn't make sense.
          break;
          case 'deferred':
            //no price
          break;
          default:
          //static
            if(this.invcsNewItemsList[i].type=='discount'&&lastSubTtl!==null){
            //discount with a static price. ex. 5 dollar coupon
            subTtl=Number(lastSubTtl) - (Number(sellRaw) * Number(addAmnt));
            lastSubTtl=Number(subTtl);
            }
            else{
              if(this.invcsNewItemsList[i].hasOwnProperty('ovrrdPrice')&&this.invcsNewItemsList[i].ovrrdPrice!=null){
              subTtl=Number(this.invcsNewItemsList[i].ovrrdPrice);
              }
              else{
              subTtl=(Number(sellRaw) * Number(addAmnt)).toFixed(2);
              }

              //======== need to figure out how to calculate total
              /* assuming price type is always static

              different items:
              1) a) products. price type static. Can never be percentage as no actual, physical product's actual price is a percentage of another product. If this is needed, apply via discount.
                 b) products. price type deferred. This product has no pricing of it's own. It's part of a large bundle. Hence, deferres to the parent item for the price.
              2) a) service. Price type static. ex. haircut is 10.20
                 b) service. price type percentage. If a service is included in a product. Ex. buy a shampoo, the hairwashing is 90% price of the shampoo. Most people don't do this, but just in case.
              3) a) discount. price type static. ex. 5 dollar off coupon.
                 b) discount. price type percentage. ex. 10% off.
              */

              //if current item is valid, add lastSubTtl to ttl. (because the lastSubTtl will always reflect the proper price to be added to the ttl.)
            ttl+=Number(lastSubTtl);
            lastSubTtl=Number(subTtl);
            }
          break;
        }

        //sanitizing subTtl for display
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
                 <input class="inptNumRsz minInptNum" type="number" name="invcsNewItems[0][prc]" step=".2" value="${sell}" onchange=invcsRghtModObj.updtInvcsNewItemsTblRdrw(${i},"sell",this) />
                 `+prcntSgn+`
               </div>
        `;
        amntHtml=`
               <div class="inptNumNumRszWrap minInptNumWarp">
                 <input class="inptNumRsz minInptNum" type="number" name="invcsNewItems[0][prc]" step="1" value="${addAmnt}" onchange=invcsRghtModObj.updtInvcsNewItemsTblRdrw(${i},"addAmnt",this) />
               </div>
        `;
        subTtlHtml=`
               <div class="invcsNewItemsSubTtl inptNumNumRszWrap minInptNumWarp">
                 $<input class="inptNumRsz minInptNum" type="number" name="invcsNewItems[0][prc]" step=".2" value="${subTtl}" onchange=invcsRghtModObj.updtInvcsNewItemsTblRdrw(${i},"ovrrdPrice",this) />
               </div>
        `;
        }

      let up=i>0?`<div onclick=invcsRghtModObj.swapInvcsNewItemsListRedrw(${i},'up')>`+getEvalIcon(iconSets, state.user.config.iconSet, 'arrowUpCrcl')+`</div>`:``;
      let dwn=i<this.invcsNewItemsList.length-1?`<div onclick=invcsRghtModObj.swapInvcsNewItemsListRedrw(${i},'down')>`+getEvalIcon(iconSets, state.user.config.iconSet, 'arrowDwnCrcl')+`</div>`:``;
      newItmTbl+=`
         <tr>
           <td>
             <div class="invcsNewItemActns">
               <div onclick=invcsRghtModObj.delInvcsNewItemsListRedrw(${i})>`+getEvalIcon(iconSets, state.user.config.iconSet, 'delete')+`</div>
               `+up+`
               `+dwn+`
             </div>
           </td>
           <td>
             <textarea class="smallTAInpt" name="invcsNewItems[0][name]" type="text" placeholder="Name">${this.invcsNewItemsList[i].name}</textarea>
           </td>
           <td>
             <select class="invcsNewItemsSlct" name="invcsNewItems[0][type]" onchange=invcsRghtModObj.updtInvcsNewItemsTblRdrw(${i},"type_id",this) >
             `+prdSlct+`
             </select>
           </td>
           <td>
             <select class="invcsNewItemsSlct" name="invcsNewItems[0][type]" onchange=invcsRghtModObj.updtInvcsNewItemsTblRdrw(${i},"price_type_id",this) >
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


      //loop has reach it's end, remaining lastSubTtl gets added to the ttl// done further down.
      if(lastSubTtl!==null){
      ttl=Number(ttl) + Number(lastSubTtl);
      }

    let ttlEl=document.getElementsByName("invcs[total]");
      if(ttlEl&&ttlEl.length>=1){
      ttlEl[0].value=Number(ttl||0).toFixed(2);
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
    -----------------------------------------------*/
    newInvcsTblTtlRedrw(){
    document.getElementById('invcsNewItems').innerHTML=this.genInvcsNewItemsTbl();
    }

    /*-----------------------------------------------
    pre: none
    post: none
    generate status dropdown
    -----------------------------------------------*/
    genSttsSlct(sttsNm=null){
    return genSttsSlct(this.statuses,null,sttsNm);
    }

    /*-----------------------------------------------
    pre: this.invcsListHsh
    post: html drawn
    fill the right modal with invoice
    -----------------------------------------------*/
    fillRghtMod(uuid=null){
      if(uuid===null){
      return null;
      }

    //function getInvcs(paramObj, ord, desc=false, limit=null, offset=null){
    let invc=getInvcs({'invcs.uuid':uuid});
      if(invc&&invc.length>0){
      invc=invc[0];
      }
    this.invcsNewItemsList=getInvcItems(uuid);
    let els=document.querySelectorAll('#'+this.invcsNewFrmId+' *[name^="invcs["]');

    let idEl=document.getElementById('invcsNewFormInfoUUID').value=uuid;

      for(let el of els){
      let nm=getSubs(el.getAttribute('name'),'invcs');
        if(el.tagName=="SPAN"){
          if(invc[nm]){
          el.innerText=invc[nm];
          }
        }
        else if(nm=="uuid"){
        }
        else{
          if(invc[nm]){
          el.value=invc[nm];
          }
        }
      }
    this.newInvcsTblTtlRedrw();
    }

    /*-----------------------------------------------
    pre: getSub(), right modal
    post: clears the right Modal
    clears the right modal
    -----------------------------------------------*/
    clearRghtMod(){
    this.invcsNewApptId=null;
    let els=document.querySelectorAll('#'+this.invcsNewFrmId+' *[name^="invcs["]');
    let dt=new Date();
      for(let el of els){
      let nm=getSubs(el.getAttribute('name'),'invcs');
        if(el.tagName=="SPAN"){
        el.innerText=dtTmDbFrmt();
        }
        else if(el.tagName=="SELECT"){
        slctToDefault(el);
        }
        else if(el.type.match(/datetime/)){
        el.value=dtTmDbFrmt(dt);
        }
        else{
        el.value='';
        }
      }
    this.invcsNewItemsList=[];
    this.flipCrtUpdtBtn('create');
    this.flipNewInvcsBtn('create', true);
    this.newInvcsTblTtlRedrw();
    }

    /*-----------------------------------------------
    pre: this.fillRghtMod() 
    post: html drawn
    -----------------------------------------------*/
    updtInvcsRghtMod(uuid=null){
      if(!uuid||!this.invcsListHsh.hasOwnProperty(uuid)){
      return null;
      }
    this.invcsNewApptId=uuid;
    //fill right mod
    this.fillRghtMod(uuid);
    this.flipNewInvcsBtn('update', false);
    this.flipCrtUpdtBtn('update');
    mainObj.modRghtOpenClose();
    }

    /*-----------------------------------------------
    pre: createInvcs()
    post: db updated. main table redrawn. rghtMod closed
    gathers data, writes to db. 
    -----------------------------------------------*/
    newInvcs(refresh=true){
    //invcsNewForm
    let els=document.querySelectorAll('#'+this.invcsNewFrmId+' *[name^="invcs["]');
    let invcs={};
      for(let el of els){
      let nm=getSubs(el.name,'invcs');
      invcs[nm]=el.value;
      }
      if(createInvcs(invcs, this.invcsNewItemsList)){
        if(refresh&&state.depModuleObjs.hasOwnProperty("invcs")){
        state.depModuleObjs.invcs.drawTbl();
        }
      mainObj.modRghtOpenClose();
      mainObj.setFloatMsg('Invoice Created');
      }
      else{
      mainObj.setFloatMsg('Error in creating new invoice.');
      }
    }

    /*-----------------------------------------------
    pre: updtInvcs()
    post: db updated. main table redrawn. rghtMod closed
    gathers data, writes to db. 
    -----------------------------------------------*/
    updtInvcs(refresh=true){
    let els=document.querySelectorAll('#'+this.invcsNewFrmId+' *[name^="invcs["]');
    let invcs={};
      for(let el of els){
      let nm=getSubs(el.name,'invcs');
      invcs[nm]=el.value;
      }
   
      //formats the dates
      if(invcs.hasOwnProperty('paid_date')&&invcs.paid_date){
      invcs.paid_date=dtTmDbFrmt(invcs.paid_date);
      }

      //formats teh dates
      if(invcs.hasOwnProperty('due_date')&&invcs.due_date){
      invcs.due_date=dtTmDbFrmt(invcs.due_date);
      }

    let elId=document.getElementById("invcsNewFormInfoUUID");
    

      if(updtInvcs(elId.value, invcs, this.invcsNewItemsList)){
        if(refresh&&state.depModuleObjs.hasOwnProperty("invcs")){
        state.depModuleObjs.invcs.drawTbl();
        }

      mainObj.modRghtOpenClose();
      mainObj.setFloatMsg('Invoice Updated');
      }
      else{
      mainObj.setFloatMsg('Error in update invoice.');
      }
    }

    /*-----------------------------------------------
    pre: none 
    post: html drawn
    generates and fills the right modal status dropdown
    -----------------------------------------------*/
    popRghtModStts(sttsNm=null){
    let stts=document.getElementById('invcsSelectStatus');
      if(stts){
      stts.innerHTML=this.genSttsSlct(sttsNm);
      }
    return null;
    }

    /*-----------------------------------------------
    pre: none 
    post: html drawn
    drawn right modal
    -----------------------------------------------*/
    genRghtMod(){
    document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML=this.tmpl.rghtMod;
    document.getElementById('invcsNewItems').innerHTML=this.genInvcsNewItemsTbl();

    //status dropdown
    this.popRghtModStts();

    //for and by users for drop down
    this.users=getUsers();
    const {customer:customers, '':users}=spltUsr(this.users);
    this.customers=customers;
    document.getElementById('invcsSelectByUser').innerHTML=genUsrSlct(users,'username','Username','uuid',state.user.uuid);
    document.getElementById('invcsSelectForUser').innerHTML=genUsrSlct(customers,'username','Username','uuid',state.user.uuid);

    //fill inventory/services items
    this.invntSrvItems=getInvntSrv(null, false, 'name', 'asc');
    document.getElementsByName('invcsNewItem')[0].innerHTML=genInvntSrv(this.invntSrvItems);
    }

    /*----------------------------------
    pre: 
    post:
    ----------------------------------*/
    flipCrtUpdtBtn(mode=null){
    let crt=document.getElementById('invcsNewFormAddBtn');
    let updt=document.getElementById('invcsNewFormUpdtBtn');
      if(!mode){
      crt.style.display!=''?crt.style.removeProperty('display'):crt.style.display='none';
      updt.style.display!=''?updt.style.removeProperty('display'):updt.style.display='none';
      }

      if(mode=='create'){
      crt.style.removeProperty('display');
      updt.style.display='none';
      }

      if(mode=='update'){
      crt.style.display='none';
      updt.style.removeProperty('display');
      }
    }

    /*----------------------------------
    pre: state, selectEventInvntSrv(), this.invntSrvItems, this.newInvcsTblTtlRedrw(), mainObj.modRghtOpenClose()
    post: page updated
    populate and open rght modal with appointment info
    ----------------------------------*/
    apptToInvcs(id=null){
      if(!id){
      return null;
      }
    let appt=selectViewEventUser({'event_id':id});
      if(!appt||appt.length<=0){
      return null;
      }
    let apptInvntSrv=selectEventInvntSrv(id);
      for(let ais of apptInvntSrv){
      //this.invcsNewItemsList.push(this.invntSrvItems[ais.invntSrv_id]);
        if(this.invntSrvItems.hasOwnProperty(ais.invntSrv_id)){
        this.invcsNewItemsList.push({...this.invntSrvItems[ais.invntSrv_id],addAmnt:1});
        }
      }

    //sets users and datetime
    let el=document.getElementsByName("invcs[byUser_id]");
    el[0].value=appt[0].byUser_uuid;
    el=document.getElementsByName("invcs[forUser_id]");
    el[0].value=appt[0].cust_uuid;
    el=document.getElementsByName("invcs[due_date]");
    el[0].value=toInptValFrmt();
    el=document.getElementsByName("invcs[paid_date]");
    el[0].value=toInptValFrmt();

    //updates invoice total_paid to total.
    state.pageVars.appt.id=null;
    this.newInvcsTblTtlRedrw();
    el=document.getElementsByName("invcs[total]");
    let total=el[0].value;
    el=document.getElementsByName("invcs[total_paid]");
    el[0].value=total;
    
    //set status
    //invcs[invcs_status_id]
    el=document.getElementsByName("invcs[invcs_status_id]");
    let dn=this.statuses.find((e)=>{return e.name=="done"});
    el[0].value=dn.uuid;

    this.flipNewInvcsBtn();
    }

    /*-----------------------------------------------
    pre:
    post:
    -----------------------------------------------*/
    popRghtMod(invcsId=null,apptId=null,updt=false){
    this.statuses=selectStatus();
    this.types=selectType('invntSrv');
    this.typesHsh=sepTypesHsh(this.types);
    this.typesIdHsh=sepTypesIdHsh(this.types);
    this.genRghtMod();
    //document.getElementById('invcsNewItems').innerHTML=this.genInvcsNewItemsTbl();
    //start making invoice from appointment
    this.clearRghtMod();
    this.popRghtModStts('done');
    this.flipCrtUpdtBtn('create');
    this.flipNewInvcsBtn('create', true);
      if(invcsId){
      this.fillRghtMod(invcsId);
      }
      if(apptId){
      this.apptToInvcs(apptId);
      }      
      if(updt){
      this.flipCrtUpdtBtn('update');
      this.flipNewInvcsBtn('update', false);
      }
    }
  }

var invcsRghtModObj=new invcsRghtMod();
state.depModuleObjs['invcsRghtMod']=invcsRghtModObj;
}
