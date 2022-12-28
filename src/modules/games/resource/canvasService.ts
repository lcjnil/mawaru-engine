export class CanvasService {
    layers: Map<string, CanvasRenderingContext2D> = new Map();

    defaultLayer!: CanvasRenderingContext2D;
    defaultLayerSize = {
        width: 0,
        height: 0,
    };

    addLayer(name: string, canvas: HTMLCanvasElement) {
        this.layers.set(name, canvas.getContext('2d')!);
    }

    createCanvas({
        name,
        width,
        height,
        container,
        isDefault = false,
    }: {
        name: string;
        width: number;
        height: number;
        container: HTMLElement;
        isDefault: boolean;
    }) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.imageRendering = 'pixelated';
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        container.appendChild(canvas);
        this.addLayer(name, canvas);

        if (isDefault) {
            this.defaultLayer = canvas.getContext('2d')!;
            this.defaultLayerSize = {
                width,
                height,
            };
        }

        return canvas;
    }
}
