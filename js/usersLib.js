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

