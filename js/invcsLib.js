/*
CREATE TABLE invcs(uuid text not null primary key, create_date int not null, due_date int null, paid_date int null, status_id text not null, sub_total real not null, total_dscntd real null, total real not null, total_paid real null, forUser_id text not null, byUser_id text not null, event_id text null, foreign key(forUser_id) references users(uuid), foreign key(byUser_id) references users(uuid), foreign key(event_id) references events(uuid), foreign key(status_id) references type(uuid));

CREATE TABLE invcs_items(uuid text not null primary key, invc_id text not null, type_id text null, invntSrv_id text null, ord int null, name text not null, price real not null, price_dscntd real null, notes null, foreign key(invc_id) references invcs(uuid), foreign key(type_id) references type(uuid), foreign key(invntSrv_id) references invntSrv(uuid));

CREATE TABLE invcs_item_mods(uuid text not null primary key, invcs_items_id not null, type_id text null, invntSrv_id text null, ord int null, name text not null, price real, price_type_id text null, notes null, foreign key(invcs_items_id) references invcs_items(uuid), foreign key(invntSrv_id) references invntSrv(uuid), foreign key(type_id) references type(uuid), foreign key(price_type_id) references type(uuid));
*/
/*-----------------------------------------------
pre:
post:
-----------------------------------------------*/
//function getInvntSrvArr(paramObj, ord, desc=false, limit=null, offset=null){
function getInvcs(paramObj, ord, desc=false, limit=null, offset=null){
let query=`
select
invcs.uuid as uuid,
invcs.create_date as create_date,
invcs.due_date as due_date,
invcs.paid_date as paid_date,
invcs.status_id as status_id,
status.name as status_name,
invcs.sub_total as sub_total,
invcs.total_dscntd as total_dscntd,
invcs.total as total,
invcs.total_paid as total_paid,
invcs.forUser_id as forUserId,
users.email as forUser_email,
forUser.fName as forUser_fName,
forUser.surName as forUser_surName,
invcs.byUser_id as byUserId,
invcs.event_id as event_id
from invcs
left join status on invcs.status_id=status.uuid
left join users on invcs.forUser_id=users.uuid
left join contacts as forUser on users.uuid=forUser.user_id
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

let csStr='';
  switch(ord){
  case 'create_date':
  csStr='create_date';
  break;
  case 'due_date':
  csStr='due_date';
  break;
  case 'paid_date':
  csStr='paid_date';
  break;
  case 'status_name':
  csStr='status_name';
  break;
  case 'sub_total':
  csStr='sub_total';
  break;
  case 'total_dscntd':
  csStr='total_dscntd';
  break;
  case 'total':
  csStr='total';
  break;
  case 'total_paid':
  csStr='total_paid';
  break;
  case 'forUser_email':
  csStr='forUser_email';
  break;
  case 'forUser_fName':
  csStr='forUser_fName';
  break;
  case 'forUser_surName':
  csStr='forUser_surName';
  break;
  default:
  break;
  }

  if(csStr!=''){
  query+=' order by '+csStr;
  query+=desc=='desc'?' desc':' asc';
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
