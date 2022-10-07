export enum PlayState {
    initial,
    playing,
    finished,
}

export class State {
    state = PlayState.initial;
    duration = 30 * 1000;
    startTime = 0;
    endTime = 0;

    start() {
        this.state = PlayState.playing;
        this.startTime = Date.now();
    }
}
