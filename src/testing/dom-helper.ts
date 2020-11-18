import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class DOMHelper<T> {
  fixture: ComponentFixture<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }

  singleText(tagName: string): string {
    const elem = this.fixture.debugElement.query(By.css(tagName));
    if (elem) {
      return elem.nativeElement.textContent;
    }
  }

  count(tagName: string): number {
    const elements = this.fixture.debugElement.queryAll(By.css(tagName));
    return elements.length;
  }

  countText(tagName: string, text: string): number {
    const elements = this.fixture.debugElement.queryAll(By.css(tagName));
    return elements.filter(element => element.nativeElement.textContent.trim() === text).length;
  }

  clickButton(text: string): void {
    const elements = this.fixture.debugElement.queryAll(By.css('button'));
    elements.forEach(element => {
      if (element.nativeElement.textContent.trim() === text) {
        element.nativeElement.click();
      }
    });
  }
}
