\ ANS Forth tests - run all tests

\ Adjust the file paths as appropriate to your system
\ Select the appropriate test harness, either the simple tester.fr
\ or the more complex ttester.fs 

CR .( Running ANS Forth and Forth 2012 test programs, version 0.13) CR

\ Dummy implementation so accept test runs in batch
: accept drop 0 swap ! 0 ;



include ~+/test/fth_tests/verbose-tester.fth
include ~+/test/fth_tests/errorreport.fth
include ~+/test/fth_tests/core.fr
include ~+/test/fth_tests/utilities.fth
include ~+/test/fth_tests/coreplustest.fth

CR .( Forth tests completed ) CR CR

