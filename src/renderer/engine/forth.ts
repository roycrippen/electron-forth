/* eslint-disable @typescript-eslint/no-var-requires */

import NumericOperations from './numeric-operations';
import Output from './output';
import Data from './data'
import Definitions from './definitions'
import BooleanOperations from './boolean-operations'
import StackOperations from './stack-operations'
import MemoryOperations from './memory-operations'
import ControlStructures from './control-structures'
import JsInterop from './js-interop'
import Input from './input'
import Include from './include'
import Interpreter from './interpreter'

class Forth {
    public constructor() {
        let forth = {};

        new Data(forth);
        new Definitions(forth);
        Input(forth);
        new NumericOperations(forth);
        new BooleanOperations(forth);
        new StackOperations(forth);
        new MemoryOperations(forth);
        ControlStructures(forth);
        new Output(forth);
        new JsInterop(forth);
        new Include(forth);
        Interpreter(forth);

        return forth;
    }
}
// module.exports = Forth;
export default Forth