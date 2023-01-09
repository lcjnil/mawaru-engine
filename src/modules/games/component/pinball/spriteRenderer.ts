import { Component } from '../../../ecs';

interface SpriteConfig {
    scale: number;
    width: number;
    height: number;
    verticalCount: number;
    horizontalCount: number;
    totalCount: number;
    loop: boolean;
    fps: number;
    offset?: number;
}

@Component
export class SpriteRenderer {
    constructor(public img: HTMLImageElement, public config: SpriteConfig) {}

    startTime = 0;
}
