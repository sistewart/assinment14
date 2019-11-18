const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const players = require('./players');

//allows us to access js/css/images if in an public directory

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

app.post('/api/players', (req,res) => {
    const schema = {
        name: Joi.string().required(),
        hometown: Joi.string().required(),
        age:Joi.required(),
        current:Joi.string().required(),
        years:Joi.required()
    }

    const result = Joi.validate(req.body, schema);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
    }
    
    const players = {
        id:players.length + 1,
        name:req.body.name,
        hometown: req.body.hometown,
        age: req.body.age,
        current: req.body.current,
        years:req.body.years,
    }
    players.push(player);
    res.send(player);
})
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`listening on port ${port}...`);
});