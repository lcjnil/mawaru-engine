export class Mouse {
    x = -1;
    y = -1;

    bindEvents(canvas: HTMLCanvasElement, scaleRatio = 2) {
        canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.x = touch.clientX * scaleRatio;
            this.y = touch.clientY * scaleRatio;

            const onTouchMove = (e: TouchEvent) => {
                const touch = e.touches[0];
                this.x = touch.clientX * scaleRatio;
                this.y = touch.clientY * scaleRatio;
            };

            const onTouchEnd = () => {
                this.x = -1;
                this.y = -1;
                canvas.removeEventListener('touchmove', onTouchMove);
                canvas.removeEventListener('touchend', onTouchEnd);
            };

            canvas.addEventListener('touchmove', onTouchMove);
            canvas.addEventListener('touchend', onTouchEnd);
        });
    }
}
