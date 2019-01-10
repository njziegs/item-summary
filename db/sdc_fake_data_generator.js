var fs = require('fs');
var path = require('path');
var os = require('os');
var faker = require('faker');
var copyFrom = require('pg-copy-streams').from;


 const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/avademartini';

// const client = new pg.Client(connectionString);
// client.connect();
// const query = client.query(
//   'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', () => { client.end(); });

const { Pool, Client } = require('pg')

// pools will use environment variables
// for connection information
const pool = new Pool()

// pool.query('SELECT * from items', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

pool.connect(function(err, client, done) {
  var stream = client.query(copyFrom('COPY products (product_title, vendor_name, review_average, review_count, answered_questions, list_price, discount, price, prime, description) FROM STDIN CSV'));
  var fileStream = fs.createReadStream('products1.csv');
  fileStream.on('error', (error) => console.log("Error reading file", error));
  stream.on('error', (error) => console.log("Error in copy command", error));
  stream.on('end', () => console.log("Completed loading table"));
  fileStream.pipe(stream);
})

// pool.connect(function(err, client, done) {
//   var stream = client.query("COPY products FROM '/Users/avademartini/Desktop/MASTER/SDC/summary-nick/db/products1.csv' WITH (FORMAT csv)", (err, res) => {
//     console.log(err, res)
//     pool.end()
//   })
// })

// pool shutdown
pool.end()


// output file in the same folder
var filename = path.join(__dirname, 'products1.csv');
var output = []; // holds all rows of data

let discount;
var discountGenerator = (stringPrice) => {
  let price = Number(stringPrice.slice(1));
  var randomNum = Math.floor(Math.random() * 10) + 1;
  var potentialDiscounts = [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7];
  var randomIndex = Math.floor(Math.random() * 8);

  if (randomNum <= 7) {
    discount = potentialDiscounts[randomIndex];
    var dollarsOff = price * discount;
    price -= dollarsOff;
    discount = ((discount * 100).toString() + '%');
    return ('$' + price.toFixed(2).toString());
  }
  return stringPrice;
};

var reviewAverageGenerator = () => {
  var possibleScores = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  var randomScore = Math.floor(Math.random() * 9);
  var result = possibleScores[randomScore];
  return result;
};


//  generate a stringified object of a random number of loremIpsum paragraphs
var descriptionGenerator = () => {
  var randomNum = Math.floor(Math.random() * 8) + 1;
  return [faker.lorem.paragraph()];
};




for (var i = 1; i < 100000; i++) {
  discount = null;
  var productTitle = `"${faker.commerce.productName()}, ${faker.lorem.sentence().slice(0, -1)}"`;
  var vendorName = `"${faker.company.companyName()}"`;
  var reviewAverage = `${reviewAverageGenerator()}`;
  var reviewCount = `${Math.round((Math.random() * 3000))}`;
  var answeredQuestions = `${Math.round((Math.random() * 49) + 1)}`;
  var listPrice = `${faker.commerce.price(15.00, 5000, 2, '$')}`;
  var price = `${discountGenerator(listPrice)}`;
  var prime = `${Math.round(Math.random())}`;
  var description = `"${descriptionGenerator()}"`;

  //  build an array record to pass into the db.saveProductRecord function
  var record = [productTitle, vendorName, reviewAverage, reviewCount,
    answeredQuestions, listPrice, discount, price, prime, description];

  output.push(record.join());
}

 //  fs.writeFileSync(filename, output.join(os.EOL));







