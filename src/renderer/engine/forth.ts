/* eslint-disable @typescript-eslint/no-var-requires */

import NumericOperations from './numeric-operations';
import Output from './output';
import Data from './data'
import Definitions from './definitions.js'
import BooleanOperations from './boolean-operations.js'
import StackOperations from './stack-operations.js'
import MemoryOperations from './memory-operations.js'
import ControlStructures from './control-structures.js'
import JsInterop from './js-interop.js'
import Input from './input.js'
import Include from './include.js'
import Interpreter from './interpreter.js'

class Forth {
    public constructor() {
        var forth = {};

        new Data(forth);
        Definitions(forth);
        Input(forth);
        NumericOperations(forth);
        BooleanOperations(forth);
        StackOperations(forth);
        MemoryOperations(forth);
        ControlStructures(forth);
        Output(forth);
        JsInterop(forth);
        Include(forth);
        Interpreter(forth);

        return forth;
    }
}
// module.exports = Forth;
export default Forth