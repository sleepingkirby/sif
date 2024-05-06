/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting setting the events
-----------------------------------------------*/

/*-----------------------------------------------
pre: sqlObj
post: update database with new inventory/service
create new inventory/service
-----------------------------------------------*/
function createInvntSrv(name, typeId, statusId, durtn, sku, amnt, buy, sell, priceTypeId, notes, isLnkArr){
let evnt_uuid=createUUID();

let query='insert into invntSrv(uuid, name, type_id, create_date, mod_date, status, srv_durtn, sku, amnt, buy, sell, price_type_id, notes) values($uuid, $name, $type_id, datetime("now"), datetime("now"), $status_id, $durtn, $sku, $amnt, $buy, $sell, $price_type_id, $notes)' ;
let queryDfltStts='insert into invntSrv(uuid, name, type_id, create_date, mod_date, status, srv_durtn, sku, amnt, buy, sell, price_type_id, notes) values($uuid, $name, $type_id, datetime("now"), datetime("now"), (select uuid from status where name="active"), $durtn, $sku, $amnt, $buy, $sell, $price_type_id, $notes)';
let uuid=createUUID();
let obj={$uuid:uuid, $name:name, $type_id:typeId, $status_id:statusId, $durtn:durtn, $sku:sku, $amnt:amnt, $buy:buy, $sell:sell, $price_type_id:priceTypeId, $notes:notes};
sqlObj.runQuery(statusId==null?queryDfltStts:query,obj);

  //set what inventory/service is under this inventory/service
  let subQ='';
  let subObj='';

  if(isLnkArr&&typeof isLnkArr=="object"&&isLnkArr.length>0){
  query='insert into invntSrvLnk(uuid, invntSrvLnkPrnt, invntSrvLnkItm, amnt) values($uuid, $prnt, $itm, $amnt)';
  obj={};
  console.log(isLnkArr);
    for(let lnk of isLnkArr){
    obj={$uuid:createUUID(),$prnt:uuid,$itm:lnk.invntSrvuuid,$amnt:lnk.addAmnt};
    sqlObj.runQuery(query,obj);
    }
  }
}

/*-----------------------------------------------
pre: sqlObj
post: update database with new inventory/service
update inventory/service
-----------------------------------------------*/
function updateInvntSrv(uuid, hsh, lnkArr=null){
  if(!uuid){
  return null;
  }
let query='update invntSrv set mod_date=datetime("now")';
let obj={};
  if(hsh.hasOwnProperty('name')&&hsh.name){
  query+=", name=$name";
  obj['$name']=hsh.name;
  }
  if(hsh.hasOwnProperty('status')&&hsh.status){
  query+=", status=$status";
  obj['$status']=hsh.status;
  }
  if(hsh.hasOwnProperty('srv_durtn')&&hsh.srv_durtn){
  query+=", srv_durtn=$srv_durtn";
  obj['$srv_durtn']=hsh.srv_durtn;
  }
  if(hsh.hasOwnProperty('sku')&&hsh.sku){
  query+=", sku=$sku";
  obj['$sku']=hsh.sku;
  }
  if(hsh.hasOwnProperty('amnt')&&hsh.amnt){
  query+=", amnt=$amnt";
  obj['$amnt']=hsh.amnt;
  }
  if(hsh.hasOwnProperty('buy')&&hsh.buy){
  query+=", buy=$buy";
  obj['$buy']=hsh.buy;
  }
  if(hsh.hasOwnProperty('sell')&&hsh.sell){
  query+=", sell=$sell";
  obj['$sell']=hsh.sell;
  }
  if(hsh.hasOwnProperty('price_type_id')&&hsh.price_type_id){
  query+=", price_type_id=$price_type_id";
  obj['$price_type_id']=hsh.price_type_id;
  }
  if(hsh.hasOwnProperty('notes')&&hsh.notes){
  query+=", notes=$notes";
  obj['$notes']=hsh.notes;
  }
query+=" where uuid=$uuid";
obj['$uuid']=uuid;
sqlObj.runQuery(query,obj);

  if(lnkArr&&lnkArr.length>0){
  //CREATE TABLE invntSrvLnk(uuid text primary key, invntSrvLnkPrnt text not null, invntSrvLnkItm text not null, foreign key(invntSrvLnkPrnt) references invntSrv(uuid), foreign key(invntSrvLnkItm) references invntSrv(uuid));
  query='delete from invntSrvLnk where invntSrvLnkPrnt=$uuid';
  obj={$uuid:uuid};
  sqlObj.runQuery(query,obj);
  
  query='insert into invntSrvLnk(uuid, invntSrvLnkPrnt, invntSrvLnkItm, amnt) values($uuid, $prnt, $itm, $amnt)';
  obj={};
    for(let lnk of lnkArr){
    obj={$uuid:createUUID(),$prnt:uuid,$itm:lnk.invntSrvuuid,$amnt:lnk.addAmnt};
    sqlObj.runQuery(query,obj);
    }
  }
}

