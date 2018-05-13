import * as $ from 'jquery';

export class BaseChild {
  isShow = false;
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

  showConfirmModal(data) {
    $('#myModal').modal('show');
    $('#myModal').find('.modal-title').html(data.title);
    $('#myModal').find('.modal-body').html(data.message);

    $('#btn-modal-ok').removeClass('hide');
    $('#btn-modal-cancel').removeClass('hide');

    $('#btn-modal-ok').text('확인');
    $('#btn-modal-cancel').text('취소');

    if (data.type)  $('#myModal').find('.modal-type').val(data.type);
    else            $('#myModal').find('.modal-type').val('');
  }

  showModal(data) {
    this.showConfirmModal(data);
    $('#btn-modal-ok').addClass('hide');
    $('#btn-modal-cancel').text('확인');
  }
  hideModal() {
    $('#myModal').modal('hide');
  }

  buttonModal(data) {
    if (data.btn_ok) {
      $('#btn-modal-ok').removeClass('hide');
      $('#btn-modal-ok').text(data.btn_ok);
    }
    if (data.btn_cancel) {
      $('#btn-modal-cancel').removeClass('hide');
      $('#btn-modal-cancel').text(data.btn_cancel);
    }
  }
}
