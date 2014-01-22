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
      var data = {};
      data.device_name = $('#add_name').val();
      data.os = $('#add_os').val();
      data.release = $('#add_release').val();
      data.res = $('#add_res').val();
      data.notes = $('#add_notes').val();

      console.log(data);

      Meteor.call('addDevice', data);
    }
  });


  // View a device Detail modal

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
  Meteor.methods({
    addDevice: function(data){
      Devices.insert({
        img_thumb : '/img/img_thumb.jpg',
        img_large : '/img/img_large.jpg',
        name : data.device_name,
        os : data.os,
        resolution : data.res,
        release : data.release,
        notes : data.notes,
        status : 'in'
      })
    }
  })

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
