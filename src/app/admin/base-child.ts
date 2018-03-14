export class BaseChild {
  private isShow = false;
  private contentText = 'child';

  constructor() { }

  setTitle(text) {
    this.contentText = text;
  }

  show(isShow) {
    this.isShow = isShow;
  }

  get title() {
    return this.contentText;
  }
}
