export class Camera {
    offset = 0;

    async moveDelta(offset: number, duration?: number) {
        if (!duration) {
            this.offset = offset;
            return;
        }

        return new Promise<void>((resolve) => {
            // TODO: global tick
            const now = Date.now();
            const startOffset = this.offset;
            const tick = () => {
                const p = Math.min((Date.now() - now) / duration, 1);
                this.offset = startOffset + offset * p;
                if (p < 1) {
                    window.requestAnimationFrame(tick);
                } else {
                    resolve();
                }
            };

            window.requestAnimationFrame(tick);
        });
    }
}
