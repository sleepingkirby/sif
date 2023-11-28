/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting types
-----------------------------------------------*/

/*-----------------------------------------------
pre: sqlObj, type table
post: none
get type
-----------------------------------------------*/
function selectType(categ=null){
//CREATE TABLE status(uuid text primary key, name text not null, notes text);
let query='select uuid, name, categ, col from type';
let where=' where';
let obj={};

  if(categ){
  query+=where+' categ=$categ';
  obj['$categ']=categ;
  }

return sqlObj.runQuery(query, obj);
}

