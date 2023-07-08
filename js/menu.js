class menuLft {

  constructor(){
  }

  /*----------------------------
  pre:
  post:
  ----------------------------*/
  genMenu(str=null){
  var val=state.pos||'menu';
  var menuLst=[];
  var menu=``;
  var modsLst=Object.keys(mod);
    for(const modNm of modsLst){
      if(mod[modNm].hasOwnProperty('menu')&&mod[modNm].menu.hasOwnProperty('enabled')&&mod[modNm].menu.enabled){
      menu+=`<div class="menuLftItm" onclick=mainObj.setState("pos","`+modNm+`")><img src="`+getEvalIcon(iconSets, state.user.iconSet, mod[modNm].menu.icon)+`" /></div>
`;
      }
    }
  return menu; 
  }

}


var menuLftObj=new menuLft();
document.getElementById('menuDropDown').innerHTML=menuLftObj.genMenu();
