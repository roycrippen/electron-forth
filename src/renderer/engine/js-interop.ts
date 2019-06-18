/* eslint-disable @typescript-eslint/no-explicit-any */
class JsInterop {
    public constructor(f: any) {
        // Interop
        //   - new with params          js .new{1}
        //   - global variable access   js /document
        //   - array access             js .0.2
        //   - property access/setting  js .name  js .name!
        //   - function calling         js .sin{1} .{2}  >>  obj = pop, f = obj[name], f.call(obj, pop(), pop())
        //   - method calling           js /document.getElementById{1}
        //
        // When compiling it should resolve global names immediately.
        function jsNewCall(path: string): any {
            let constructor = f.stack.pop();
            let rg = path.match(/\{(\d*)\}/)
            let s = rg ? rg[1] : "0"
            let argsCount = parseInt(s);
            let args: [any, ...any[]] = [null]; // new replaces the first argument with this
            for (let j = 0; j < argsCount; j++) {
                args.push(f.stack.pop());
            }
            // Use new operator with any number of arguments
            return new (Function.prototype.bind.apply(constructor, args))();
        }

        function jsFunctionCall(path: string): any {
            let rg = path.match(/\{(\d*)\}/)
            let s = rg ? rg[1] : "0"
            let argsCount = parseInt(s);
            let obj = f.stack.pop();
            rg = path.match(/[^{]*/)
            path = rg ? rg[0] : "";
            let func = path ? obj[path] : obj;
            let args = [];
            for (let j = 0; j < argsCount; j++) {
                args.push(f.stack.pop());
            }
            return func.apply(obj, args);
        }

        let jsAssignmentRegex = /(^[A-Za-z$_][\w$_]*!$)|(^\d+!$)/; // name!
        let jsNewCallRegex = /new\{\d*\}$/; // new{2}
        let jsFunctionCallRegex = /((^[A-Za-z$_][\w$_]*)|(^\d+))?\{\d*\}$/; // getElementById{1}

        let globl = (typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document) ? window : global;

        function jsInterop(js: string): void {
            if (js.startsWith("/")) { // Add global to f.stack
                f.stack.push(globl);
            } else if (!js.startsWith(".")) {
                throw "js interop call must start with '/' or '.'";
            }

            let paths = js.length > 1 ? js.substring(1).split(".") : [];

            for (let i = 0; i < paths.length; i++) {
                let path = paths[i];

                if (path.match(jsAssignmentRegex)) {
                    f.stack.pop()[path.substring(0, path.length - 1)] = f.stack.pop();
                } else if (path.match(jsNewCallRegex)) {
                    f.stack.push(jsNewCall(path));
                } else if (path.match(jsFunctionCallRegex)) {
                    f.stack.push(jsFunctionCall(path));
                } else { // Property access
                    f.stack.push(f.stack.pop()[path]);
                }
            }
        }

        let JS = f.defjs("js", function js(): void {
            jsInterop(f.stack.pop());
        });

        f.defjs("js", function js(): void {
            if (f.compiling()) {
                f.dataSpace.push(f._lit);
                f.dataSpace.push(f._readWord());
                f.dataSpace.push(JS);
            } else {
                jsInterop(f._readWord());
            }
        }, true);

        f.defjs(">js-string", function toJsString(): void {
            let length = f.stack.pop();
            let address = f.stack.pop();
            let string = "";
            for (let i = 0; i < length; i++) {
                string += String.fromCharCode(f._getAddress(address + i));
            }
            f.stack.push(string);
        })
    }
}
// module.exports = JsInterop;
export default JsInterop;
