const fs = require('fs');
const path = require('path');

//route to front-end
const{ animals } = require('./data/animals')

//to be considered a server, a machine needs to provide some functionality
// we want that functionality to be accepting a request and sending back a resonse
const express = require('express');

//add the port
const PORT = process.env.PORT || 3001;
//initiate server
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

//filter functionality
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    //Note that we save the animalsArray as a filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        //save personalityTraits as a dedicated array.
        // if personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        }else {
            personalityTraitsArray = query.personalityTraits;
        }
        //Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            /* Check the trait against each animal in the filteredResults array.
            Remember, it is initially a copy of the animalsArray,
            but here we're updating it for each trait in the .forEach() loop.
            for each trait being targeted by the filter, the filteredResults
            array will then contain only the entries that contain  the trait,
            so at the end we'll have an array of animals that have every one 
            of the traits when the .forEach() loop is finished.*/
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

//takes the id and array of animals and returns a single animal
//handles GET route
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

//handles POST route
function createNewAnimal(body, animalsArray) {
    /* code to make sure funtion works
    console.log(body);
    //our function's main code will go here!

    //return finished code to post route for response
    return body;*/
    
    //code that adds animal to animals.json
    const animal = body;
    animalsArray.push(animal);
fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
);
    return animal;
}

//Validation function 
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !=='string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string'){
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}
//add route
app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//route for ID
//param route has to go after the GET route
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
    res.json(result);
    } else {
        res.send(404);
    }
});

//populate server with data
app.post('/api/animals', (req, res) => {
  /*  //req.body is where our incoming content will be
    console.log(req.body);*/
    
    //set id based on what the index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    }   else {
        //add animal constant to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

//makes express listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

