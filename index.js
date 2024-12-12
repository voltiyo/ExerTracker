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
        if (req.body.date === ""){
            dateinput = new Date().toDateString()
        } else{
            if (req.body.date.includes(" ")){
                dateinput = new Date(req.body.date.replace(" ", "-").replace(" ", "-")).toDateString()
            } else{
                dateinput = new Date(req.body.date)
            }
        }
        data = {username: username, description: req.body.description, duration: parseInt(req.body.duration), date: dateinput, _id : id}
    
        exercices.push(data)
        res.json(data)
    } else{
        res.send({"error" : "user not found !"})
    }
})
app.get("/api/users/:_id/logs/:limit?/:from?/:to?", (req,res) => {
    let id = req.params._id;
    let limit = req.query.limit;
    let from
    let to
    if (req.query.from !== undefined){
        from = new Date(req.query.from);
    } 
    if (req.query.to !== undefined){
        to = new Date(req.query.to);
    }
    let log = []
    let username;
    if (limit !== undefined && from !== undefined && to !== undefined){
        for (let i = 0; i < limit; i++){
            if (exercices[i]._id === id){
                username = exercices[i].username
                let date = new Date(exercices[i].date)
                let data;
                if (from <= date <= to){
                    data = {
                        description: exercices[i].description,
                        duration: exercices[i].duration,
                        date: date.toDateString(),
                    }
                    log.push(data)
                }
            }
        }
    
    }
    if (from !== undefined && to !== undefined){
        for (let i = 0; i < exercices.length; i++){
            if (exercices[i]._id === id){
                username = exercices[i].username
                let date = new Date(exercices[i].date)
                let data;
                if (from <= date && date <= to){
                    data = {
                        description: exercices[i].description,
                        duration: exercices[i].duration,
                        date: date.toDateString(),
                    }
                    log.push(data)
                }
            }
        }
    
    }
    else if (limit !== undefined && from !== undefined){
        for (let i = 0; i < limit; i++){
            if (exercices[i]._id === id){
                username = exercices[i].username
                let date = new Date(exercices[i].date)
                let data;
                if (from <= date){
                    data = {
                        description: exercices[i].description,
                        duration: exercices[i].duration,
                        date: date.toDateString(),
                    }
                    log.push(data)
                }
            }
        }
    }
    else if (limit !== undefined && to !== undefined){
        for (let i = 0; i < limit; i++){
            if (exercices[i]._id === id){
                username = exercices[i].username
                let date = new Date(exercices[i].date)
                let data;
                if (date <= to){
                    data = {
                        description: exercices[i].description,
                        duration: exercices[i].duration,
                        date: date.toDateString(),
                    }
                    log.push(data)
                }
            }
        }
    }
    else if (limit !== undefined){
        for (let i = 0; i < limit; i++){
            if (exercices[i]._id === id){
                username = exercices[i].username
                let date = new Date(exercices[i].date)
                let data;
                data = {
                    description: exercices[i].description,
                    duration: exercices[i].duration,
                    date: date.toDateString(),
                }
                log.push(data)
                
            }
        }
    }
    else if (from !== undefined){
        for (let i = 0; i < exercices.length; i++){
            if (exercices[i]._id === id){
                username = exercices[i].username
                let date = new Date(exercices[i].date)
                let data;
                if (from <= date){
                    data = {
                        description: exercices[i].description,
                        duration: exercices[i].duration,
                        date: date.toDateString(),
                    }
                    log.push(data)
                }
            }
        }
    }
    else if (to !== undefined){
        for (let i = 0; i < exercices.length; i++){
            if (exercices[i]._id === id){
                username = exercices[i].username
                let date = new Date(exercices[i].date)
                let data;
                if (date <= to){
                    data = {
                        description: exercices[i].description,
                        duration: exercices[i].duration,
                        date: date.toDateString()   ,
                    }
                    log.push(data)
                }
            }
        }
    }
    else{
        exercices.forEach(exercice => {
            if (exercice._id === id){
                username = exercice.username
                let data = {
                    description: exercice.description,
                    duration: exercice.duration,
                    date: exercice.date
                }
                log.push(data)
            }
        })
        
    }
    if (username !== undefined){
        res.send({username: username,count:log.length, _id: id, log: log})
    } else{
        res.send({"error": "user not found"})
    }
})

app.listen(3000)