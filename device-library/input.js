
if (Meteor.isClient) {
    //vars for art chooser
    var i = 0;
    var limit = 10;

  //Add a new device to the collection
  Template.device_input.events({
    //cycle through images
    'click .input_img' : function(){
      if(i<limit){
        $('.input_img').attr('src', '/img/device'+i+'.svg');
        i++;
      } else {
        i = 0;
        $('.input_img').attr('src', '/img/device'+i+'.svg');
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
      $('.input-modal').css('display', 'none');
      $('.home').removeClass('detail');
    }
  });
}