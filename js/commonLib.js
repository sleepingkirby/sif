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
function slctToDefault(slct=null){
  if(!slct){
  return null;
  }
  for(let opt of slct.options){
    if(opt.hasAttribute('selected')){
    slct.value=opt.value;
    break;
    }
  }
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

