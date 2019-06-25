import Forth from "./forth";

/* eslint-disable @typescript-eslint/no-explicit-any */
class StackOperations {
    public constructor(f: Forth) {
        f.defjs("clearstack", function clearstack(): void {
            f.stack.clear();
        });

        f.defjs("drop", function drop(): void {
            f.stack.pop();
        });

        f.defjs("swap", function swap(): void {
            let first = f.stack.pop();
            let second = f.stack.pop();
            f.stack.push(first);
            f.stack.push(second);
        });

        f.defjs("dup", function dup(): void {
            f.stack.push(f.stack.peek());
        });

        f.defjs("over", function over(): void {
            f.stack.push(f.stack.peek(2));
        });

        f.defjs("pick", function pick(): void {
            f.stack.push(f.stack.peek(f.stack.pop() + 1));
        });

        f.defjs("rot", function rot(): void {
            let first = f.stack.pop();
            let second = f.stack.pop();
            let third = f.stack.pop();
            f.stack.push(second);
            f.stack.push(first);
            f.stack.push(third);
        });

        f.defjs("-rot", function backRot(): void {
            let first = f.stack.pop();
            let second = f.stack.pop();
            let third = f.stack.pop();
            f.stack.push(first);
            f.stack.push(third);
            f.stack.push(second);
        });

        f.defjs("roll", function roll(): void {
            let num = f.stack.pop();
            f.stack.roll(num);
        });

        f.defjs("2drop", function twoDrop(): void {
            f.stack.pop();
            f.stack.pop();
        });

        f.defjs("2dup", function twoDup(): void {
            f.stack.push(f.stack.peek(2));
            f.stack.push(f.stack.peek(2));
        });

        f.defjs("2over", function twoOver(): void {
            f.stack.push(f.stack.peek(4));
            f.stack.push(f.stack.peek(4));
        });

        f.defjs("2swap", function twoSwap(): void {
            let first = f.stack.pop();
            let second = f.stack.pop();
            let third = f.stack.pop();
            let fourth = f.stack.pop();
            f.stack.push(second);
            f.stack.push(first);
            f.stack.push(fourth);
            f.stack.push(third);
        });

        f.defjs("?dup", function nonZeroDup(): void {
            let first = f.stack.peek();
            if (first !== 0) f.stack.push(first);
        });

        f.defjs("depth", function depth(): void {
            f.stack.push(f.stack.length());
        });

        // Return f.stack
        f.defjs(">r", function toR(): void {
            f.returnStack.push(f.stack.pop());
        });

        f.defjs("r>", function rFrom(): void {
            f.stack.push(f.returnStack.pop());
        });

        f.defjs("r@", function rFetch(): void {
            f.stack.push(f.returnStack.peek());
        });

        f.defjs("2r>", function twoRFrom(): void {
            let top = f.returnStack.pop();
            f.stack.push(f.returnStack.pop());
            f.stack.push(top);
        });

        f.defjs("2>r", function twoToR(): void {
            let top = f.stack.pop();
            f.returnStack.push(f.stack.pop());
            f.returnStack.push(top);
        });

        f.defjs("2r@", function twoRFetch(): void {
            f.stack.push(f.returnStack.peek(2));
            f.stack.push(f.returnStack.peek(1));
        });

        return f;
    }
}

export default StackOperations;