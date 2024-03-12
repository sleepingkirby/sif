/*-----------------------------------------------
pre: runQuery(), selectType()
post: none
gets 
-----------------------------------------------*/
function createInvcs(invcs, invcsItems){
  if(!invcs){
  return null;
  }

let invcsId=createUUID();
let query=`insert into invcs(uuid, create_date, due_date, paid_date, status_id, sub_total, total_dscntd, total, total_paid, forUser_id, byUser_id, event_id, notes) values($uuid, $createDate, $dueDate, $paidDate, $statusId, $subTtl, $totalDscntd, $ttl, $ttlPaid, $forUserId, $byUserId, $eventId, $notes)`;
  let qObj={
  $uuid:invcsId,
  $createDate:invcs.hasOwnProperty('create_date')?dtTmDbFrmt(invcs.create_date):dtTmDbFrmt(),
  $dueDate:invcs.hasOwnProperty('due_date')?dtTmDbFrmt(invcs.due_date):null,
  $paidDate:invcs.hasOwnProperty('paid_date')?dtTmDbFrmt(invcs.paid_date):null,
  $statusId:invcs.hasOwnProperty('status_id')?invcs.status_id:null,
  $subTtl:invcs.hasOwnProperty('sub_total')?invcs.sub_total:invcs.total,
  $totalDscntd:invcs.hasOwnProperty('total_dscntd')?invcs.total_dscntd:null,
  $ttl:invcs.hasOwnProperty('total')?invcs.total:0,
  $ttlPaid:invcs.hasOwnProperty('total_paid')?invcs.total_paid:0,
  $forUserId:invcs.hasOwnProperty('forUser_id')?invcs.forUser_id:null,
  $byUserId:invcs.hasOwnProperty('byUser_id')?invcs.byUser_id:null,
  $eventId:invcs.hasOwnProperty('event_id')?invcs.event_id:null,
  $notes:invcs.hasOwnProperty('notes')?invcs.notes:''
  };
  try{
  sqlObj.runQuery(query, qObj);
  }
  catch(e){
  console.log('Unable to add entry to "invcs" table. query: '+query+', binds: '+JSON.stringify(qObj));
  console.log(e);
  return null;
  }


let types=selectType('invntSrv');
let typesIdHsh=sepTypesIdHsh(types);

let prntUUID=null;
  for(let indx in invcsItems){
  itemUUID=createUUID();
  query=`insert into invcs_items(uuid, type_id, invcs_id, invntSrv_id, prntInvcsItemId, ord, name, price, price_type_id, ovrrdPrice, amnt, notes) values($uuid, $typeId, $invcsId, $invntSrvId, $prntInvcsItemId, $ord, $name, $price, $priceTypeId, $ovrrdPrice, $amnt, $notes)`;
    if(typesIdHsh.invntSrv[""][invcsItems[indx].typeId]!="discount"){
    prntUUID=itemUUID;
    }

    qObj={
    $uuid:itemUUID,
    $typeId:invcsItems[indx].hasOwnProperty('type_id')?invcsItems[indx].type_id:null,
    $invcsId:invcsId,
    $invntSrvId:invcsItems[indx].hasOwnProperty('invntSrv_id')?invcsItems[indx].invntSrv_id:null,
    $prntInvcsItemId:typesIdHsh.invntSrv[""][invcsItems[indx].type_id]!="discount"?null:prntUUID,
    $ord:indx,
    $name:invcsItems[indx].hasOwnProperty('name')?invcsItems[indx].name:'',
    $price:invcsItems[indx].hasOwnProperty('price')?invcsItems[indx].price:0,
    $priceTypeId:invcsItems[indx].hasOwnProperty('price_type_id')?invcsItems[indx].price_type_id:null,
    $ovrrdPrice:invcsItems[indx].hasOwnProperty('ovrrdPrice')?invcsItems[indx].ovrrdPrice:null,
    $amnt:invcsItems[indx].hasOwnProperty('amnt')?invcsItems[indx].amnt:null,
    $notes:invcsItems[indx].hasOwnProperty('notes')?invcsItems[indx].notes:''
    }
    try{
    sqlObj.runQuery(query, qObj);
    }
    catch(e){
    console.log('Unable to add entry to "invcs_items" table. query: '+query+', binds: '+JSON.stringify(qObj));
    console.log(e);
    return null;
    }
  }
return true;
}

