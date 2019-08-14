const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

//alows cross origin request
app.use(cors());

const URI = 'mongodb+srv://norbis:test123@cluster0-cedhx.mongodb.net/test?retryWrites=true&w=majority'; //Cloud MongoDB
//const URI = 'mongodb://localhost:27017/test'; // Local MongoDB
const OPTS = { useNewUrlParser: true };
mongoose.connect(URI, OPTS, function(err) {
  if (err) { return console.error('Conection to DB failed');}
}); 
mongoose.connection.once('open', () => {
console.log('conected to database OK');
});

// mongoose.connect('', { useNewUrlParser: true });
// mongoose.connection.once('open', () => {
//     console.log('conected to database ON');
// });

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(4000, ()=> {
  console.log("Listening request on port 4000");
});
