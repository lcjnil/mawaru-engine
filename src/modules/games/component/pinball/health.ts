import { Component } from '../../../ecs';

@Component
export class Health {
    constructor(public value: number) {}
}
