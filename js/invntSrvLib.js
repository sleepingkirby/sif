/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting setting the events
-----------------------------------------------*/

/*----------------------------------------------
pre: sqlObj
post: none
gets all the invntSrv records in hash
----------------------------------------------*/
function getInvntSrv(username=null, excldNull=false){
let whereUsr=' where username is null or username=$username';
  if(excldNull){
  whereUsr=' where username=$username';
  }
const q=`
select
invntSrv.uuid,
invntSrv.name,
invntSrv.type_uuid as type_uuid,
invntSrvTyp.name as type,
invntSrv.create_date,
invntSrv.mod_date,
invntSrv.status as status_id,
status.name as status_name,
users.username as username,
c.fName as fName,
c.surName as surName,
c.mName as mName,
invntSrv.srv_durtn,
invntSrv.sku,
invntSrv.amnt,
invntSrv.buy,
invntSrv.sell,
invntSrv.price_type_id,
prcTyp.name as price_type_name,
invntSrv.notes
from invntSrv
left join type as invntSrvTyp on invntSrv.type_uuid=invntSrvTyp.uuid
left join status on invntSrv.status=status.uuid
left join invntSrv_users on invntSrv.uuid=invntSrv_users.invntSrv_uuid
left join users on invntSrv_users.users_id=users.uuid
left join contacts as c on users.uuid=c.user_id
left join type as prcTyp on invntSrv.price_type_id=prcTyp.uuid
${whereUsr}
`;

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
invntSrv.type_uuid as type_uuid,
invntSrvTyp.name as type,
invntSrv.create_date as create_date,
invntSrv.mod_date as mod_date,
invntSrv.status as status_id,
status.name as status_name,
users.username as username,
c.fName as fName,
c.surName as surName,
c.mName as mName,
invntSrv.srv_durtn as srv_durtn,
invntSrv.sku as sku,
invntSrv.amnt as amnt,
invntSrv.buy as buy,
invntSrv.sell as sell,
invntSrv.price_type_id as price_type_id,
prcTyp.name as price_type_name,
invntSrv.notes as notes
from invntSrv
left join type as invntSrvTyp on invntSrv.type_uuid=invntSrvTyp.uuid
left join status on invntSrv.status=status.uuid
left join invntSrv_users on invntSrv.uuid=invntSrv_users.invntSrv_uuid
left join users on invntSrv_users.users_id=users.uuid
left join contacts as c on users.uuid=c.user_id
left join type as prcTyp on invntSrv.price_type_id=prcTyp.uuid
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
invSrv.type_uuid as type_uuid,
invntSrvTyp.name as type,
invSrv.create_date as create_date,
invSrv.mod_date as mod_date,
invSrv.status as status_id,
status.name as status_name,
users.username as username,
c.fName as fName,
c.surName as surName,
c.mName as mName,
invSrv.srv_durtn as srv_durtn,
invSrv.sku as sku,
invSrv.amnt as amnt,
invSrv.buy as buy,
invSrv.sell as sell,
invSrv.price_type_id as price_type_id,
prcTyp.name as price_type_name,
invSrv.notes as notes
from invntSrvLnk as isl
left join invntSrv as invSrv on isl.invntSrvLnkItm=invSrv.uuid
left join type as invntSrvTyp on invSrv.type_uuid=invntSrvTyp.uuid
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

