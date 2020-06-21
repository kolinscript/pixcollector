import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output, Renderer2,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() viewerPix;
  @Output() close = new EventEmitter<boolean>();
  @Output() slideTo = new EventEmitter<string>();
  href: string;
  controlsViewed: boolean = false;
  globalMousemoveListenFunc: Function;
  globalMousemoveStopInterval;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.href = this.viewerPix.url;
    this.activateControlView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if ('viewerPix' in changes) {
      this.href = this.viewerPix.url;
    }
  }

  ngOnDestroy() {
   this.deactivateControlView();
  }

  public mouseEnter(): void {
    clearInterval(this.globalMousemoveStopInterval);
  }

  public mouseLeave(): void {
    this.globalMousemoveStopInterval = setInterval(() => {
      this.controlsViewed = false;
    }, 3000);
  }

  public slideHandler(direction: 'left' | 'right'): void {
    this.slideTo.emit(direction);
  }

  public closeHandler(): void {
    this.close.emit();
  }

  private activateControlView() {
    this.globalMousemoveStopInterval = setInterval(() => {
      this.controlsViewed = false;
    }, 3000);
    this.globalMousemoveListenFunc = this.renderer.listen('document', 'mousemove', e => {
      this.controlsViewed = true;
    });
  }

  private deactivateControlView() {
    this.globalMousemoveListenFunc();
    clearInterval(this.globalMousemoveStopInterval);
  }

}
