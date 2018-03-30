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

function appendArray(size) {
  const array = [];
  for(var i = 0; i < size; i++) array.push('');
  return array;
}
// Compile model from schema
var Pittition = mongoose.model('PittitionModel', PittitionSchema);
var User = mongoose.model('UserModel', UserSchema);
var Comment = mongoose.model('CommentModel', CommentSchema);
const largeArray = []
const mediumArray = []

for(var i = 0; i < 51; i++) mediumArray.push('');
for(var i = 0; i < 51; i++) mediumArray.push('');
for(var i = 0; i < 142; i++) largeArray.push(['']);

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
  },
  {
    title: "Gym on Lower Campus!",
    description: "Both the Pete and Trees gyms are on upper campus and there should be a gym built somewhere on lower campus.",
    author: "bau75",
    img_url: 'http://niksingh.net/img/shridhar.jpg',
    date: Date.now(),
    status: 'waiting',
    updates: [],
    likes: ["nis80", "chz75"].concat(appendArray(15)),
    followers: ['demo', 'nis80'],
    shares: 0
  },
  {
    title: "Another 10A Bus",
    description: "The 10A bus doesn't run as frequently as it could, and I find I am often waiting a long time for it",
    author: "mam42",
    img_url: 'http://niksingh.net/img/matt.jpg',
    date: Date.now(),
    status: 'waiting',
    updates: [],
    likes: ["nis80", "chz75"].concat(appendArray(8)),
    comments: [{
      date: Date.now() + 1000,
      user: "chz75",
      comment: "I don't know, I think it runs often enough"
    }],
    followers: ['chz75', 'nis80'],
    shares: 0
  },
  {
    title: "Lower Tuition Costs!",
    description: "Students coming out of Pitt have way too much debt, and as such I believe that tuition costs should be lowered.",
    author: "ajs123",
    img_url: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    date: new Date(Date.now() - 5827392),
    status: 'waiting',
    updates: [],
    comments: [{
      date: Date.now(),
      user: 'jhd31',
      comment: 'Unfortunately, Pitt would need to cut costs in other areas in order to lower the cost of tuition'
    },
    {
      date: Date.now() + 10000,
      user: 'chz75',
      comment: 'At the very least, they could lower the costs of food in on campus convenient stores. Everything is double the cost of an off campus convenient store.'
    }],
    likes: [],
    followers: ['demo', 'nis80'],
    shares: 0
  },
  {
    title: "Add more CS sections",
    description: "There is a wide variety of courses to take at Pitt, but I am unable to sign up for any because they fill up so fast. This is especially true for core classes such as CS1550",
    img_url: 'http://niksingh.net/img/shridhar2.jpg',
    solution: "Add more courses for CS 1600+",
    author: "qjs49",
    date: new Date(Date.now() - 201202030),
    status: 'In Process',
    likes: ["nis80", "chz75"].concat(appendArray(52)),
    updates: [{
      stateBefore: 'waiting',
      stateAfter: 'In Process',
      user: 'Pitt Admin',
      date: new Date(Date.now() - 50120203),
      img_url: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
      comment: 'Thank you for bringing this issue to our attention. We are currently looking to open up more sections!'
    }],
    followers: [],
    shares: 0
  },

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
    type: 'admin'
  },
  {
    userName: 'nis80',
    password: 'nis80',
    firstName: 'Nikhilesh',
    lastName: 'Singh',
    img_url: 'http://niksingh.net/img/pic.jpg',
    type: 'student'
  },
  {
    userName: 'abc123',
    password: 'password',
    firstName: 'John',
    lastName: 'Doe',
    img_url: 'http://niksingh.net/img/pic.jpg',
    type: 'student'
  }

]
const comments = [
  {
    user: "qdo93",
    userType: "student",
    type: "regular",
    comment: "I second adding more sections of CS1550",
    img_url: 'http://niksingh.net/img/neel.jpg',
    date: new Date(Date.now() - 60020000),
  },
  {
    user: "jhd71",
    userType: "student",
    type: "regular",
    comment: "I agree!",
    img_url: 'http://niksingh.net/img/matt.jpg',
    date: new Date(Date.now() - 48049200),
  },
  {
    user: "tsi74",
    userType: "student",
    type: "regular",
    comment: "I was only able to sign up for a single CS course because everything else was full",
    img_url: 'http://niksingh.net/img/neel2.jpg',
    date: new Date(Date.now() - 190212002),
  },
  {
    user: "bau75",
    userType: "student",
    type: "regular",
    comment: "Yes please!",
    img_url: 'http://niksingh.net/img/shridhar.jpg',
    date: new Date(Date.now() - 19020202),
  },
  {
    user: "cis29",
    userType: "student",
    type: "regular",
    comment: "Just signed!",
    img_url: 'http://niksingh.net/img/matt2.jpg',
    date: new Date(Date.now() - 1902002),
  },
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
    console.log(comment)
    comment.save(function (err) {
      if(++c_added == comments.length - 1)   process.exit(0);
    });
  }
  
