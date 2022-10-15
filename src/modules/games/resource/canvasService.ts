export class CanvasService {
    layers: Map<string, CanvasRenderingContext2D> = new Map();

    defaultLayer!: CanvasRenderingContext2D;

    addLayer(name: string, canvas: HTMLCanvasElement) {
        this.layers.set(name, canvas.getContext('2d')!);
    }

    getLayer(name: string) {
        return this.layers.get(name);
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

        container.appendChild(canvas);
        this.addLayer(name, canvas);

        if (isDefault) {
            this.defaultLayer = canvas.getContext('2d')!;
        }

        return canvas;
    }
}
