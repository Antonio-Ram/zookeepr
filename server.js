//route to front-end
const{ animals } = require('./data/animals')

//to be considered a server, a machine needs to provide some functionality
// we want that functionality to be accepting a request and sending back a resonse
const express = require('express');

//initiate server
const app = express();

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

//add route
app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//makes express listen
app.listen(3001, () => {
    console.log(`API server now on port 3001`);
});
