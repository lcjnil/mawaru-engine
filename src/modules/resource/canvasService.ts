export class CanvasService {
    constructor(public scaleRatio = 1) {}

    layers: Map<string, CanvasRenderingContext2D> = new Map();

    addLayer(name: string, canvas: HTMLCanvasElement) {
        this.layers.set(name, canvas.getContext('2d')!);
    }

    getLayer(name: string) {
        return this.layers.get(name);
    }
}
