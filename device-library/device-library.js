Devices = new Meteor.Collection("devices");

var displayDetail = function(device_selected){
  // console.log(Session.get('device_selected'));

  if (device_selected!= undefined) {
    $('.detail-modal').addClass('visible');
    // $('.home').addClass('invisible');
  } else {
    $('.detail-modal').removeClass('visible');
    // $('.home').removeClass('invisible');
  }
}


if (Meteor.isClient) {

  Session.setDefault('device_selected', undefined);
  Session.setDefault('mode', undefined);

  // the nav stuff
  Template.nav.events({
    'click .add_device' : function(){
      $('.input-modal').css('display', 'block');
      $('.home').addClass('detail');
    }
  });

  // The 'homepage' list of devices 
  Template.device_list.events({
    'click .device_thumb_mod' : function() {

      Session.set('device_selected', this._id);
      Session.set('mode', 'detail');
      displayDetail(Session.get('device_selected'));
    }
  });

  Template.device_list.helpers({
    'devices' : function() {
      return Devices.find({}).fetch();
    },
    'mode' : function() {
      if (Session.get('mode') == 'detail'){
        return 'detail';
      } else if (Session.get('mode') == 'input')
      {
        return 'input';
      } else {
        return 'no-mode';
      }
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
      Session.set('device_selected', undefined);
      Session.set('mode', undefined);
      displayDetail(Session.get('device_selected'));
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
        img : data.device_img,
        name : data.device_name,
        class : data.device_class,
        os : data.os,
        resolution : data.res,
        release : data.release,
        notes : data.notes,
        status : 'in',
        borrower: undefined,
        history: [{'message' : 'The device was created.'}]
      })
    }
  })

  Meteor.startup(function () {
    // Devices.remove({});
  });
}
