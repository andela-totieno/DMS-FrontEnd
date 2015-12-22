var seeder = require('mongoose-seed');
var db = require('../server/config/db');

// Data array containing seed data - documents organized by Model
var data = [{
  'model': 'Role',
  'documents': [{
    title: 'Admin'
  }, {
    title: 'Public'
  }]
}, {
  'model': 'User',
  'documents': [{
    name: {
      first: 'Donald',
      second: 'Okwenda'
    },
    username: 'Don',
    title: 'Admin',
    password: 'password',
    email: 'donald@gmail.com'
  }, {
    name: {
      first: 'Peggy',
      second: 'Mutheu'
    },
    username: 'Peggy',
    title: 'Public',

    password: 'password',
    email: 'peggy@gmail.com'
  }, {
    name: {
      first: 'Vaal',
      second: 'Okwenda'
    },
    username: 'Vaal',
    title: 'Public',
    password: 'password',
    email: 'vaal@gmail.com'
  }]
}, {
  'model': 'Document',
  'documents': [{
    title: 'Iphone 6 Review',
    content: 'The phone still features powerful internal components ' +
      'and is being upgraded to Apple’s latest iOS 9 software. ' +
      'The combination of factors mean it could be the ' +
      'ideal choice for bargain hunters.'
  }, {
    title: 'Periscope Review',
    content: 'Periscope’s direct tie-ins to Twitter (which bought ' +
      'the company before it even launched) allowed it ' +
      'to quickly be adopted by celebrities ' +
      'and change the way both public figures and ' +
      'Average Joes interact with each other on the Web.'
  }, {
    title: 'Flipboard allows sharing through Facebook Messenger',
    content: 'Flipboard has also added a new button that will ' +
      'show on articles opened from Messenger and allow people to easily ' +
      'navigate back to their friend’s message to discuss ' +
      'the article or share another story with them.'
  }]
}];

// Connect to MongoDB via Mongoose
seeder.connect(db.url, function() {

  // Load Mongoose models
  seeder.loadModels([
    '../DMS/server/models/user.js',
    '../DMS/server/models/document.js',
    '../DMS/server/models/role.js'
  ]);

  // Clear speerreerrrrrcified collections
  seeder.clearModels(['Role', 'User', 'Document'], function() {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data);

  });
});