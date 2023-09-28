/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting setting the events
-----------------------------------------------*/

/*----------------------------------------------
pre: sqlObj
post: none
gets all the invntSrv records 
----------------------------------------------*/
function getInvntSrv(username=null, excldNull=false){
let whereUsr=' where username is null or username=$username';
  if(excldNull){
  whereUsr=' where username=$username';
  }
const q=`select invntSrv.uuid, invntSrv.name, type_uuid, type.name as type, invntSrv.create_date, invntSrv.mod_date, invntSrv.status, users.username as username, invntSrv.srv_durtn, invntSrv.sku, invntSrv.amnt, invntSrv.buy, invntSrv.sell, invntSrv.notes from invntSrv left join type on invntSrv.type_uuid=type.uuid left join invntSrv_users on invntSrv.uuid=invntSrv_users.invntSrv_uuid left join users on invntSrv_users.users_id=users.uuid${whereUsr}`;
let invntSrv=sqlObj.runQuery(q,{$email:username});
let invntSrvObj={};
  for(const r of invntSrv){
    if(!invntSrvObj.hasOwnProperty(r.uuid)){
    invntSrvObj[r.uuid]={...r};
    delete invntSrvObj[r.uuid].username;
    invntSrvObj[r.uuid].users=[r.username];
    }
    else{
    invntSrvObj[r.uuid].users.push(r.username);
    }
  }
return invntSrvObj;
}
