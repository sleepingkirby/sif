/*---------------------------
pre: none
post: none
evaluates and gets the icon path from global variables. If it doesn't
exist, default to 'default' and/or 'broken'
---------------------------*/
function getEvalIcon(iconSets, iconSet, iconName){
  var curSet=iconSet||'default'; //if iconSet is not set, use default set
  curSet=iconSets.hasOwnProperty(curSet)?curSet:'default'; //if the current icon set is not in iconSets, use default sets
  return iconSets[curSet].hasOwnProperty(iconName)?iconSets[curSet][iconName]:iconSets[curSet]['broken']; //if the icon exists in the set, use the icon, if not, use broken
}

