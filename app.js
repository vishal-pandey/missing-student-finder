const express = require('express')
const app = express()
const port = 3000
const path = require('path');
var cors = require('cors')

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(cors())



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})


app.post('/', (req, res) => {
  let t_count = req.body.total;
  let total_student_list = req.body.total_student_list;
  let queue_student_list = req.body.queue_student_list;
  
  result = findMissingStudent(t_count, total_student_list, queue_student_list)

  res.send(result)
})


function findMissingStudent(t_count, total_list, queue_list) {

  let t_list = total_list
  let q_list = queue_list

  // Converting to Set for faster search
  let q_list_set = new Set(q_list)

  // Filtering out all the elements common in both array
  let differenece = t_list.filter(x => !q_list_set.has(x))

  return {
    "total_count": t_count,
    "missing_count": differenece.length,
    "missing_student_list": differenece
  }
}



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})