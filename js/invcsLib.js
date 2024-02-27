/*-----------------------------------------------
pre: runQuery()
post: none
gets 
-----------------------------------------------*/
function createInvcs(invcs, invcsItems){
  if(!invcs){
  return null;
  }

let invcsId=createUUID();
let query=`insert into invcs(uuid, due_date, paid_date, status_id, sub_total, total_dscntd, total, total_paid, forUser_id, byUser_id, event_id, notes) values($uuid, $dueDate, $paidDate, $statusId, $subTtl, $totalDscntd, $ttl, $ttlPaid, $forUserId, $byUserId, $eventId, $notes)`;
let qObj={
$uuid:invcsId,
$dueDate:invcs.hasOwnProperty('dueDate')?invcs.dueDate:null,
$paidDate:invcs.hasOwnProperty('paidDate')?invcs.paidDate:null,
$statusId:invcs.hasOwnProperty('statusId')?invcs.statusId:null,
$subTtl:invcs.hasOwnProperty('subTtl')?invcs.subTtl:null,
$totalDscntd:invcs.hasOwnProperty('totalDscntd')?invcs.totalDscntd:null,
$ttl:invcs.hasOwnProperty('ttl')?invcs.ttl:null,
$ttlPaid:invcs.hasOwnProperty('ttlPaid')?invcs.ttlPaid:null,
$forUserId:invcs.hasOwnProperty('forUserId')?invcs.forUserId:null,
$byUserId:invcs.hasOwnProperty('byUserId')?invcs.byUserId:null,
$eventId:invcs.hasOwnProperty('eventId')?invcs.eventId:null,
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

let itemUUID=null;
  for(let row of invcsItems){
  itemUUID=createUUID();
  query=`insert into invcs_items(uuid, type_id, invcs_id, invntSrv_id, prntInvcsItemId, ord, name, price, price_type_id, ovrrdPrice, notes) values($uuid, $typeId, $invcsId, $invntSrvId, $prntInvcsItemId, $ord, $name, $price, $priceTypeId, $ovrrdPrice, $notes)`;
    qObj={
    $uuid:itemUUID,
    $typeId:row.hasOwnProperty('typeId')?row.typeId:null,
    $invcs:invcsId,
    $invntSrvId:row.hasOwnProperty('invntSrvId')?row.invntSrvId:null,
    $prntInvcsItemId:row.hasOwnProperty('prntInvcsItemId')?row.prntInvcsItemId:null,
    $ord:row.hasOwnProperty('ord')?row.ord:null,
    $name:row.hasOwnProperty('name')?row.name:'',
    $price:row.hasOwnProperty('price')?row.price:0,
    $priceTypeId:row.hasOwnProperty('priceTypeId')?row.priceTypeId:null,
    $notes:row.hasOwnProperty('notes')?row.notes:''
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
