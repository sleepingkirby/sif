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

  for(const uuid of keys){
    html+=`<option value="${uuid}"${selectedUUID==uuid?" selected":""}>${invntSrv[uuid].name}</option>`;
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
pre: this.invntSrvList filled
post: none
-----------------------------------------------*/
function genInvntSrvListEls(){
let html="";
let total=0;
  if(this.invntSrvList&&this.invntSrvAddedArr){
    for(const uuid of this.invntSrvAddedArr){
    html+=`
    <div class="multiBoxListItem">
      <div class="multiBoxListItemName">${this.invntSrvList[uuid].name}</div>
      <div class="multiBoxListItemDel" onclick='apptQckObj.delFromInvntSrvAddedArr("${uuid}");apptQckObj.genInvntSrvListEls();'>x</div>
    </div>
    `;
    total+=this.invntSrvList[uuid]&&Number.isFinite(this.invntSrvList[uuid].srv_durtn)?this.invntSrvList[uuid].srv_durtn:0;
    }
  document.getElementById("apptNewApptFormApptInfoSrvLst").innerHTML=html;
  document.getElementById("apptNewApptFormApptInfoDur").value=total;
  }
}

