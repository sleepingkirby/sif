/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting types
-----------------------------------------------*/

/*-----------------------------------------------
pre: array of types (from types table)
post: none
separates types record into an array
-----------------------------------------------*/
function sepTypesHsh(arr){
  if(typeof arr!="object"){
  return null;
  }
const obj={};
  for(let row of arr){
    if(row.hasOwnProperty('categ')&&row.hasOwnProperty('col')){
      if(!obj.hasOwnProperty(row.categ)){
      obj[row.categ]={};
      }
      if(!obj[row.categ].hasOwnProperty(row.col)){
      obj[row.categ][row.col]={};
      }
      obj[row.categ][row.col][row.name]=row.uuid;
    }
  }
return obj;
}

/*-----------------------------------------------
pre: array of types (from types table)
post: none
separates types record into an array
-----------------------------------------------*/
function sepTypesIdHsh(arr){
  if(typeof arr!="object"){
  return null;
  }
const obj={};
  for(const row of arr){
    if(row.hasOwnProperty('categ')&&row.hasOwnProperty('col')){
      if(!obj.hasOwnProperty(row.categ)){
      obj[row.categ]={};
      }
      if(!obj[row.categ].hasOwnProperty(row.col)){
      obj[row.categ][row.col]={};
      }
      obj[row.categ][row.col][row.uuid]=row.name;
    }
  }
return obj;
}


/*-----------------------------------------------
pre: sqlObj, type table
post: none
get type
-----------------------------------------------*/
function selectType(categ=null){
//CREATE TABLE status(uuid text primary key, name text not null, notes text);
let query='select uuid, name, categ, col from type';
const where=' where';
let obj={};

  if(categ){
  query+=where+' categ=$categ';
  obj['$categ']=categ;
  }

return sqlObj.runQuery(query, obj);
}

