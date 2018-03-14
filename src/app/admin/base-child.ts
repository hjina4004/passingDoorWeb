import * as $ from 'jquery';

export class BaseChild {
  private isShow = false;
  private contentText = 'child';

  constructor(title:string) {
    this.setTitle(title);
  }

  setTitle(text) {
    this.contentText = text;
  }

  show(isShow) {
    this.isShow = isShow;
  }

  get title() {
    return this.contentText;
  }

  confirmModal(data) {
    $('#myModal').modal('show');
    $('#myModal').find('.modal-title').html(data.title);
    $('#myModal').find('.modal-body').html(data.message);
  }
}
