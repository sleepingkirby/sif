/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting users
-----------------------------------------------*/

/*-----------------------------------------------
pre: this class
post: none
-----------------------------------------------*/
function getUsers(type=null){
  try{
  let where="";
  let whereVals={};
    if(type){
    where=" where type=$type";
    whereVals={$type:type};
    }

  return sqlObj.runQuery(`
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
  left join  users_type as ut on ut.user_uuid=u.uuid
  left join type as t on t.uuid=ut.type_uuid
  ${where}`,whereVals);
  } 
  catch(e){
  console.log(e);
  } 
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
  sqlObj.runQuery('insert into users(uuid, status_id, email, create_dt, mod_dt) values($uuid, (select uuid from status where name="active"), $email ,date("now"), date("now"))', {$uuid:user_uuid, $email:hsh.email||""});
  }
  catch(e){
  console.log('Unable to add entry to "users" table. query: '+'insert into users(uuid, status_id, email, create_dt, mod_dt) values($uuid, 0, $email ,date("now"), date("now"))'+', binds: '+JSON.stringify({$uuid:user_uuid, $email:hsh.email||""}));
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

