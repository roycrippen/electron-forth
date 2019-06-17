: square ( n -- n )
    dup * 
;

: quad ( n -- n )
    square square 
;

: say-roy ( -- )
    s" roy" type
;

5 square .
8 quad .
say-roy