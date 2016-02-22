angular.module('journey')
  .service('errService', function() {

    this.error = function(err) {
      var message, status;
      if (err.data) {
        if (err.data.message) {
            message = err.data.message;
        }
        else if (err.data) {
            message = err.data;
        }
        status = 'Message: ' + err.status + ' || Status:' + err.statusText;
      } else {
        message = 'Unknown Error';
        status = 'Unknown Status';
      }
      console.error(err)
      // TODO: SWITCH TO VEX ALERTS / MODALS
      swal({
        title: 'ERROR!',
        text: '<p>Something went wrong...</p><br><strong>' + message + '</strong><br>Code: [ <strong>' + status + '</strong> ]',
        type: 'error',
        html: true
      });
    };

  });
