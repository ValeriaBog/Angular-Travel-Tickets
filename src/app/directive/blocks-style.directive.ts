import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[appBlocksStyle]',
  host: {
    '(document:keyup)': 'initKeyUp($event)' //обработчик события
  },
  exportAs: 'blocksStyle'
})
export class BlocksStyleDirective implements OnInit, AfterViewInit, OnChanges {

  @Input() selector: string;
  @Input() initFirst: boolean = false;

  @Output() renderComplete = new EventEmitter();

  private items: HTMLElement[];
  private index: number = 0;
  public activeElementIndex: number;

  constructor(private el: ElementRef) {
  }

  ngOnChanges() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.activeElementIndex = 0;

    if (this.selector) {
      this.items = this.el.nativeElement.querySelectorAll(this.selector)
      if (this.initFirst) {
        if (this.items[0]) {
          (this.items[0] as HTMLElement).setAttribute('style', 'border: 2px solid red')
        }
      }
    } else {
      console.error("Не передан селектор")
    }

    setTimeout(() => {
      this.renderComplete.emit(true)
    })

  }

  initKeyUp(ev: KeyboardEvent): void | boolean{ // коллбек функция

    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {

      if(ev.key === 'ArrowLeft' && this.index === 0){
        return false;
      }

      if(ev.key === 'ArrowRight' && this.index === this.items.length-1){
        return false;
      }

      (this.items[this.index] as HTMLElement).removeAttribute('style')
    }
    console.log('evKey', ev);

    if (ev.key === 'ArrowRight') {

      this.index++;

      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 2px solid red');
      }
    } else if (ev.key === 'ArrowLeft') {

      this.index--;
      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 2px solid red');
      }
    }

    if (this.index >= 0) {
      this.activeElementIndex = this.index;
    }

  }

  initStyle(index: number) {

    if (this.items[index]) {
      (this.items[index] as HTMLElement).setAttribute('style', 'border: 2px solid red');
    } else if (!this.items[index]) {
      (this.items[index] as HTMLElement).removeAttribute('style');
    }
  }

}
