const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const port = 3000;
var fs = require("fs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri =
  "mongodb+srv://classuser:Silvery1@415test.80wtryo.mongodb.net/?retryWrites=true&w=majority";

const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

var router = express.Router();

var seedData = [
  {
    id: 35436,
    created_at: "2015-07-20T22:55:29Z",
    updated_at: "2016-05-05T10:38:52Z",
    type: "incident",
    subject: "MFP not working right",
    description: "PC Load Letter? What does that even mean???",
    priority: "med",
    status: "open",
    recipient: "support_example@selu.edu",
    submitter: "Michael_bolton@selu.edu",
    assignee_id: 235323,
    follower_ids: [235323, 234],
    tags: ["enterprise", "printers"],
  },
  {
    id: 8675309,
    created_at: "2015-01-20T22:55:29Z",
    updated_at: "2016-11-05T10:38:52Z",
    type: "accident",
    subject: "somebody shocked themselves",
    description: "tried to unplug pc, got shocked",
    priority: "high",
    status: "open",
    recipient: "support_example@selu.edu",
    submitter: "Michael_Scott@selu.edu",
    assignee_id: 321321,
    follower_ids: [321321, 234],
    tags: ["injury", "electrical"],
  },
];

fs.writeFile("data.json", JSON.stringify(seedData, null, 2), (err) => {
  if (err) {
    console.log(err);
  }
});

app.get("/", function (req, res) {
  var outstring = "Starting... ";
  res.send(outstring);
});

app.get("/rest/list", function (req, res) {
  // fs.readFile("data.json", "utf-8", (err, string) => {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "application/json");
  //   res.end(string);
  // });

  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("415Test");
      const item = database.collection("cmps415");

      const list = await item.find({}, { projection: { _id: 0 } }).toArray();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(list, null, 2));
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.post("/rest/ticket", function (req, res) {
  const id = req.body.id;
  const ctime = Date.now();
  const utime = Date.now();
  const type = req.body.type;
  const subject = req.body.subject;
  const description = req.body.description;
  const priority = req.body.priority;
  const status = req.body.status;
  const recipient = req.body.recipient;
  const submitter = req.body.submitter;
  const aid = req.body.assignee_id;
  const follower_ids = req.body.follower_ids;
  const tags = req.body.tags;

  var data = {
    id: id,
    created_at: ctime,
    updated_at: utime,
    type: type,
    subject: subject,
    description: description,
    priority: priority,
    status: status,
    recipient: recipient,
    submitter: submitter,
    assignee_id: aid,
    follower_ids: follower_ids,
    tags: tags,
  };

  // const fileData = JSON.parse(fs.readFileSync("data.json"));
  // fileData.push(data);
  // fs.writeFile("data.json", JSON.stringify(fileData, null, 2), (err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     const message = "Data submitted successfully."
  //     res.send({
  //       'id': id,
  //       'created_at': ctime,
  //       'updated_at': utime,
  //       'type': type,
  //       'subject': subject,
  //       'description': description,
  //       'priority': priority,
  //       'status': status,
  //       'recipient': recipient,
  //       'submitter': submitter,
  //       'assignee_id': aid
  //     });
  //   }
  // })
  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("415Test");
      const item = database.collection("cmps415");
      await item.insertOne(data, function (err, resp) {
        if (err) {
          console.log(err);
          return;
        }
      });
      res.send(JSON.stringify(data, null, 2));
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.get("/rest/ticket/:id", function (req, res) {
  // fs.readFile("data.json", "utf-8", (err, string) => {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   var data = JSON.parse(string.toString());
  //   var result = data.filter(function (item) {
  //     return item.id == req.params.id;
  //   });
  //   const final = JSON.stringify(result, null, 2);
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "application/json");
  //   res.end(final);
  // });

  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("415Test");
      const item = database.collection("cmps415");
      const query = { id: req.params.id };
      const list = await item.findOne(query, { projection: { _id: 0 } });
      if (!list) {
        res.send("That id number is not in the system.");
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(list, null, 2));
      }
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.delete("/rest/ticket/:id", function (req, res) {
  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("415Test");
      const item = database.collection("cmps415");
      const query = { id: req.params.id };
      const result = await item.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send("Document deleted successfully.");
      } else {
        res.send("No documents with that id number exist in the database.");
      }
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

app.put("/rest/ticket/:id", function (req, res) {
  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("415Test");
      const item = database.collection("cmps415");
      const query = { id: req.params.id };
      const result = await item.findOne(query);
      if (!result) {
        res.send("No items match that id number.");
      } else {
        const id = req.body.id;
        const ctime = Date.now();
        const utime = Date.now();
        const type = req.body.type;
        const subject = req.body.subject;
        const description = req.body.description;
        const priority = req.body.priority;
        const status = req.body.status;
        const recipient = req.body.recipient;
        const submitter = req.body.submitter;
        const aid = req.body.assignee_id;
        const follower_ids = req.body.follower_ids;
        const tags = req.body.tags;

        var updated = {
          $set: {
          id: id,
          created_at: ctime,
          updated_at: utime,
          type: type,
          subject: subject,
          description: description,
          priority: priority,
          status: status,
          recipient: recipient,
          submitter: submitter,
          assignee_id: aid,
          follower_ids: follower_ids,
          tags: tags,
        }};

        await item.updateOne(query, updated);
        res.send(JSON.stringify(updated, null, 2));
      }
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});
