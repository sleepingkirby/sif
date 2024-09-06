/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting users
-----------------------------------------------*/

/*----------------------------------------------
pre: sqlObj
post: database updated
creates the user that the person is on
----------------------------------------------*/
function createMe(hsh=null, postFunc=null){
let user_uuid=createUUID();

  try{
  sqlObj.runQuery('insert into users(uuid, status_id, email, create_dt, mod_dt) values($uuid, (select uuid from status where name="active"), $email ,datetime("now"), datetime("now"))', {$uuid:user_uuid, $email:hsh.email||""});
  }
  catch(e){
  console.log('Unable to add entry to "users" table. query: '+'insert into users(uuid, status_id, email, create_dt, mod_dt) values($uuid, 0, $email ,datetime("now"), datetime("now"))'+', binds: '+JSON.stringify({$uuid:user_uuid, $email:hsh.email||""}));
  console.log(e);
  return null;
  }

//setting user type to users made here. Always users and always customer
  try{
  sqlObj.runQuery('insert into users_type(uuid, user_uuid, type_uuid) values($uuid, $user_uuid, $typeid)',{$uuid:createUUID(), $user_uuid:user_uuid, $typeid:hsh.typeId});
  }
  catch(e){
  console.log(e);
  return null;
  }

let rtrn=user_uuid;
  if(postFunc){
  rtrn=postFunc(user_uuid);
  }

return rtrn;
}


