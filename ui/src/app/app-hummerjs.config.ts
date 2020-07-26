import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}
