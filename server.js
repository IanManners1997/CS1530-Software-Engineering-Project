const express     = require('express');
const path        = require('path');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const timeout     = require('connect-timeout');

const app         = express();
var IP            = null;

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

var Schema = mongoose.Schema;
var PittitionSchema = new Schema({
    title: String,
    description: String,
    author: String,
    img_url: String,
    date: Date,
    status: String,
    likes: [String],
    followers: [String],
    updates: [{
      user: String,
      img_url: String,
      stateBefore: String,
      stateAfter: String,
      comment: String,
      date: Date,
    }],
    shares: Number
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

var ResourceSchema = new Schema({
  resourceId: String,
  name: String,
  available: Boolean,
  reservedBy: String
})

// Compile model from schema
var Pittition = mongoose.model('PittitionModel', PittitionSchema);
var Resource = mongoose.model('ResourceModel', ResourceSchema);
var User = mongoose.model('UserModel', UserSchema);
var Comment = mongoose.model('CommentModel', CommentSchema);

// TODO: Placeholder until we have access to allow students to login with their pitt info
var cachedUsername = "jhd31";


var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(timeout(10000));


require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+ add);
  IP = add
})

app.get('/', (req, res) => {
  console.log("Called!")
})

app.get('/Resource', (req, res) => {
  Resource.find().exec((error, resources) => {
    if(error) console.log(error);
    console.log(resources)
    res.send(resources)
  })
  
})
// TODO: Parameters that indicate specific limit, latest date, still open, 
// TODO: Refactor this
app.get('/Pittition', (req, res) => {
  const pts = [];
  var requests = 0;
  Pittition.find().limit(10).sort({ date: -1 }).exec( (error, pittitions) => {

    for(var i in pittitions) {
      const id = pittitions[i].id
      try {
        pittitions[i] = pittitions[i].toObject();
        pittitions[i].comments = [];
      }catch(error) {console.log(error)}
     

      Comment.find({ pittitionId: id }).exec((error, comments) => {
        if(error) console.log(error);

        // Hacky solution to fix bug
        var comment_pt_id = comments[0] !== undefined ? comments[0].pittitionId : null;
        if(comment_pt_id !== null) {
          for(var j in pittitions) {
            if(String(pittitions[j]._id) === String(comment_pt_id)) {
                pittitions[j].comments = comments;
                break;
            }
          }
        }
        

        if(++requests >= pittitions.length) {

          pittitions[i].comments = pittitions[i].comments.sort(function(commentA, commentB) {

            const timeA = parseInt(new Date(commentA.date).getTime());
            const timeB = parseInt(new Date(commentB.date).getTime());

            return timeB - timeA;
          });

          res.send(pittitions);
        }
      })
    }  
  });
});

// All of the pittition schema/model information should be in the post body
app.post('/Pittition', (req, res) => {
  console.log("HERE")
  var pt = new Pittition({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    img_url: req.body.img_url,
    date: req.body.date,
    open: true,
    likes: [],
    comments: [{ }],
    shares: 0
  });
  pt.save(function (err) {
    if (err) res.send("Error");
    res.send("Saved pittition");
  });
});

app.delete('/Pittition/:pittitionId', (req, res) => {
  try {
    Pittition.deleteOne( { "_id" : req.params.pittitionId } )
    .exec((error, result) => {
      if(error)   res.send(error);
      else        res.send(result);
    });
  } catch (e) {
   res.send(e)
  }
});

app.post('/comment/:pittitionId', (req, res) => {
  const newComment = new Comment({ user: req.body.user, img_url: req.body.img_url, comment: req.body.comment, userType: req.body.userType, type: req.body.type, pittitionId: req.body.pittitionId, date: Date.now() });
  newComment.save(function (err) {
    if (err) res.send("Error");
    res.send("Saved comment");
  });
});

app.post('/like/:pittitionId', (req, res) => {
  Pittition.update(
    { _id: req.params.pittitionId },
    { $set: { likes: req.body.likes } }
  ).exec( (error, result) => {
      if(error)   res.send(error);
      else        res.send(result);
  });
  
});

app.post('/status/:pittitionId', (req, res) => {
  Pittition.update(
    { _id: req.params.pittitionId },
    { $set: { 
        status: req.body.status,
        updates: req.body.updates

      },
    }
  ).exec( (error, result) => {
      if(error)   res.send(error);
      else        res.send(result);
  });
});

app.put('/follow/:pittitionId', (req, res) => {
  Pittition.update(
    { _id: req.params.pittitionId },
    { $set: { followers: req.body.followers } }
  ).exec( (error, result) => {
      if(error)   res.send(error);
      else        res.send(result);
  });
});

app.post('/login', (req, res) => {
  console.log("HEjljkzhcvkjhxcvkjhjxckxRE");
  // TODO find how to use similar to where once I have access to internet
  User.find().limit(10).sort({ date: -1 }).exec( (error, users) => {
    var user =  "error"
    console.log("PRINTING USERS")
    console.log(users)
    for(i in users) {
      if(verify(users[i].userName, req.body.userName) && verify(users[i].password, req.body.password)) {
        user = users[i];
        break;
      }
    }
    console.log("USER IS " + JSON.stringify(user))
    res.send(user)
  });
});


app.use(function (req, res, next) {
  res.status(404).send("404 Page Not Found");
});

const server = app.listen(process.env.PORT || 3000, "172.20.10.3", () => {
  const { address, port } = server.address();
  console.log(server.address().address)
  console.log(IP)
  console.log(`Listening at http://${address}:${port}`);
});

// TODO: put in seperate file
function verify(observed, expected) {
  return observed === expected;
}