export class Mouse {
    x = -1;
    y = -1;

    bindEvents(canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousedown', (e) => {
            this.x = e.offsetX;
            this.y = e.offsetY;

            const onMouseMove = (e: MouseEvent) => {
                this.x = e.offsetX;
                this.y = e.offsetY;
            };

            const onMouseUp = () => {
                this.x = -1;
                this.y = -1;
                canvas.removeEventListener('mousemove', onMouseMove);
                canvas.removeEventListener('mouseup', onMouseUp);
            };

            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('mouseup', onMouseUp);
        });
    }
}