/*-----------------------------------------------
pre: sqlObj
post: update database with new inventory/service
update inventory/service
-----------------------------------------------*/
function updateInvntSrvLnk(uuid, isUuid, hsh){
  if(!uuid&&!isUuid){
  return null;
  }
//CREATE TABLE invntSrvLnk(uuid text primary key, invntSrvLnkPrnt text not null, invntSrvLnkItm text not null, amnt float null default 0, foreign key(invntSrvLnkPrnt) references invntSrv(uuid), foreign key(invntSrvLnkItm) references invntSrv(uuid));

let query='update invntSrvLnk set';
let obj={};
  if(hsh.hasOwnProperty('invntSrvLnkPrnt')&&hsh.invntSrvLnkPrnt){
  query+=", invntSrvLnkPrnt=$invntSrvLnkPrnt";
  obj['$invntSrvLnkPrnt']=hsh.invntSrvLnkPrnt;
  }
  if(hsh.hasOwnProperty('amnt')&&hsh.amnt){
  query+=", amnt=$amnt";
  obj['$amnt']=hsh.amnt;
  }

  if(uuid){
  query+=" where uuid=$uuid";
  obj['$uuid']=uuid;
  }
  else if(isUuid){
  query+=" where invntSrvLnkItm=$isUuid";
  obj['$isUuid']=isUuid;
  }

sqlObj.runQuery(query,obj);
}

/*-----------------------------------------------
pre: sqlObj
post: update database inventory/service with new status
update database inventory/service with new status
-----------------------------------------------*/
function updtInvntSrvStts(uuid, stts, id=true){
let query="";
  if(id){
  query="update invntSrv set status=$stts where uuid=$uuid";
  }
  else{
  query='update invntSrv set status=(select uuid from status where name=$stts) where uuid=$uuid';
  }
let obj={$uuid:uuid, $stts:stts};
sqlObj.runQuery(query,obj);
}

/*----------------------------------------------
pre: sqlObj
post: none
gets all the invntSrv records in hash
----------------------------------------------*/
function getInvntSrv(username=null, excldNull=false, ord=null, desc='desc'){
let whereUsr=' where ';
  if(excldNull){
  whereUsr+='username=$username';
  }
  else{
  whereUsr+='username is null or username=$username';
  }

let q=`
select
invntSrv.uuid,
invntSrv.name,
invntSrv.type_id as type_id,
invntSrvTyp.name as type,
invntSrv.create_date,
invntSrv.mod_date,
invntSrv.status as status,
isLnk.invntSrvLnkPrnt as parent_id,
status.name as status_name,
users.username as username,
c.fName as fName,
c.surName as surName,
c.mName as mName,
invntSrv.srv_durtn,
invntSrv.sku,
(select sum(amount) from invntSrvBuff where state=1 and invntSrv_uuid=invntSrv.uuid) as rsrv_amnt,
invntSrv.amnt,
invntSrv.buy,
invntSrv.sell,
invntSrv.price_type_id,
prcTyp.name as price_type_name,
invntSrv.notes
from invntSrv
left join type as invntSrvTyp on invntSrv.type_id=invntSrvTyp.uuid
left join status on invntSrv.status=status.uuid
left join invntSrv_users on invntSrv.uuid=invntSrv_users.invntSrv_uuid
left join users on invntSrv_users.users_id=users.uuid
left join contacts as c on users.uuid=c.user_id
left join type as prcTyp on invntSrv.price_type_id=prcTyp.uuid
left join invntSrvLnk as isLnk on invntSrv.uuid=isLnk.invntSrvLnkItm
${whereUsr}
`;

  switch(ord){
  case 'name':
  q+=' order by invntSrv.name';
  q+=desc=='desc'?' desc':' asc';
  break;
  default:
  break;
  }

let invntSrv=sqlObj.runQuery(q,{$email:username});
let invntSrvObj={};
  for(const r of invntSrv){
    if(!invntSrvObj.hasOwnProperty(r.uuid)){
    invntSrvObj[r.uuid]={...r};
    delete invntSrvObj[r.uuid].username;
    invntSrvObj[r.uuid].users=[];
    delete invntSrvObj[r.uuid].parent_id;
    invntSrvObj[r.uuid].parentIds=[];
    }

    if(r.username&&r.username!=""){
    invntSrvObj[r.uuid].users.push(r.username);
    }
    if(r.parent_id&&r.parent_id!=""){
    invntSrvObj[r.uuid].parentIds.push(r.parent_id);
    }
  }
return invntSrvObj;
}

