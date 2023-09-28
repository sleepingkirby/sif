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
