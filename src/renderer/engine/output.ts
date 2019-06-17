/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-var-requires
let Long = require("long");

class Output {

    public constructor(f: any) {

        f._output = "";

        f.defjs("cr", function cr(): void {
            f._output += "\n";
        });

        f.defjs(".", function dot(): void {
            let value;
            const top = f.stack.pop();

            if (typeof top === "undefined")
                value = "undefined";
            else if (top === null)
                value = "null";
            else
                value = top.toString(f._base()); // Output numbers in current base

            f._output += value + " ";
        });

        f.defjs(".s", function dotS(): void {
            let vals = []
            for (let i = 1; i <= f.stack.length(); i++) {
                let top = f.stack.peek(i);
                let value;

                if (typeof top === "undefined")
                    value = "undefined";
                else if (top === null)
                    value = "null";
                else
                    value = top.toString(f._base()); // Output numbers in current base

                // f._output += value + " ";
                vals.push(value)
            }
            f._output = `<${f.stack.length()}> ${vals.reverse().join(' ')}`
        });

        f.defjs(".r", function dotR(): void {
            let value: string;
            const width = f.stack.pop();
            const top = f.stack.pop();

            if (typeof top === "undefined")
                value = "undefined";
            else if (top === null)
                value = "null";
            else
                value = top.toString(f._base()); // Output numbers in current base

            while (value.length < width) {
                value = " " + value;
            }
            f._output += value + " ";
        });

        f.defjs("emit", function emit(): void {
            const value = f.stack.pop();
            if (typeof value === "number")
                f._output += String.fromCharCode(value);
            else
                f._output += value;
        });

        f.defjs("type", function type(): void {
            const length = f.stack.pop();
            const address = f.stack.pop();
            for (let i = 0; i < length; i++) {
                const value = f._getAddress(address + i);
                if (typeof value === "number") {
                    f._output += String.fromCharCode(value);
                } else
                    f._output += value;
            }
        });

        // Numeric output
        const numericOutputStart = f.dataSpace.length;
        let numericOutput = "";
        f.dataSpace.length += 128;

        f.defjs("<#", function initialiseNumericOutput(): void {
            numericOutput = "";
        });

        f.defjs("hold", function hold(): void {
            let value = f.stack.pop();
            if (typeof value === "number")
                value = String.fromCharCode(value);
            numericOutput += value;
        });

        f.defjs("#>", function finishNumericOutput(): void {
            f.stack.pop();
            f.stack.pop();
            for (let i = 0; i < numericOutput.length; i++) {
                f.dataSpace[numericOutputStart + i] = numericOutput[numericOutput.length - i - 1];
            }
            f.stack.push(numericOutputStart);
            f.stack.push(numericOutput.length);
        });

        f.defjs("sign", function sign(): void {
            if (f.stack.pop() < 0)
                numericOutput += "-";
        });

        f.defjs("#", function writeNextNumericOutput(): void {
            let bigPart = f.stack.pop();
            let smallPart = f.stack.pop();
            let value = new Long(smallPart, bigPart, true);
            let base = Long.fromInt(f._base());

            numericOutput += value.mod(base).toString(base).toUpperCase();
            value = value.div(base);

            f.stack.push(value.smallPart);
            f.stack.push(value.bigPart);
        });

        f.defjs("#S", function writeAllNumericOutput(): void {
            let bigPart = f.stack.pop();
            let smallPart = f.stack.pop();
            let value = new Long(smallPart, bigPart, true);
            let base = Long.fromInt(f._base());

            if (value.compare(Long.ZERO)) {
                while (value.compare(Long.ZERO)) {
                    numericOutput += value.mod(base).toString(base).toUpperCase();
                    value = value.div(base);
                }
            } else {
                numericOutput += "0";
            }

            f.stack.push(0);
            f.stack.push(0);
        });

        f.defjs(">number", function toNumber(): void {
            let base = Long.fromInt(f._base());
            let length = f.stack.pop();
            let address = f.stack.pop();
            let bigPart = f.stack.pop();
            let smallPart = f.stack.pop();
            let value = new Long(smallPart, bigPart, true);
            let unconverted = length;

            for (let i = 0; i < length; i++) {
                let next = parseInt(String.fromCharCode(f._getAddress(address)), base);

                if (isNaN(next)) {
                    break;
                } else {
                    address++;
                    unconverted--;
                    value = value.mul(base).add(Long.fromInt(next));
                }
            }

            f.stack.push(value.low);
            f.stack.push(value.high);
            f.stack.push(address);
            f.stack.push(unconverted);
        });

    }
}

// module.exports = Output;
export default Output;
