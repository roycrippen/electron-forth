\ testing file
include forth/simple-lib.fth

2 
dup square
dup square
dup square

show-stack 

say-roy

1 2 3 
.s

10 20 + dup .

: aaa dup dup ;

aaa