/*----------------------------------------------
pre: sqlObj
post: none
gets all the invntSrv records in array
----------------------------------------------*/
function getInvntSrvArr(paramObj, ord, desc=false, limit=null, offset=null){
let query=`
select
invntSrv.uuid as uuid,
invntSrv.name as name,
invntSrv.type_id as type_id,
invntSrvTyp.name as type,
invntSrv.create_date as create_date,
invntSrv.mod_date as mod_date,
invntSrv.status as status,
status.name as status_name,
users.username as username,
c.fName as fName,
c.surName as surName,
c.mName as mName,
invntSrv.srv_durtn as srv_durtn,
invntSrv.sku as sku,
(select sum(amount) from invntSrvBuff where state=1 and invntSrv_uuid=invntSrv.uuid) as rsrv_amnt,
invntSrv.amnt as amnt,
invntSrv.buy as buy,
invntSrv.sell as sell,
invntSrv.price_type_id as price_type_id,
prcTyp.name as price_type_name,
invntSrv.notes as notes
from invntSrv
left join type as invntSrvTyp on invntSrv.type_id=invntSrvTyp.uuid
left join status on invntSrv.status=status.uuid
left join invntSrv_users on invntSrv.uuid=invntSrv_users.invntSrv_uuid
left join users on invntSrv_users.users_id=users.uuid
left join contacts as c on users.uuid=c.user_id
left join type as prcTyp on invntSrv.price_type_id=prcTyp.uuid
`;

let and='';
let tmp=null;
let obj={};

  /*
  if(paramObj&&Object.keys(paramObj).length>0){
  query+='where ';
    for(let param of Object.keys(paramObj)){
      if(paramObj[param]){
      query+=`${and} ${param}=\$${param}`;
      obj[`\$${param}`]=paramObj[param];
      and=' and';
      }
    }
  }
  */
obj=[];
  if(paramObj&&Object.keys(paramObj).length>0){
  query+='where ';
    for(let param of Object.keys(paramObj)){
      if(paramObj[param]){
      query+=`${and} ${param}=?`;
      obj.push(paramObj[param]);
      and=' and';
      }
    }
  }



  query+=' group by invntSrv.uuid';

  switch(ord){
  case 'name':
  query+=' order by name';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'mod_date':
  query+=' order by mod_date';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'create_date':
  query+=' order by create_date';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'status_name':
  query+=' order by status';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'type':
  query+=' order by type';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'sell':
  query+=' order by sell';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'buy':
  query+=' order by buy';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'amnt':
  query+=' order by amnt';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'price_type_name':
  query+=' order by price_type_name';
  query+=desc=='desc'?' desc':' asc';
  break;
  default:
  break;
  }


  if(!isNaN(parseInt(limit))){
  query+=' limit $limit';
  obj['$limit']=limit;
  }

  if(!isNaN(parseInt(offset))){
  query+=' offset $offset';
  obj['$offset']=offset;
  }
tmp=sqlObj.runQuery(query,obj);
return tmp;
}

