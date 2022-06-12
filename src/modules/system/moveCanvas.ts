import { BaseSystem, Resource, System } from '../ecs';
import { Camera } from '../resource/camera';
import { Mouse } from '../resource/mouse';

@System
export class MoveCamera extends BaseSystem {
    run(@Resource(Camera) camera: Camera, @Resource(Mouse) mouse: Mouse) {
        if (mouse.x !== -1 && mouse.y !== -1) {
            camera.moveCamera(mouse.x, mouse.y);
        }
    }
}
