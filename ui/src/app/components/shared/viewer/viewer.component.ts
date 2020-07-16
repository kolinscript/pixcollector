import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output, Renderer2,
  SimpleChanges
} from '@angular/core';
import { PhotoService } from '../../../services/photo.service';

export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft'
}

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnChanges, OnDestroy {
  href: string;
  controlsViewed: boolean = false;
  globalMousemoveListenFunc: Function;
  globalMousemoveStopInterval;
  @Input() viewerPix;
  @Input() selfStock;
  @Output() close = new EventEmitter<boolean>();
  @Output() slideTo = new EventEmitter<string>();
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === KEY_CODE.RIGHT_ARROW) {
      this.slide('right');
    }
    if (event.code === KEY_CODE.LEFT_ARROW) {
      this.slide('left');
    }
  }

  constructor(
    private renderer: Renderer2,
    private photoService: PhotoService,
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
    }, 2000);
  }

  public slide(direction: 'left' | 'right'): void {
    this.slideTo.emit(direction);
  }

  public closeViewer(): void {
    this.close.emit();
  }

  public likePix(): void {
    this.photoService.vkLike(this.viewerPix.owner_id, this.viewerPix.id).subscribe((res) => {
      console.log(res);
    });
  }

  public stealPix(): void {
    this.photoService.vkSave(this.viewerPix.owner_id, this.viewerPix.id).subscribe((res) => {
      console.log(res);
    });
  }

  private activateControlView() {
    this.globalMousemoveStopInterval = setInterval(() => {
      this.controlsViewed = false;
    }, 2000);
    this.globalMousemoveListenFunc = this.renderer.listen('document', 'mousemove', e => {
      this.controlsViewed = true;
    });
  }

  private deactivateControlView() {
    this.globalMousemoveListenFunc();
    clearInterval(this.globalMousemoveStopInterval);
  }

}
