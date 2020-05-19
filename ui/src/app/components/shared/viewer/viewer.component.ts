import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnChanges {
  @Input() viewerPix;
  @Output() close = new EventEmitter<boolean>();
  @Output() slideTo = new EventEmitter<string>();
  public href: string;

  constructor() { }

  ngOnInit(): void {
    this.href = this.viewerPix.url;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if ('viewerPix' in changes) {
      this.href = this.viewerPix.url;
    }
  }

  public slideHandler(direction: 'left' | 'right'): void {
    this.slideTo.emit(direction);
  }

  public closeHandler(): void {
    this.close.emit();
  }

}
