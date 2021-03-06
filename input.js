
// Doubling this up because scope. Not ideal.

var displayChange = function(){
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


//The input template handling starts here

if (Meteor.isClient) {
    //vars for art chooser
    var i = 0;
    var limit = 15;

  Template.device_detail.events({
    // handle individual click, convert to field
    'click .editable': function(event, template) {
      // this.id is the id of the obj in play here...
      var $target = $(event.target);

      if(!$target.hasClass('editable')) {
        $target = $target.parent('.editable');
      }

      var originalText = $(event.target).text();
      var $textField = $('<input/>').addClass('newValue').attr('value', originalText);
      $target.html($textField);
      $target.find('input').focus();
    },
    'keypress input': function() {
      if (event.charCode == 13) { // enter
          var $target = $(event.target);
          var newValue = $target.attr('value');
          var field = $target.parent().data('field');
          $target.parent().html( $('<strong/>').text(newValue) );

          var data = {};
          data[field] = newValue;

          Meteor.call('updateDevice', this._id, data, function() {
            console.log('done?');
          });
      }
    },
    'click #device_delete': function() {
      var response = confirm('Are you sure you want to delete ' + this.name + '?');

      if(response) {
        Meteor.call('removeDevice', this._id);
      }
    }
  });

  Template.device_input.events({
    'click .close' : function(){
      Session.set('mode', undefined);
      displayChange();
    },
    //cycle through images
    'click .left-arrow' : function(){
      if(i>1){
        i--;
        $('.input_img').attr('src', '/img/devices-'+i+'.svg');
      } else if(i==1){
        i = limit;
        $('.input_img').attr('src', '/img/devices-'+i+'.svg');
      }
    },
    'click .right-arrow' : function(){
      if(i<limit){
        i++;
        $('.input_img').attr('src', '/img/devices-'+i+'.svg');
      } else if(i==limit){
        i = 1;
        $('.input_img').attr('src', '/img/devices-'+i+'.svg');
      }
    },
    //handle a submit click
    'click #input_submit' : function() {
      //check to make sure all fields are filled in
      if($('#add_class').val()==='' || $('#add_name').val()==='' || $('#add_os').val()==='' || $('#add_res').val()==='' || $('#add_release').val()===''){
        alert('You forgot something.');
        return false;
      };

      //fetch all the data from the inputs
      var data = {};
      data.device_img = $('.input_img').attr('src');
      data.device_class = $('#add_class').val();
      data.device_name = $('#add_name').val();
      data.os = $('#add_os').val();
      data.release = $('#add_release').val();
      data.res = $('#add_res').val();
      data.notes = $('#add_notes').val();

      //call our meteor method to stick this junk in the db
      Meteor.call('addDevice', data);

      //close the modal (maybe add success someday?)
      Session.set('mode', undefined);
      displayChange();
    }
  });
}