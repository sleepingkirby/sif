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
    if(state.user&&state.user.config){
      for(const modNm of modsLst){
        if(mod[modNm].hasOwnProperty('menu')&&mod[modNm].menu.hasOwnProperty('enabled')&&mod[modNm].menu.enabled){
        menu+=`<div class="menuLftItm menuIcon" onclick=mainObj.setState("pos","`+modNm+`") title="`+mod[modNm].name+`">`+getEvalIcon(iconSets, state.user.config.iconSet, mod[modNm].menu.icon)+`</div>
`;
        }
      }
    }
  return menu; 
  }

  /*----------------------------
  pre: this.genMenu()
  post: html changed
  set output from genMenu() to html()
  ----------------------------*/
  setMenu(){
  document.getElementById('menuDropDown').innerHTML=this.genMenu();
  }
}

var menuLftObj=new menuLft();
