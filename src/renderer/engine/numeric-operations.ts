/* eslint-disable @typescript-eslint/no-explicit-any */
import Long, { fromInt } from "long";

class NumericOperations {
    public constructor(f: any) {
        f.defjs("+", function plus(): void {
            let first = f.stack.pop();
            f.stack.push(f.stack.pop() + first | 0);
        });

        f.defjs("-", function minus(): void {
            let first = f.stack.pop();
            f.stack.push(f.stack.pop() - first | 0);
        });

        f.defjs("*", function multiply(): void {
            let first = f.stack.pop();
            f.stack.push(f.stack.pop() * first | 0);
        });

        f.defjs("/", function divide(): void {
            let first = f.stack.pop();
            let second = f.stack.pop();
            f.stack.push(Math.trunc(second / first));
        });

        f.defjs("2*", function inc(): void {
            f.stack.push(f.stack.pop() << 1);
        });

        f.defjs("2/", function inc(): void {
            f.stack.push(f.stack.pop() >> 1);
        });

        f.defjs("mod", function mod(): void {
            let first = f.stack.pop();
            f.stack.push(f.stack.pop() % first);
        });

        f.defjs("s>d", function singleToDouble(): void {
            let value = fromInt(f.stack.pop());
            f.stack.push(value.low);
            f.stack.push(value.high);
        });

        f.defjs("*/", function multiplyDivide(): void {
            let divisor = fromInt(f.stack.pop());
            let first = fromInt(f.stack.pop());
            let second = fromInt(f.stack.pop());
            let quotient = first.mul(second).div(divisor).toInt();
            f.stack.push(quotient);
        });

        f.defjs("m*", function (): void {
            let first = fromInt(f.stack.pop());
            let second = fromInt(f.stack.pop());
            let result = first.mul(second);
            f.stack.push(result.low);
            f.stack.push(result.high);
        });

        f.defjs("*/mod", function multiplyDivideMod(): void {
            let divisor = fromInt(f.stack.pop());
            let first = fromInt(f.stack.pop());
            let second = fromInt(f.stack.pop());
            let mult = first.mul(second);
            let quotient = mult.div(divisor).toInt();
            let mod = mult.mod(divisor).toInt();
            f.stack.push(mod);
            f.stack.push(quotient);
        });

        f.defjs("um*", function (): void {
            let p1 = f.stack.pop()
            let first = fromInt(p1, true);
            let first_ = new Long(first.low, 0)
            // first.high = first.high < 0 ? 0 : first.high
            let p2 = f.stack.pop()
            let second = fromInt(p2, true);
            // second.high = second.high < 0 ? 0 : second.high
            let result = first.mul(second);
            f.stack.push(result.low);
            f.stack.push(result.high);
        });

        f.defjs("um/mod", function unsignedDivideMod(): void {
            let divisor = fromInt(f.stack.pop());
            let bigPart = f.stack.pop();
            let smallPart = f.stack.pop();
            let long = new Long(smallPart, bigPart, true);
            let quotient = long.div(divisor).toInt();
            let mod = long.mod(divisor).toInt();
            f.stack.push(mod);
            f.stack.push(quotient);
        });

        f.defjs("fm/mod", function flooredDivideMod(): void {
            let divisor = fromInt(f.stack.pop());
            let bigPart = f.stack.pop();
            let smallPart = f.stack.pop();
            let long = new Long(smallPart, bigPart);
            let quotient = long.div(divisor).toInt();
            let mod = long.mod(divisor).toInt();
            f.stack.push(mod);
            f.stack.push(quotient);
        });

        f.defjs("sm/rem", function symmetricDivideRem(): void {
            let divisor = fromInt(f.stack.pop());
            let bigPart = f.stack.pop();
            let smallPart = f.stack.pop();
            let long = new Long(smallPart, bigPart);
            let quotient = long.div(divisor).toInt();
            let mod = long.mod(divisor).toInt();
            f.stack.push(mod);
            f.stack.push(quotient);
        });

        f.defjs("abs", function abs(): void {
            f.stack.push(Math.abs(f.stack.pop()) | 0);
        });

        f.defjs("lshift", function lshift(): void {
            let shift = f.stack.pop();
            let num = f.stack.pop();
            f.stack.push(num << shift);
        });

        f.defjs("rshift", function rshift(): void {
            let shift = f.stack.pop();
            let num = f.stack.pop();
            f.stack.push(num >>> shift);
        });

        f.defjs("max", function max(): void {
            f.stack.push(Math.max(f.stack.pop(), f.stack.pop()));
        });

        f.defjs("min", function min(): void {
            f.stack.push(Math.min(f.stack.pop(), f.stack.pop()));
        });

        f.defjs("negate", function negate(): void {
            f.stack.push(-f.stack.pop());
        });
    }
}

export default NumericOperations;