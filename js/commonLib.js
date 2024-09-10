// check it element (el) wants padding and set it if so.
function padVal(el, val){
let v=val;

let min=el.getAttribute("minVal");
let max=el.getAttribute("maxVal");
let len=el.getAttribute("padLen");
let chr=el.getAttribute("padChar");

  if(min&&max){
    if(v<min){
    v=max;
    }
    if(v>max){
    v=min;
    }
  }

  if(len&&chr){
  v=String(v).padStart(len, chr);
  }

el.innerText=v;
}

/*----------------------------------
pre:
post:
gets the string within the brackets. i.e contact[subname] gets subname
----------------------------------*/
function getSubs(str, head="contact"){
  if(str){
  const patt=new RegExp('(^'+head+'\\[|\\]$)','g');
  return str.replace(patt,"");
  }
return "";
}

/*----------------------------------
pre: none
post: none
takes an array of hashs and makes a hash of hashes index by indx
indx HAS to exist in all hashs inside array
----------------------------------*/
function arrOfHshToHshHsh(indx, arr){
  if(!indx){
  return null;
  }
  if(!arr&&arr.length<=0){
  return null;
  }

  let hsh={};
  for(let ind in arr){
    if(!arr[ind].hasOwnProperty(indx)){
    return null;
    }
    hsh[arr[ind][indx]]={...arr[ind],'indx':ind};
  }

return {...hsh};
}

/*----------------------------------
pre: getEvalIcon(), iconSets['sortDwn'], iconSets['sortUp'], state.user.config.iconSet
post: none
generates the icon for sort down and sort up for table headers
----------------------------------*/
function sortArrowIcon(dir='asc'){
  if(dir=='asc'){
  return getEvalIcon(iconSets, state.user.config.iconSet, 'sortUp');
  }
  if(dir=='desc'){
  return getEvalIcon(iconSets, state.user.config.iconSet, 'sortDwn');
  }
  if(dir===null){
  return getEvalIcon(iconSets, state.user.config.iconSet, 'sortUp')+getEvalIcon(iconSets, state.user.config.iconSet, 'sortDwn');
  }
return '';
}

/*----------------------------------
pre: sortArrowIcon()
post: none
does a .replaceAll() and returns it
    obj: {'name':'on_date','title':'on date', 'sort':true},
    tmpl: `
            <div class="tblHdSrt ##pntClass##" tabindex=0 name="##hdrNm##">
              <div>##hdrTtl##</div>
              <div class="tblHdSrtArrw" title="sort via ##hdlTtl">##icon##</div>
            </div>
    `;
----------------------------------*/
function sortTblHdrTmplng(tmpl, obj, sortDir, srtClss='tblHdSrtPnt'){
  if(!obj||typeof obj!='object'){
  return tmpl;
  }

let html=tmpl;
  if(obj.hasOwnProperty('name')&&obj.name){
  html=html.replaceAll('##hdrNm##',obj.name);
  }

  if(obj.hasOwnProperty('title')&&obj.title){
  html=html.replaceAll('##hdrTtl##',obj.title);
  }

  if(obj.hasOwnProperty('sort')&&obj.sort){
  html=html.replaceAll('##pntClass##',srtClss);
  html=html.replaceAll('##icon##',sortArrowIcon(sortDir));
  }
  else{
  html=html.replaceAll('##pntClass##','');
  html=html.replaceAll('##icon##','');
  }

return html;
}


/*----------------------------------
pre: css style .statusActive and .statusNotActive
post:none
returns styled text depending on status/text
----------------------------------*/
function statusColor(str){
  let clrHsh={
  'active':'statusActive',
  'disabled':'statusNotActive',
  'cancelled':'statusNotActive',
  'done':'statusActive'
  };

let html='';
  if(clrHsh.hasOwnProperty(str)){
  html=`<div class="${clrHsh[str]}">${str}</div>`;
  }
  else{
  html=`<div>${str}</div>`;
  }
return html;
}

/*-----------------------------------------------
pre: none
post: none
-----------------------------------------------*/
function genSttsSlct(sttsArr,slctVl=null, dfltVl="active"){
let html="";
  for(const stts of sttsArr){
    if(slctVl&&stts.uuid==slctVl){
    html+='<option value="'+stts.uuid+'" selected >'+stts.name+"</option>";
    }
    else if(stts.name==dfltVl){
    html+='<option value="'+stts.uuid+'" selected >'+stts.name+"</option>";
    }
    else{
    html+='<option value="'+stts.uuid+'"'+'>'+stts.name+"</option>";
    }
  }
return html;
}

