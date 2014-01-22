Devices = new Meteor.Collection("devices");

var Modal =  function(device_selected){
  if(device_selected===undefined){
    $('.detail_modal').removeClass('open');
    $('.detail_modal').addClass('closed');
  } else {
    $('.detail_modal').removeClass('closed');
    $('.detail_modal').addClass('open');  
  }
}

if (Meteor.isClient) {

  Session.setDefault('device_selected', undefined);

  // the nav stuff
  Template.nav.events({
    'click .add_device' : function(){
      $('.input_modal').css('display', 'block');
    }
  });


  // The 'homepage' list of devices 
  Template.device_list.events({
    'click .open' : function() {
      Modal(Session.get('device_selected'));
      Session.set('device_selected', this._id);
    }
  });

  Template.device_list.helpers({
    'devices' : function() {
      return Devices.find({}).fetch();
    }
  });


  //Add a new device to the collection
  Template.device_input.events({
    'click .input_close' : function() {
      $('.input_modal').css('display', 'none');
    },
    'click .input_submit' : function() {
      //check to make sure all fields are filled in
      if($('#add_class').val()==='' || $('#add_name').val()==='' || $('#add_os').val()==='' || $('#add_res').val()==='' || $('#add_release').val()===''){
        alert('You forgot something.');
        return false;
      };

      //fetch all the data from the inputs
      var data = {};
      data.device_img = $('#add_img').val();
      data.device_class = $('#add_class').val();
      data.device_name = $('#add_name').val();
      data.os = $('#add_os').val();
      data.release = $('#add_release').val();
      data.res = $('#add_res').val();
      data.notes = $('#add_notes').val();

      Meteor.call('addDevice', data);

      $('.input_modal').fadeOut();
    }
  });


  // View a device Detail modal

  Template.device_detail.helpers({
    'device' : function() {
      var devices =  Devices.find({_id: Session.get('device_selected')}).fetch();

      //reverse the history array so the latest thing is on top
      for (var i = 0; i<devices.length; i++){
        devices[0].history.reverse();
      }
      
      return devices;
    }
  });

  Template.device_detail.events({
    'click .close' : function() {
      Modal(Session.get('device_selected'));
      Session.set('device_selected', undefined);
    }, 
    'click #checkout_submit' : function() {
      var device = Devices.find({_id: Session.get('device_selected')}).fetch();

      if (device[0].status == 'in'){
        var borrower = $('#checkout_name').val();
        Devices.update({_id: Session.get('device_selected')}, {$set: {'borrower': borrower, 'status':'out'}});
        Devices.update({_id: Session.get('device_selected')}, {$push: {'history': {'name' : borrower, 'message' : 'checked out the device.'}}});
        $('#checkout_submit').val('Bring it back!');
      } else {
        $('#checkout_submit').val('Check it out!');
        Devices.update({_id: Session.get('device_selected')}, {$set: {'borrower': null, 'status':'in'}});
        Devices.update({_id: Session.get('device_selected')}, {$push: {'history': {'name' : device[0].borrower, 'message' : 'brought it back.'}}});
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    addDevice: function(data){
      Devices.insert({
        img : '/img/'+data.device_img+'.svg',
        name : data.device_name,
        class : data.device_class,
        os : data.os,
        resolution : data.res,
        release : data.release,
        notes : data.notes,
        status : 'in',
        borrower: undefined,
        history: []
      })
    }
  })

  Meteor.startup(function () {

  });
}
