
export class CommonStorage {
    protected mStorage: Storage;

    public constructor() { }

    public get(key: string, defaultValue: any): any {
        if(this.mStorage == null) {
            console.warn("bad storage");
            return null;
        }

        let value = this.mStorage.getItem(key);
        try {
            value = JSON.parse(value);
        } catch {
            value = null;
        }
        if (value === null && defaultValue) {
            value = defaultValue;
        }
        return value;
    }

    public set(key: string, value: any) {
        if(this.mStorage == null) {
            console.warn("bad storage");
            return null;
        }
        this.mStorage.setItem(key, JSON.stringify(value));
    }

    public remove(key: string) {
        if(this.mStorage == null) {
            console.warn("bad storage");
            return null;
        }
        this.mStorage.removeItem(key);
    }
}