/*-----------------------------------------------
pre: this class
post: none
-----------------------------------------------*/
function getUsers(paramObj,ord,desc=false,limit=null,offset=null){
let query=`
select
u.uuid as uuid,
u.username as username,
c.fName as fName,
c.surName as surName,
c.mName as mName,
s.name as status,
t.name as type,
u.email as email,
c.email as cEmail,
s.name as status,
c.phone as phone,
c.cellphone as cellphone,
c.addr as addr,
c.addr2 as addr2,
c.city as city,
c.prov as prov,
c.zip as zip,
c.country as country 
from users as u
left join contacts as c on u.uuid=c.user_id
left join status as s on u.status_id=s.uuid
left join users_type as ut on ut.user_uuid=u.uuid
left join type as t on t.uuid=ut.type_uuid
`;

let and='';
let tmp=null;
let obj={};

  if(paramObj){
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
  case 'status':
  query+=' order by status';
  query+=desc?' desc':' asc';
  break;
  case 'fName':
  query+=' order by fname';
  query+=desc?' desc':' asc';
  break;
  case 'surName':
  query+=' order by surName';
  query+=desc?' desc':' asc';
  break;
  case 'mName':
  query+=' order by mName';
  query+=desc?' desc':' asc';
  break;
  case 'email':
  query+=' order by email';
  query+=desc?' desc':' asc';
  break;
  case 'phone':
  query+=' order by phone';
  query+=desc?' desc':' asc';
  break;
  case 'cellphone':
  query+=' order by cellphone';
  query+=desc?' desc':' asc';
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

/*-----------------------------------------------
pre: array of users from getUsers()
post: none
separates customers from others types of users
-----------------------------------------------*/
function spltUsr(arr){
let rtrn={'customer':[], '':[]};
  arr.forEach(r=>{
    if(r.type&&rtrn[r.type]){
    rtrn[r.type].push(r);
    }
    else{
    rtrn[''].push(r);
    }
  });
return rtrn;
}

/*----------------------------------
pre: sqlobj
post: data inserted into the database
adds event hooks to elements that need it
----------------------------------*/
function createCustUser(hsh, postFunc=null){
//inserts into users table
let user_uuid=createUUID();
  try{
  sqlObj.runQuery('insert into users(uuid, status_id, email, create_dt, mod_dt) values($uuid, (select uuid from status where name="active"), $email ,datetime("now"), datetime("now"))', {$uuid:user_uuid, $email:hsh.email||""});
  }
  catch(e){
  console.log('Unable to add entry to "users" table. query: '+'insert into users(uuid, status_id, email, create_dt, mod_dt) values($uuid, 0, $email ,datetime("now"), datetime("now"))'+', binds: '+JSON.stringify({$uuid:user_uuid, $email:hsh.email||""}));
  console.log(e);
  return null;
  }

//setting user type to users made here. Always users and always customer
  try{
  sqlObj.runQuery('insert into users_type(uuid, user_uuid, type_uuid) values($uuid, $user_uuid, (select uuid from type where categ="users" and name="customer"))',{$uuid:createUUID(), $user_uuid:user_uuid});
  }
  catch(e){
  console.log(e);
  return null;
  }

//inserts into contacts
  try{
  sqlObj.runQuery('insert into contacts(uuid, user_id, fName, surName, mName, email, addr, addr2, city, prov, zip, country, phone, cellphone) values($uuid, $u_uuid, $fName, $surName, $mName, $email, $addr, $addr2, $city, $prov, $zip, $country, $phone, $cellphone)', {$uuid:createUUID(), $u_uuid:user_uuid, $fName:hsh.fName||"", $surName:hsh.surName||"", $mName:hsh.mName||"", $email:hsh.email||"", $addr:hsh.addr||"", $addr2:hsh.addr2||"", $city:hsh.city||"", $prov:hsh.prov||"", $zip:hsh.zip||"", $country:hsh.country||"", $phone:hsh.phone||"", $cellphone:hsh.cellphone||""});
  }
  catch(e){
  console.log('Unable to add entry to "contacts" table. query: '+'insert into contacts(uuid, user_id, fName, surName, mName, email, addr, addr2, city, prov, zip, country, phone, cellphone, email) values($uuid, $u_uuid, $fName, $surName, $mName, $email, $addr, $addr2, $city, $prov, $zip, $country, $phone, $cellphone)'+', binds: '+JSON.stringify({$uuid:createUUID(), $u_uuid:user_uuid, $fName:hsh.fName, $surName:hsh.surName, $mName:hsh.mName, $email:hsh.email, $addr:hsh.addr, $addr2:hsh.addr2, $city:hsh.city, $prov:hsh.prov, $zip:hsh.zip, $country:hsh.country, $phone:hsh.phone, $cellphone:hsh.cellphone}));
  console.log(e);
  return null;
  }

  if(postFunc){
  postFunc(user_uuid);
  }
}

/*-----------------------------------------
pre: sqlObj
post: users deleted
delete users.
-----------------------------------------*/
function delCustUser(uuid){
  if(uuid){
  return null;
  }

let query='delete from contacts where user_id=$uuid';
sqlObj.runQuery(query,{$uuid:uuid});

query='delete from users_type where user_uuid=$uuid';
sqlObj.runQuery(query,{$uuid:uuid});

query='delete from users where uuid=$uuid';
sqlObj.runQuery(query,{$uuid:uuid});

}

/*-----------------------------------------
pre: sqlObj
post: user info updated.
updates users.
-----------------------------------------*/
function updateCustUser(uuid=null, hsh, postFunc){
  if(!uuid){
  return null;
  }

let query='';
let comma='';
let obj={};

  try{
  query='delete from contacts where user_id=$uuid';
  sqlObj.runQuery(query,{$uuid:uuid});
  }
  catch(e){
  console.log(e);
  return null;
  }

  try{
  query='delete from users_type where user_uuid=$uuid';
  sqlObj.runQuery(query,{$uuid:uuid});
  }
  catch(e){
  console.log(e);
  return null;
  }



//query='update users set status_id=$sttus, email=$email, role_id=$role_id, parent_user_id=$parent_user_id, mod_dt=datetime("now") where uuid=$uuid';
query='update users set mod_dt=datetime("now") ';
obj={};
  if(hsh.hasOwnProperty('status_id')&&hsh.status_id){
  query+=", status_id=$status";
  obj['$status']=hsh.status_id;
  }
  if(hsh.hasOwnProperty('email')&&hsh.email){
  query+=", email=$email";
  obj['$email']=hsh.email;
  }
  if(hsh.hasOwnProperty('role_id')&&hsh.role_id){
  query+=", role_id=$role_id";
  obj['$role_id']=hsh.role_id;
  }
  if(hsh.hasOwnProperty('parent_user_id')&&hsh.parent_user_id){
  query+=", parent_user_id=$parent_user_id";
  obj['$parent_user_id']=hsh.parent_user_id;
  }
query+=" where uuid=$uuid";
obj['$uuid']=uuid;


  try{
  sqlObj.runQuery(query,obj);
  }
  catch(e){
  console.log(e);
  return null;
  }


  try{
  sqlObj.runQuery('insert into users_type(uuid, user_uuid, type_uuid) values($uuid, $user_uuid, (select uuid from type where categ="users" and name="customer"))',{$uuid:createUUID(), $user_uuid:uuid});
  }
  catch(e){
  console.log(e);
  return null;
  }

//inserts into contacts
  try{
  sqlObj.runQuery('insert into contacts(uuid, user_id, fName, surName, mName, email, addr, addr2, city, prov, zip, country, phone, cellphone) values($uuid, $u_uuid, $fName, $surName, $mName, $email, $addr, $addr2, $city, $prov, $zip, $country, $phone, $cellphone)', {$uuid:createUUID(), $u_uuid:uuid, $fName:hsh.fName||"", $surName:hsh.surName||"", $mName:hsh.mName||"", $email:hsh.email||"", $addr:hsh.addr||"", $addr2:hsh.addr2||"", $city:hsh.city||"", $prov:hsh.prov||"", $zip:hsh.zip||"", $country:hsh.country||"", $phone:hsh.phone||"", $cellphone:hsh.cellphone||""});
  }
  catch(e){
  console.log(e);
  return null;
  }

  if(postFunc){
  postFunc(uuid);
  }
}


/*-----------------------------------------
pre: mysqlObj, users table exists
post: table record updated.
updates the table
-----------------------------------------*/
function updateUserStatus(uuid=null, stts=null){
  if(!uuid||!stts){
  return null;
  }

query='update users set mod_dt=datetime("now") ';
obj={};
query+=", status_id=(select uuid from status where name=$stts)";
obj['$stts']=stts;
query+=" where uuid=$uuid";
obj['$uuid']=uuid;


  try{
  sqlObj.runQuery(query,obj);
  }
  catch(e){
  console.log(e);
  throw e;
  }

return null;
}
