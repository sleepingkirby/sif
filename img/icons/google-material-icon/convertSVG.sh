for fn in `ls ./*opsz24.svg`;do nfn=`echo $fn|sed -r 's/_24dp_[A-Z0-9_]+_wght400_GRAD0_opsz24//'`;sed -E 's/ (height|width)="[0-9]+px"//g' $fn > $nfn; rm $fn;done
