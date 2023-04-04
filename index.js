const express = require("express");
const app = express();
const port = 3000;
var fs = require("fs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  fs.readFile("data.json", "utf-8", (err, string) => {
    if (err) {
      console.log(err);
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(string);
  });
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
    assignee_id: aid
  }

  const fileData = JSON.parse(fs.readFileSync("data.json"));
  fileData.push(data);
  fs.writeFile("data.json", JSON.stringify(fileData, null, 2), (err) => {
    if (err) {
      console.log(err);
    }
    else {
      const message = "Data submitted successfully."
      res.send({
        'id': id,
        'created_at': ctime,
        'updated_at': utime,
        'type': type,
        'subject': subject,
        'description': description,
        'priority': priority,
        'status': status,
        'recipient': recipient,
        'submitter': submitter,
        'assignee_id': aid
      });
    }
  })
});

app.get("/rest/ticket/:id", function (req, res) {
  fs.readFile("data.json", "utf-8", (err, string) => {
    if (err) {
      console.log(err);
      return;
    }
    var data = JSON.parse(string.toString());
    var result = data.filter(function (item) {
      return item.id == req.params.id;
    });
    const final = JSON.stringify(result, null, 2);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(final);
  });
});

