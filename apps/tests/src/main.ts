import '@shared/web-components';
import {TimerComponent} from "@shared/web-components";

const timer = document.getElementById('timer') as TimerComponent;

document.getElementById('setBtn')?.addEventListener('click', () => {
  timer.set(0, 10);
});


