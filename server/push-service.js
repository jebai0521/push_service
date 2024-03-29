module.exports = function (app) {
  var Notification = app.models.notification;
  var Application = app.models.application;
  var PushModel = app.models.push;

  function startPushServer() {
// Add our custom routes
    var badge = 1;
    app.post('/notify/:id', function (req, res, next) {
      var note = new Notification({
        expirationInterval: 3600, // Expires 1 hour from now.
        badge: badge++,
        sound: 'ping.aiff',
        alert: '\uD83D\uDCE7 \u2709 ' + 'Hello, Perkd',
        messageFrom: 'Ray',
        payload : {
          type : "mail",
          title : "Mail1",
          cid : "FVaxUx3",
          summary : "http://dev.sencloud.com.cn/waveo/edm/1/summary.html",
          url : "http://dev.sencloud.com.cn/waveo/msg/index.html"
        }

      });

      PushModel.notifyById(req.params.id, note, function (err) {
        if (err) {
          console.error('Cannot notify %j: %s', req.params.id, err.stack);
          next(err);
          return;
        }
        console.log('pushing notification to %j', req.params.id);
        res.send(200, 'OK');
      });
    });

    app.post('/notify/:id/notification', function (req, res, next) {
      var note = new Notification({
        expirationInterval: 3600, // Expires 1 hour from now.
        badge: badge++,
        sound: 'ping.aiff',
        alert: '\uD83D\uDCE7 \u2709 ' + 'Hello, Perkd',
        messageFrom: 'Ray',
        payload : {
          type : "mail",
          title : "Mail1",
          cid : "FVaxUx3",
          summary : "http://dev.sencloud.com.cn/waveo/edm/1/summary.html",
          url : "http://dev.sencloud.com.cn/waveo/msg/index.html"
        }

      });

      PushModel.notifyById(req.params.id, note, function (err) {
        if (err) {
          console.error('Cannot notify %j: %s', req.params.id, err.stack);
          next(err);
          return;
        }
        console.log('pushing notification to %j', req.params.id);
        res.send(200, 'OK');
      });
    });

    PushModel.on('error', function (err) {
      console.error('Push Notification error: ', err.stack);
    });

// Pre-register an application that is ready to be used for testing.
// You should tweak config options in ./config.js

    var config = require('./config');

    var perkdApp = {
      id: 'com.sencloud.perkdev',
      userId: 'sencloud',
      name: config.appName,

      description: 'Perkdev Test For Message',
      pushSettings: {
        apns: {
          certData: config.apnsCertData,
          keyData: config.apnsKeyData,
          pushOptions: {
            // Extra options can go here for APN
          },
          feedbackOptions: {
            batchFeedback: true,
            interval: 300
          }
        },
        gcm: {
          serverApiKey: config.gcmServerApiKey
        }
      }
    };

    updateOrCreateApp(function (err, appModel) {
      if (err) {
        throw err;
      }
      console.log('Application id: %j', appModel.id);
    });

//--- Helper functions ---
    function updateOrCreateApp(cb) {
      Application.findOne({
          where: { name: perkdApp.name }
        },
        function (err, result) {
          if (err) cb(err);
          if (result) {
            console.log('Updating application: ' + result.id);
            result.updateAttributes(perkdApp, cb);
          } else {
            return registerApp(cb);
          }
        });
    }

    function registerApp(cb) {
      console.log('Registering a new Application...');
      // Hack to set the app id to a fixed value so that we don't have to change
      // the client settings
      Application.beforeSave = function (next) {
        if (this.name === perkdApp.name) {
          this.id = 'com.sencloud.perkdev';
        }
        next();
      };
      Application.register(
          perkdApp.userId,
          perkdApp.name,
        {
          description: perkdApp.description,
          pushSettings: perkdApp.pushSettings
        },
        function (err, app) {
          if (err) {
            return cb(err);
          }
          return cb(null, app);
        }
      );
    }
  }

  startPushServer();
};