/*-----------------------------------------------
pre: none
post: none
-----------------------------------------------*/
function genSlct(arr, vlProp=null, nmProp=null, slctVl=null, dfltVl=null){
let html="";
  if(!vlProp||vlProp==null||!nmProp||nmProp==null){
  return html;
  }

  for(const i of arr){
    if(slctVl&&i[vlProp]==slctVl){
    html+='<option value="'+i[vlProp]+'" selected >'+i[nmProp]+"</option>";
    }
    else if(i.name==dfltVl){
    html+='<option value="'+i[vlProp]+'" selected >'+i[nmProp]+"</option>";
    }
    else{
    html+='<option value="'+i[vlProp]+'" >'+i[nmProp]+"</option>";
    }
  }
return html;
}

/*-----------------------------------------------
pre: none
post: none
-----------------------------------------------*/
function genSlctHshIndx(hsh, slctVl=null, dfltVl=null){
let html="";
  if(!hsh){
  return html;
  }

let arr=Object.keys(hsh);

  for(const i of arr){
    if(slctVl&&hsh[i]==slctVl){
    html+='<option value="'+hsh[i]+'" selected >'+i+"</option>";
    }
    else if(hsh[i]==dfltVl){
    html+='<option value="'+hsh[i]+'" selected >'+i+"</option>";
    }
    else{
    html+='<option value="'+hsh[i]+'" >'+i+"</option>";
    }
  }
return html;
}


/*-----------------------------------------------
pre: none
post: none
-----------------------------------------------*/
function genSlctHsh(hsh, vlProp=null, nmProp=null, slctVl=null, dfltVl=null){
let html="";
  if(!vlProp||vlProp==null||!nmProp||nmProp==null){
  return html;
  }

let arr=Object.keys(hsh);

  for(const i of arr){
    if(slctVl&&hsh[i][vlProp]==slctVl){
    html+='<option value="'+hsh[i][vlProp]+'" selected >'+hsh[i][nmProp]+"</option>";
    }
    else if(i.name==dfltVl){
    html+='<option value="'+hsh[i][vlProp]+'" selected >'+hsh[i][nmProp]+"</option>";
    }
    else{
    html+='<option value="'+hsh[i][vlProp]+'" >'+hsh[i][nmProp]+"</option>";
    }
  }
return html;
}

/*-----------------------------------------------
pre: none
post: none
-----------------------------------------------*/
function genLoginUserSlct(users=[], slctdPrp='uuid', slctdVl=null){
  let html="";
  for(const usr of users){
  const fNm=usr.fName.length>=8?usr.fName.substr(0,5)+'...':usr.fName;
  const lNm=usr.surName.length>=6?usr.surName.substr(0,1)+'.':usr.surName;
  let selected='';{}
  const show=`${usr.email} [${usr.type}]`;
  const m=usr.mName!=''?usr.mName+' ':'';
  const uNm=!usr.username||usr.username==''?'':'username: '+usr.username;
  const addrLst=usr.city||usr.prov||usr.zip||usr.country?`&#10;${usr.city}, ${usr.prov} ${usr.zip}, ${usr.country}`:'';
  const addr2=!usr.addr2||usr.addr2==""?'':`&#10;${addr2}`;
  const addr=usr.addr||usr.addr2?`&#10;&#10;${usr.addr}${addr2}${addrLst}`:'';
  const title=`${usr.fName} ${m}${usr.surName} [${usr.type}]&#10;${uNm}&#10;phone: ${usr.phone}&#10;cellphone: ${usr.cellphone}&#10;email: ${usr.email}${addr}`;
    if(slctdPrp&&slctdVl&&usr[slctdPrp]==slctdVl){
    selected='selected';
    }
    html+='<option value="'+usr.uuid+'"'+' title="'+title+'" '+selected+'>'+show+"</option>";
  }
  html+='<option value=null>Create New User</option>';
return html;
}


/*-----------------------------------------------
pre: none
post: none
-----------------------------------------------*/
function slctToDefault(slct=null){
  if(!slct){
  return null;
  }
  for(let opt of slct.options){
    if(opt.hasAttribute('selected')){
    slct.value=opt.value;
    return;
    }
  }
slct.value=slct.options[0].value;
}

/*-----------------------------------------------
pre: none
post: none
flips the visibility of the 2 elements (buttons)
-----------------------------------------------*/
function btnFlip(addBtnId,updBtnId,updt=false){
  if(!addBtnId||!updBtnId){
  return null;
  }
let updtEl=document.getElementById(updBtnId);
let addEl=document.getElementById(addBtnId);
  if(updtEl&&addEl){
    updtEl.style.display=updt?"flex":"none";
    addEl.style.display=updt?"none":"flex";
  }
}

