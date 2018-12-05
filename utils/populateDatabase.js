const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/pittition', (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.dropDatabase()

var Schema = mongoose.Schema;
var PittitionSchema = new Schema({
    title: String,
    description: String,
    author: String,
    img_url: String,
    date: Date,
    status: String,
    updates: [{
      user: String,
      img_url: String,
      stateBefore: String,
      stateAfter: String,
      comment: String,
      date: Date,
    }],
    likes: [String],
    shares: String,
    followers: [String],
});

var UserSchema = new Schema({
    userName: String,
    password: String,
    firstName: String,
    lastName: String,
    img_url: String,
    type: String
});

var CommentSchema = new Schema({
  pittitionId: String,
  user: String,
  comment: String,
  userType: String,
  img_url: String,
  type: String,
  date: Date,
})

var resourceSchema = new Schema({
  resourceId: String,
  name: String,
  available: Boolean,
  reservedBy: String,
  note: String
})

function appendArray(size) {
  const array = [];
  for(var i = 0; i < size; i++) array.push('');
  return array;
}
// Compile model from schema
var Pittition = mongoose.model('PittitionModel', PittitionSchema);
var User = mongoose.model('UserModel', UserSchema);
var Comment = mongoose.model('CommentModel', CommentSchema);
var Resource = mongoose.model('ResourceModel', resourceSchema);

const largeArray = []
const mediumArray = []

for(var i = 0; i < 51; i++) mediumArray.push('');
for(var i = 0; i < 51; i++) mediumArray.push('');
for(var i = 0; i < 142; i++) largeArray.push(['']);

const resources = [
  {
    resourceId: "0ed0e3dc-1c74-4ac2-91db-b7b1751275f5",
    name: "Hospital Bed #123",
    available: false,
    reservedBy: 'John Doe',
    note: "Some Note blah blah blah"
  },
  {
    resourceId: "7e3cdf35-1126-4938-b31c-cacf5c8b15f2",
    name: "Hospital Bed #312",
    available: true,
    note: "Some Note blah blah blah"
  },
  {
    resourceId: "9b263326-cc18-4044-b86f-c5cd485e89d3",
    name: "X-Ray",
    available: false,
    reservedBy: 'Mary Jane',
    note: "Some Note blah blah blah"
  },
  {
    resourceId: "f4bc5e48-1298-4244-a948-8f48e648fa41",
    name: "CT-Scan",
    available: true,
    note: "Some Note blah blah blah"
  }
]
const pittitions = [
  {
    title: "Departmental Exams",
    description: "I believe departmental exams are ineffective at gauging a student's knowledge on the course material. Every professor teaches differnet material, emphasizes different conceps.",
    author: "jhd31",
    img_url: 'http://niksingh.net/img/matt.jpg',
    date: new Date(Date.now() - 92012020),
    status: 'waiting',
    updates: [],
    likes: ["nis80", "chz75"].concat(appendArray(29)),
    followers: ['demo', 'nis80'],
    shares: 0
  }
]

 
const users = [
  {
    userName: 'demo_student',
    password: 'demo_password',
    firstName: 'John',
    lastName: 'Doe',
    img_url: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    type: 'student'
  },
  {
    userName: 'admin',
    password: 'admin',
    firstName: 'John',
    lastName: 'Doe',
    img_url: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    type: 'student'
  },

]
const comments = [
  {
    user: "qdo93",
    userType: "student",
    type: "regular",
    comment: "I second adding more sections of CS1550",
    img_url: 'http://niksingh.net/img/neel.jpg',
    date: new Date(Date.now() - 60020000),
  }
]

  var pt_added = 0;
  for(p in pittitions) {
    var pt = new Pittition(pittitions[p]);
    
    for(i in comments)
      comments[i].pittitionId = pt._id
      pt.save(function (err) {
        if(++pt_added == pittitions.length - 1)   process.exit(0);
      });
  }

  var r_added = 0;
  for(r in resources) {
    var resource = new Resource(resources[r]);
    console.log(resource)
    resource.save(function (err) {
      console.log("saved")
      if(++r_added == resources.length - 1)   process.exit(0);
    });
  }

  var u_added = 0;
  for(u in users) {
    var us = new User(users[u]);
    us.save(function (err) {
      if(++u_added == users.length - 1)   process.exit(0);
    });
  }

  var c_added = 0;
  for(c in comments) {
    var comment = new Comment(comments[c]);
    comment.save(function (err) {
      if(++c_added == comments.length - 1)   process.exit(0);
    });
  }
  
