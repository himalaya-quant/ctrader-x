export class Sleep {
    static async ms(milliseconds: number) {
        await new Promise<void>((r) =>
            setTimeout(() => {
                r();
            }, milliseconds),
        );
    }

    static async s(seconds: number) {
        await this.ms(seconds * 1000);
    }
}
