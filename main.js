Devices = new Meteor.Collection("devices");

var displayChange = function() {
  if (Session.get('mode') == undefined) {

    $('.home').addClass('visible');
    $('.detail-modal').removeClass('visible');
    $('.input-modal').removeClass('visible');

  } else if (Session.get('mode') == 'detail') {

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

  Template.login.events({

    'submit #login-form': function(e, t) {
      e.preventDefault();

      var email = t.find('#login-email').value,
        password = t.find('#login-password').value;

      email = $.trim(email);
      password = $.trim(password);

      // needs validation...

      // If validation passes, supply the appropriate fields to the
      // Meteor.loginWithPassword() function.
      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          // The user might not have been found, or their password
          // could be incorrect. The login attempt has failed.
          console.log('login error', err);
        } else {
          // The user has been logged in.
          console.log('login successful');
          Session.set('logged_in', true);
        }
      });
      return false;
    },
    'click .close': function() {
      $('.account-form').hide();
    }
  });

  Template.register.events({
    'submit #register-form': function(e, t) {
      e.preventDefault();
      var email = t.find('#account-email').value,
        password = t.find('#account-password').value,
        username = t.find('#account-name').value,
        key = t.find('#account-key').value;

      // Trim and validate the input
      Meteor.call('checkKey', key, function(err, result) {
        if (result) {
          Accounts.createUser({ username: username, email: email, password: password }, function(err) {
            if (err) {
              // Inform the user that account creation failed
              console.log('fail', err);
            } else {
              // Success. Account has been created and the user
              // has logged in successfully.
              Session.set('logged_in', true);
              console.log('user created');
              displayChange();
            }

          });
        } else {
          console.log('keycheck failed', result);
        }

      })

      return false;
    },
    'click .close': function() {
      $('.account-form').hide();
    }
  });

  // the nav stuff
  Template.nav.events({
    'click .add_device': function() {
      Session.set('mode', 'input');
      displayChange();
    },
    'click .logo': function() {
      Session.set('mode', undefined);
      displayChange();
    },
    'click .show_login': function() {
      $('.account-form').hide();
      $('.login-form').show();
    },
    'click .show_register': function() {
      $('.account-form').hide();
      $('.register-form').show();
    },
    'click .user_logout': function() {
      Meteor.logout(function(err) {
        if (err) {
          console.log('logout error', err);
        } else {
          console.log('logged out successfully');
        }
      });
    }
  });

  // The 'homepage' list of devices
  Template.device_list.events({
    'click .device-thumb-mod': function() {
      Session.set('device_selected', this._id);
      Session.set('mode', 'detail');
      displayChange();
    }
  });

  Template.device_list.helpers({
    'devices': function() {
      return Devices.find({}).fetch();
    },
    //using this to put a class on the home div
    'mode': function() {
      if (Session.get('mode') == 'detail') {
        return 'detail';
      } else if (Session.get('mode') == 'input') {
        return 'input';
      } else {
        return 'no-mode';
      }
    }
  });


  // View a device Detail modal
  Template.device_detail.helpers({
    'device': function() {
      var devices = Devices.find({
        _id: Session.get('device_selected')
      }).fetch();

      if (devices.length <= 0) {
        return [];
      }

      //reverse the history array so the latest thing is on top
      if (devices[0].hasOwnProperty('history')) {
        for (var i = 0; i < devices.length; i++) {
          devices[0].history.reverse();
        }
      }

      return devices;
    },
    'user': function() {
      var user = Meteor.user();
      return user && user.username;
    }
  });

  Template.device_detail.events({
    'click .close': function() {
      Session.set('device_selected', undefined);
      Session.set('mode', undefined);
      displayChange();
    },
    'click #checkout_submit': function() {
      var user = Meteor.user(),
          data = {},
          historyData = {
            name: user.username
          },
          buttonMsg;

      if(this.checked_out === false) {
        // the user is trying to check OUT the device

        // we want to...
        // - put their name in the history
        // - set checked_out to true
        // - set button text var
        // - set borrower to current user

        data.checked_out = true;
        data.borrower = user.username;
        historyData.message = "checked out the device.";
        buttonMsg = "Bring it back!";

      } else {
        // the user is trying to check IN the device

        // we want to...
        // - put their name in the history
        // - set checked_out to false
        // - set button text var
        // - set borrower to null

        data.checked_out = false;
        data.borrower = null;
        historyData.message = "checked in the device.";
        buttonMsg = "Check it out!";

      }

      if(user.username === this.borrower)

      Meteor.call('pushToHistory', this._id, historyData);
      $('#checkout_submit').attr('value', buttonMsg);
      Meteor.call('updateDevice', this._id, data);

      // if(user === null) {
      //   console.log('You must be logged-in to perform this action');
      //   return;
      // }

      // if (this.checked_out === false) {
      //   // check it out
      //   data.checked_out = true;
      //   buttonMsg = 'Bring it back!';
      //   Meteor.call('pushToHistory', this._id, {
      //     name: user.username,
      //     message: 'checked out the device.'
      //   });
      //   data.borrower = user.username;
      // } else {
      //   // check it in
      //   data.checked_out = false;
      //   buttonMsg = 'Check it out!';
      //   Meteor.call('pushToHistory', this._id, {
      //     name: data.borrower,
      //     message: 'brought it back.'
      //   });
      // }
    },
    'click #delete_device': function() {
      var response = confirm('are you sure you want to delete this?');
      if (response) {
        Meteor.call('removeDevice', this._id);
        Session.set('mode', undefined);
        displayChange();
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    addDevice: function(data) {
      Devices.insert({
        img: data.device_img,
        name: data.device_name,
        class: data.device_class,
        os: data.os,
        resolution: data.res,
        release: data.release,
        notes: data.notes,
        status: 'in',
        borrower: undefined,
        history: [{
          'message': 'The device was created.'
        }]
      });
    },
    updateDevice: function(id, data) {
      console.log('updating device', id, data);
      Devices.update({
        _id: id
      }, {
        $set: data
      });
    },
    removeDevice: function(id) {
      Devices.remove({
        _id: id
      });
    },
    pushToHistory: function(id, data) {
      Devices.update({
        _id: id
      }, {
        $push: {
          'history': data
        }
      })
    },
    checkKey: function(key) {
      return key === 'moist';
    }
  })

  Meteor.startup(function() {
    // Devices.remove({});
  });
}
