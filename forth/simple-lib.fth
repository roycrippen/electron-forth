: square ( n -- n )
    dup * 
;

: quad ( n -- n )
    square square 
;

: say-roy ( -- )
    s" roy" type
;