/*----------------------------------------------
pre: sqlObj
post: none
gets inventory/service link items
----------------------------------------------*/
function getInvntSrvLnkArr(paramObj, ord, desc=false, limit=null, offset=null){
  if(!paramObj||Object.keys(paramObj).length<=0||!paramObj.hasOwnProperty('invntSrvLnkPrnt')){
  return [];
  }

let query=`
select
isl.uuid as uuid,
invSrv.uuid as invntSrvuuid,
invSrv.name as name,
invSrv.type_id as type_id,
invntSrvTyp.name as type,
invSrv.create_date as create_date,
invSrv.mod_date as mod_date,
invSrv.status as status,
status.name as status_name,
users.username as username,
c.fName as fName,
c.surName as surName,
c.mName as mName,
invSrv.srv_durtn as srv_durtn,
invSrv.sku as sku,
invSrv.amnt as amnt,
isl.amnt as addAmnt,
invSrv.buy as buy,
invSrv.sell as sell,
invSrv.price_type_id as price_type_id,
prcTyp.name as price_type_name,
invSrv.notes as notes
from invntSrvLnk as isl
left join invntSrv as invSrv on isl.invntSrvLnkItm=invSrv.uuid
left join type as invntSrvTyp on invSrv.type_id=invntSrvTyp.uuid
left join status on invSrv.status=status.uuid
left join invntSrv_users on invSrv.uuid=invntSrv_users.invntSrv_uuid
left join users on invntSrv_users.users_id=users.uuid
left join contacts as c on users.uuid=c.user_id
left join type as prcTyp on invSrv.price_type_id=prcTyp.uuid
`;

let and='';
let tmp=null;
let obj={};
  
  
  if(paramObj&&Object.keys(paramObj).length>0){
  query+='where';
    for(let param of Object.keys(paramObj)){
      if(paramObj[param]){
      query+=`${and} ${param}=\$${param}`;
      obj[`\$${param}`]=paramObj[param];
      and=' and';
      }
    }
  }


  switch(ord){
  case 'name':
  query+=' order by name';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'mod_date':
  query+=' order by mod_date';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'create_date':
  query+=' order by create_date';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'status_name':
  query+=' order by status';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'type':
  query+=' order by type';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'sell':
  query+=' order by sell';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'buy':
  query+=' order by buy';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'amnt':
  query+=' order by amnt';
  query+=desc=='desc'?' desc':' asc';
  break;
  case 'price_type_name':
  query+=' order by price_type_name';
  query+=desc=='desc'?' desc':' asc';
  break;
  default:
  break;
  }

  if(!isNaN(parseInt(limit))){
  query+=' limit $limit';
  obj['$limit']=limit;
  }

  if(!isNaN(parseInt(offset))){
  query+=' offset $offset';
  obj['$offset']=offset;
  }

tmp=sqlObj.runQuery(query, obj);
return tmp;
}


/*-----------------------------------------------
pre: sqlObj
post: update database with new inventory/service
update inventory/service
-----------------------------------------------*/
function chngInvntSrvNum(uuid, addAmnt, op='-'){
  if(!uuid){
  return null;
  }
let is=getInvntSrvArr({'invntSrv.uuid':uuid});
let amnt=is[0].amnt;
  if(op=='+'){
  amnt=amnt+addAmnt;
  }
  else if(op=='-'){
  amnt=amnt-addAmnt;
  }

updateInvntSrv(uuid, {'amnt':amnt});
}

/*----------------------------------------------
pre: sqlObj
post: none
format buy/sell price from invntSrv
----------------------------------------------*/
function invntSrvPrcFormat(num, type){
let price='';
  if(num==''||num==null){
  return '';
  }

  switch(type){
  case 'percentage':
  let tmpnum=String(num);
    if(tmpnum.match('0.')==0){
    tmpnum=tmpnum.substr(2);
    }
  return tmpnum+'%';
  break;
  case 'static':
  return '$'+num;
  break;
  case 'deferred':
  return '';
  break;
  default:
  return 'N/A';
  break;
  }
}

