Devices = new Meteor.Collection("devices");

var Modal =  function(device_selected){
  if(device_selected===undefined){
    $('.modal').removeClass('open');
    $('.modal').addClass('closed');
  } else {
    $('.modal').removeClass('closed');
    $('.modal').addClass('open');  
  }
}

if (Meteor.isClient) {

  Session.setDefault('device_selected', undefined);

  Template.hello.greeting = function () {
    return "Welcome to device-library.";
  };

  Template.device_list.helpers({
    'devices' : function() {
      return Devices.find({}).fetch();
    }
  });

  Template.device_list.events({
    'click .open' : function() {
      Modal(Session.get('device_selected'));
      Session.set('device_selected', this._id);
    }
  });

  Template.device_detail.helpers({
    'device' : function() {
      return Devices.find({_id: Session.get('device_selected')}).fetch();
    }
  });

  Template.device_detail.events({
    'click .close' : function() {
      Modal(Session.get('device_selected'));
      Session.set('device_selected', undefined);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

    // Devices.insert({
    //   img_thumb : '/img/img_thumb.jpg',
    //   img_large : '/img/img_large.jpg',
    //   name : 'iPad',
    //   os : 'iOS7',
    //   resolution : '320x550',
    //   release : '2011',
    //   notes : 'this is a note',
    //   status : 'in'
    // });
  });
}
