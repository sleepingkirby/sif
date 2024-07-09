/*-----------------------------------------------
pre: getInvntSrv() and everything it requires
post: none
-----------------------------------------------*/
function genInvntSrv(invntSrv, selectedUUID){
  if(!invntSrv){
  return '';
  }
let keys=Object.keys(invntSrv);
let html='';
  if(keys.length<=0){
  return html;
  }

let t='';

  for(const uuid of keys){
    if(invntSrv[uuid].type){
    t=invntSrv[uuid].type?' ('+invntSrv[uuid].type.replaceAll(/[aeiou]/g,'')+')':'';
    }

    html+=`<option value="${uuid}"${selectedUUID==uuid?" selected":""}>${invntSrv[uuid].name}${t}</option>`;
  }
return html;
}

/*-----------------------------------------------
pre: none
post: none
params: users= array of users, prop=property to display, dfltVal=default value, slsctdPrp=which property to match slctdVl against, slctdVl= the value to choose to select
generates <option/> for select elements for users
-----------------------------------------------*/
function genUsrSlct(users,prop,dfltVal='none',slctdPrp=null,slctdVl=null){
  let html="";
  html+='<option value="">'+dfltVal+'</option>';
  for(const usr of users){
    if(slctdPrp&&slctdVl&&usr[slctdPrp]==slctdVl){
    html+='<option value="'+usr.uuid+'"'+' selected >'+usr[prop]+"</option>";
    }
    else{
    html+='<option value="'+usr.uuid+'"'+'>'+usr[prop]+"</option>";
    }
  }
return html;
}

/*-----------------------------------------------
pre: none
post: none
params: users= array of users,dfltVal=default value, slsctdPrp=which property to match slctdVl against, slctdVl= the value to choose to select
generates <option/> for select elements for users with firstname and last name (abbreviated)
-----------------------------------------------*/
function genCustSlct(users,dfltVal='none',slctdPrp=null,slctdVl=null){
  let html="";
  html+='<option value="">'+dfltVal+'</option>';
  for(const usr of users){
  let fNm=usr.fName.length>=8?usr.fName.substr(0,5)+'...':usr.fName;
  let lNm=usr.surName.length>=6?usr.surName.substr(0,3)+'...':usr.surName;
  let selected='';
  let title=usr.fName+' '+usr.surName+', '+usr.email+', '+usr.cellphone||usr.phone;
    if(slctdPrp&&slctdVl&&usr[slctdPrp]==slctdVl){
    selected='selected';
    }
    html+='<option value="'+usr.uuid+'"'+' title="'+title+'" '+selected+'>'+fNm+' '+lNm+"</option>";
  }
return html;
}


/*-----------------------------------------------
pre: this.invntSrvList filled
post: none
-----------------------------------------------*/
function genInvntSrvListEls(invntSrvList,invntSrvAddedArr,objNm='apptQckObj'){
let html="";
let total=0;
let rtrn={'html':'','total':0};
  if(invntSrvList&&invntSrvAddedArr){
    for(const uuid of invntSrvAddedArr){
      if(invntSrvList.hasOwnProperty(uuid)){
      html+=`
      <div class="multiBoxListItem">
        <div class="multiBoxListItemName">${invntSrvList[uuid].name}</div>
        <div class="multiBoxListItemDel" onclick='${objNm}.delFromInvntSrvAddedArr("${uuid}");${objNm}.genInvntSrvListEls();'>x</div>
      </div>
      `;
      total+=invntSrvList[uuid]&&Number.isFinite(invntSrvList[uuid].srv_durtn)?invntSrvList[uuid].srv_durtn:0;
      }
      else{

      }
    }
  rtrn['html']=html;
  rtrn['total']=total;
  }
return rtrn;
}

