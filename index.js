const express = require("express")
const cors = require("cors")
const path = require("path")
const { count } = require("console")


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


function makeid(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

let users = []
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,"public", 'index.html'))
})
app.post("/api/users", (req,res) => {
    let user = req.body.username;
    let id = makeid(24)
    let data = {username: user, _id: id}

    users.push(data)
    res.send(data)
})
app.get("/api/users", (req, res) => {
    res.json(users)
})

let exercices = [] 

app.post("/api/users/:_id/exercises", (req,res) => {
    let id = req.params._id;
    let username
    users.forEach(user => {
        if (user._id === id){
            username =  user.username
        }
    })
    if (username !== undefined){
        let data;
        let dateinput;
        let datein = req.body.date
        if (req.body.date === "" || req.body.date === undefined){
            dateinput = new Date().toDateString()
        } else{
            while (datein.includes(" ")){
                datein = datein.replace(" ", "-")
            }
            dateinput = new Date(datein).toDateString()
            
        }
        data = {username: username, description: req.body.description, duration: parseInt(req.body.duration), date: dateinput, _id : id}
    
        exercices.push(data)
        res.json(data)
    } else{
        res.send({"error" : "user not found !"})
    }
})
app.get("/api/users/:_id/logs", (req, res) => {
    const id = req.params._id;
    const { from, to, limit } = req.query;

    const fromDate = from ? new Date(from).getTime() : null;
    const toDate = to ? new Date(to).getTime() : null;
    const limitNum = limit ? parseInt(limit) : null;

    // Assuming `exercices` is an array of exercise objects.
    const userLogs = exercices.filter(exercise => exercise._id === id);

    if (userLogs.length === 0) {
        return res.status(404).send({ error: "User not found" });
    }

    // Apply filters
    let filteredLogs = userLogs.filter(exercise => {
        const exerciseDate = new Date(exercise.date).getTime();
        if (fromDate && exerciseDate < fromDate) return false;
        if (toDate && exerciseDate > toDate) return false;
        return true;
    });

    // Apply limit
    if (limitNum) {
        filteredLogs = filteredLogs.slice(0, limitNum);
    }

    // Format the response
    const responseLogs = filteredLogs.map(log => ({
        description: log.description,
        duration: log.duration,
        date: log.date,
    }));

    const username = userLogs[0].username;

    res.send({
        username,
        count: responseLogs.length,
        _id: id,
        log: responseLogs,
    });
});


app.listen(3000)