/*-----------------------------------------------
pre: runQuery()
post: none
gets invoices
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
invcs.event_id as event_id,
event.on_date as event_on_date
from invcs
left join status on invcs.status_id=status.uuid
left join users on invcs.forUser_id=users.uuid
left join contacts as forUser on users.uuid=forUser.user_id
left join events as event on invcs.event_id=event.uuid
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

/*-----------------------------------------------
pre: runQuery(), selectType()
post: none
gets 
-----------------------------------------------*/
function updtInvcs(uuid=null, obj=null, items=null){
  if(!uuid){
  return null;
  }
/*
CREATE TABLE invcs(uuid text not null primary key, create_date int not null, due_date int null, paid_date int null, status_id text not null, sub_total real not null, total_dscntd real null, total real not null, total_paid real null, forUser_id text not null, byUser_id text not null, event_id text null, notes text null, foreign key(forUser_id) references users(uuid), foreign key(byUser_id) references users(uuid), foreign key(event_id) references events(uuid), foreign key(status_id) references type(uuid));
*/
let query='update invcs set ';
let qObj={};
let cm='';
let allowCol=[
'due_date',
'paid_date',
'status_id',
'status_name',
'sub_total',
'total_dscntd',
'total',
'total_paid',
'forUser_id',
'byUser_id',
'event_id',
'notes',
];

  for(let col of allowCol){
    if(obj.hasOwnProperty(col)){
      if(col==="status_name"){
      query+=cm+" status_id=(select uuid from status where name=$status_name)";
      qObj['$status_name']=obj[col];
      }
      else{
      query+=cm+" "+col+"=$"+col;
      qObj['$'+col]=obj[col];
      cm=',';
      }
    }
  }

query+=" where uuid=$uuid";
qObj['$uuid']=uuid;
  try{
  sqlObj.runQuery(query,qObj);
  }
  catch(e){
  console.log('Unable to update entry to "invcs" table. query: '+query+', binds: '+JSON.stringify(qObj));
  console.log(e);
  return null;
  }

/*
CREATE TABLE invcs_items(uuid text not null primary key, type_id text null, invcs_id text not null, invntSrv_id text null, prntInvcsItemId text null, ord int null, name text not null, price real, price_type_id text null, ovrrdPrice real, notes null, foreign key(invcs_id) references invcs(uuid), foreign key(invntSrv_id) references invntSrv(uuid), foreign key(type_id) references type(uuid), foreign key(prntInvcsItemId) references invcs_items(prntInvcsItemId), foreign key(price_type_id) references type(uuid));
*/
  if(items && Array.isArray(items)){
  query=`delete from invcs_items where invcs_id=$invcs_id`;
  qObj={'$invcs_id':uuid};
    try{
    sqlObj.runQuery(query,qObj);
    }
    catch(e){
    console.log('Unable to delete items from "invcs_items" table. query: '+query+', binds: '+JSON.stringify(qObj));
    console.log(e);
    return null;
    }

    for(let i in items){
    query=`insert into invcs_items(uuid, type_id, invcs_id, invntSrv_id, prntInvcsItemId, ord, name, price, price_type_id, ovrrdPrice, amnt, notes)
    values($uuid, $type_id, $invcs_id, $invntSrv_id, $prntInvcsItemId $ord, $name, $price, $price_type_id, $ovrrdPrice, $amnt, $notes)`;
      qObj={
      '$uuid':createUUID(),
      '$type_id':items[i].type_id,
      '$invcs_id':uuid,
      '$invntSrv_id':items[i].hasOwnProperty('invntSrv')?items[i].invntSrv:null,
      '$prntInvcsItemId':typesIdHsh.invntSrv[""][invcsItems[indx].type_id]!="discount"?null:prntUUID,
      '$ord':i,
      '$name':items[i].hasOwnProperty('name')?items[i].name:null,
      '$price':items[i].hasOwnProperty('price')?items[i].price:null,
      '$price_type_id':items[i].hasOwnProperty('price_type_id')?items[i].price_type_id:null,
      '$ovrrdPrice':items[i].hasOwnProperty('ovrrdPrice')?items[i].ovrrdPrice:null,
      '$amnt':invcsItems[indx].hasOwnProperty('amnt')?invcsItems[indx].amnt:null,
      '$notes':items[i].hasOwnProperty('notes')?items[i].notes:null
      };
      try{
      sqlObj.runQuery(query,qObj);
      }
      catch(e){
      console.log('Unable to add items from "invcs_items" table for invcs uuid: '+uuid+'. query: '+query+', binds: '+JSON.stringify(qObj));
      console.log(e);
      return null;
      }
    }
  }
return true;
}


