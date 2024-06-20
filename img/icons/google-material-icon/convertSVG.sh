for fn in `ls ./*opsz24.svg`;do nfn=`echo $fn|sed 's/_24dp_FILL0_wght400_GRAD0_opsz24//'`;sed -E 's/ (height|width)="[0-9]+px"//g' $fn > $nfn; rm $fn;done
