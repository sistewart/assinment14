const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const players = require('./players')


app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get('/api/players',(req,res)=>{
    res.send(players);
});

app.get('/players/:id', (req, res)=>{
    const requestedID = parseInt(req.params.id);
    const player = players.find(p => p.id === requestedID);
    if(!player){
        res.status(404).send(`Yeah, there isn't a player with ID: ${requestedID} in this group.`);
        return;
    }
    res.send(player);

});

function validPlayer(player){
    const schema = {
        name:Joi.string().min(3).required(),
        hometown:Joi.string().min(4).required(),
        age:Joi.string().required(),
        current:Joi.string().min(3).required(),
        years:Joi.string().required()
    }

    return Joi.validate(player, schema);
}

app.post('/api/songs', (req,res)=>{
    const result = validPlayer(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
    }

    const player = {
        id:players.length + 1,
        name : req.body.name,
        hometown : req.body.hometown,
        age : req.body.age,
        current : req.body.current,
        years : req.body.years

    }
    console.log("name is: " + req.body.name);
    songs.push(player);
    res.send(player);
});

app.put('/api/players/:id', (req,res)=>{
    const requestedID = parseInt(req.params.id);
    const player = players.find(p =>p.id === requestedID);

    if(!player) {
        res.status(404).send(`Yeah, the player with ${requestedID} does not exist`);
        return;
    }

    const result = validPlayer(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    player.name = req.body.name;
    player.hometown = req.body.hometown;
    player.age = req.body.age;
    player.current = req.body.current;
    player.years = req.body.years;


    res.send(player);

});

app.delete('/api/players/:id',(req,res)=>{
    const requestedID = parseInt(req.params.id);
    const player = players.find(p =>p.id === requestedID);

    if(!player) {
        res.status(404).send(`The player with ${requestedID} was never in my list.`);
        return;
    }

    let index = players.indexOf(player);
    players.splice(index,1);
    res.send(player);
});


//listen
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});