/* eslint-disable @typescript-eslint/no-explicit-any */
class MemoryOperations {
    public constructor(f: any) {
        const getAddress = (address: number): any => {
            if (address < 0) {
                return f._currentInput.charCodeAt(address - f._INPUT_SOURCE);
            } else {
                let value = f.dataSpace[address];
                if (typeof value == "string")
                    return value.charCodeAt(0);
                else
                    return value;
            }
        }
        const setAddress = (address: number, value: any): void => {
            if (address < 0) {
                throw "Illegal attempt to change input";
            } else {
                f.dataSpace[address] = value;
            }
        }

        f.defjs("!", function store(): void {
            let address = f.stack.pop();
            let data = f.stack.pop();
            setAddress(address, data);
        });

        f.defjs("@", function fetch(): void {
            let address = f.stack.pop();
            f.stack.push(getAddress(address));
        });

        f.defjs("+!", function addStore(): void {
            let address = f.stack.pop();
            let data = f.stack.pop();
            f.dataSpace[address] = f.dataSpace[address] + data;
        });

        f.defjs("-!", function subtractStore(): void {
            let address = f.stack.pop();
            let data = f.stack.pop();
            f.dataSpace[address] = f.dataSpace[address] - data;
        });

        f.defjs("here", function here(): void {
            f.stack.push(f.dataSpace.length);
        });

        f._getAddress = getAddress;
        f._setAddress = setAddress;
    }
}
// module.exports = MemoryOperations;
export default MemoryOperations;
