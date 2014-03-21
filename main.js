Devices = new Meteor.Collection("devices");

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


if (Meteor.isClient) {
  Session.setDefault('device_selected', undefined);
  Session.setDefault('mode', undefined);

  // the nav stuff
  Template.nav.events({
    'click .add_device' : function(){
      Session.set('mode', 'input');
      displayChange();
    },
    'click .logo' : function(){
      Session.set('mode', undefined);
      displayChange();
    }

  });

  // The 'homepage' list of devices 
  Template.device_list.events({
    'click .device-thumb-mod' : function() {
      Session.set('device_selected', this._id);
      Session.set('mode', 'detail');
      displayChange();
    }
  });

  Template.device_list.helpers({
    'devices' : function() {
      return Devices.find({}).fetch();
    },
    //using this to put a class on the home div
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

      if(devices.length <= 0) {
        return [];
      }

      //reverse the history array so the latest thing is on top
      if(devices[0].hasOwnProperty('history')) {
        for (var i = 0; i<devices.length; i++){
          devices[0].history.reverse();
        }
      }
      
      return devices;
    }
  });

  Template.device_detail.events({
    'click .close' : function() {
      Session.set('device_selected', undefined);
      Session.set('mode', undefined);
      displayChange();
    }, 
    'click #checkout_submit' : function() {
      data = {};

      var buttonMsg;
      if(this.checked_out === false) {
        data.checked_out = true;
        data.borrower = $('#checkout_name').val();
        buttonMsg = 'Bring it back!';
        Meteor.call('pushToHistory', this._id, { name: data.borrower, message: 'checked out the device.'});
      } else {
        data.checked_out = false;
        data.borrower = Devices.findOne({_id: Session.get('device_selected')}).borrower;
        buttonMsg = 'Check it out!';
        Meteor.call('pushToHistory', this._id, { name: data.borrower, message: 'brought it back.'});
      }

      $('#checkout_submit').attr('value', buttonMsg);
      Meteor.call('updateDevice', this._id, data);
    },
    'click #delete_device' : function() {
      var response = confirm('are you sure you want to delete this?');
      if(response) {
        Meteor.call('removeDevice', this._id);
        Session.set('mode', undefined);
        displayChange();
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
      });
    },
    updateDevice: function(id, data) {
      console.log('updating device', id, data);
      Devices.update({ _id: id }, { $set: data });
    },
    removeDevice: function(id) {
      Devices.remove({ _id: id });
    },
    pushToHistory: function(id, data) {
      Devices.update({ _id: id }, {$push: {'history': data} })
    }
  })

  Meteor.startup(function () {
    // Devices.remove({});
  });
}
