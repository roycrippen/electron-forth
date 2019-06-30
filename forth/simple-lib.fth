include ~+/forth/another-lib.fth

: square ( n -- n )
    dup * 
;

: quad ( n -- n )
    square square 
;

: say-roy ( -- )
    s" roy" type
;

CR .( forth/simple-lib.fth loaded ) CR
