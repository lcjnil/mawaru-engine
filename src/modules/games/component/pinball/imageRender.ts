import { Component } from '../../../ecs';

@Component
export class ImageRender {
    constructor(public img: HTMLImageElement, public scale = 1) {}
}
