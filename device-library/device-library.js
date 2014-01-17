Devices = new Meteor.Collection("devices");

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to device-library.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.device_list.helpers({
    'devices' : function() {
      return Devices.find({}).fetch();
    }
  });

  Template.device_list.events({
    'click .device_thumb_mod' : function() {
      console.log(this._id);
    }
  });

  Template.device_detail.helpers({
    'device' : function() {
      return Devices.find({_id: Session.get('device_selected')}).fetch();
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
