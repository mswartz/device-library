(function(){var displayChange = function(){
  if (Session.get('mode') == undefined) {

    $('.home').addClass('visible');
    $('.detail-modal').removeClass('visible');
    $('.input-modal').removeClass('visible');

  } else if(Session.get('mode') == 'detail') {

    $('.home').removeClass('visible');
    $('.detail-modal').addClass('visible');
    $('.input-modal').removeClass('visible');

  } else if (Session.get('mode') == 'input') {

    $('.home').removeClass('visible');
    $('.detail-modal').removeClass('visible');
    $('.input-modal').addClass('visible');

  }
}

})();
