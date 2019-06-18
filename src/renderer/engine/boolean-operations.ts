/* eslint-disable @typescript-eslint/no-explicit-any */
class ComparisonOperations {
    public constructor(f: any) {
        f.defjs("true", function _true(): void {
            f.stack.push(-1);
        });

        f.defjs("false", function _false(): void {
            f.stack.push(0);
        });

        f.defjs("and", function and(): void {
            let first = f.stack.pop();
            f.stack.push(f.stack.pop() & first);
        });

        f.defjs("or", function or(): void {
            let first = f.stack.pop();
            f.stack.push(f.stack.pop() | first);
        });

        f.defjs("xor", function xor(): void {
            let first = f.stack.pop();
            f.stack.push(f.stack.pop() ^ first);
        });

        f.defjs("invert", function invert(): void {
            f.stack.push(~f.stack.pop());
        });

        f.defjs("=", function equal(): void {
            let first = f.stack.pop();
            f.stack.push((f.stack.pop() == first) ? -1 : 0);
        });

        f.defjs("<>", function notEqual(): void {
            let first = f.stack.pop();
            f.stack.push((f.stack.pop() != first) ? -1 : 0);
        });

        f.defjs("<", function lessThan(): void {
            let first = f.stack.pop();
            f.stack.push((f.stack.pop() < first) ? -1 : 0);
        });

        f.defjs(">", function greaterThan(): void {
            let first = f.stack.pop();
            f.stack.push((f.stack.pop() > first) ? -1 : 0);
        });

        f.defjs("<=", function lessThanEqual(): void {
            let first = f.stack.pop();
            f.stack.push((f.stack.pop() <= first) ? -1 : 0);
        });

        f.defjs(">=", function greaterThanEqual(): void {
            let first = f.stack.pop();
            f.stack.push((f.stack.pop() >= first) ? -1 : 0);
        });

        f.defjs("within", function within(): void {
            let upperLimit = f.stack.pop();
            let lowerLimit = f.stack.pop();
            let value = f.stack.pop();
            let result = (lowerLimit < upperLimit && lowerLimit <= value && value < upperLimit ||
                lowerLimit > upperLimit && (lowerLimit <= value || value < upperLimit));
            f.stack.push(result ? -1 : 0);
        });

    }
}
export default ComparisonOperations;