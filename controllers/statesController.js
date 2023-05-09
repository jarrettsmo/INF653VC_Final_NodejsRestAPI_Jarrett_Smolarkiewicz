// Initialize variable "data" for data within the "statesData.json" file.
const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
}
// Initialize variable "State" for the MongoDB Schema.
const State = require('../model/State');

// Initialize variable to identify Alaska "AK" and Hawaii "HI" as non-contiguous states.
const nonContig = ['AK', 'HI'];

// Setup getAllSates route to return all states
const getAllStates = async (req, res) => {
    const funfacts = await State.find();
    const contig = req.query.contig;
    let filteredStates = data.states;
    // Account for when GET request returns all states where "/states/?contig=true" (other 48 states).
    if (contig === 'true') {
      filteredStates = data.states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    // Account for when GET request returns all states where "/states/?contig=false" (Alaska and Hawaii only).
    } else if (contig === 'false') {
      filteredStates = data.states.filter(state => state.code === 'AK' || state.code === 'HI');
    }
    
    const result = filteredStates.map(item1 => {
        const match = funfacts.find(item2 => item2.stateCode.toUpperCase() === item1.code.toUpperCase());
        if(match) {
            console.log(match)
            return {...item1, funfacts: match.funfacts}
        } else {
            return {...item1}
        }
      });
    res.json(result);
};

// Setup createNewState to add new state to MongoDB database.
const createNewState = async (req, res, next) => {
  try {
        const state = new State(req.body);
        const newState = await state.save();
        res.status(201).json({ success: true, data: newState });
    } catch (error) {
        next(error);
    }
};

// Setup updateState to update data for an existing state in the MongoDB database.
const updateState = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Locate the state to be updated by it's "id"
        const state = await State.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!state) {
            res.status(404);
            throw new Error(`State with id ${id} not found`);
        }
        res.status(200).json({ success: true, data: state });
    } catch (error) {
        next(error);
    }
};

// Setup deleteState to remove an existing state from the MongoDB database.
const deleteState = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Locate the state to be deleted by it's "id"
        const state = await State.findByIdAndDelete(id);
        if (!state) {
        res.status(404);
        throw new Error(`State with id ${id} not found`);
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// Setup getState to return a single existing state from the MongoDB database.
const getState = async (req, res) => {
    const funfacts = await State.find();
    console.log(funfacts)
    const result = data.states.map(item1 => {
        // Locate the state by it's "stateCode" or "code" property.
        const match = funfacts.find(item2 => item2.stateCode === item1.code);
        if(match) {
            return {...item1, funfacts: match.funfacts}
        } else {
            return {...item1}
        }
      });

    // Ensure URL request for stateCode / code is case insensitive.
    const state = result.find(state => state.code.toUpperCase() === req.params.code.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }
    
    res.json(state);
};

// Setup getFunfact to return funfacts about an existing state (if they have been added) from the MongoDB database.
const getFunfact = async (req, res) => {
    try {
        const state = await State.findOne({stateCode: req.params.code})
        const stateData = data.states.find(state => state.code === req.params.code)
        if(!stateData) {
          return res.status(400).json({ "message": `Invalid state abbreviation parameter` }); 
        }
        if (state === null || state?.funfacts?.length === 0) {
            return res.status(404).json({ "message": `No Fun Facts found for ${stateData.state}` });
        }
        const randomIndex = Math.floor(Math.random() * state.funfacts.length);
        res.json({funfact: state.funfacts[randomIndex]});
    } catch(err ) {
        console.log(err)
    }
};

// Setup createFunfact to add new funfacts about an existing state to the MongoDB database.
const createFunfact = async (req, res) => {
    try {
        if(!req.body.funfacts) {
          return res.status(404).json({"message": `State fun facts value required`});
        } else if (!Array.isArray(req.body.funfacts)) {
          return res.status(404).json({"message": `State fun facts value must be an array`})
        }
        State.findOneAndUpdate({ stateCode: req.params.code }, { $push: {funfacts: req.body.funfacts} }, { upsert: true, new: true })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(404).json({ "message": `No State found` });
        })
    } catch(err ) {
        console.log(err)
    }
}

// Setup patchFunfact to return a single random funfact (if any funfacts have been added) about an existing state to the MongoDB database.
const patchFunfact = async (req, res) => {
    const code = req.params.code;
    const index = req.body.index;
    const funfact = req.body.funfact;
    
    if (!index) {
        return res.status(400).json({"message": 'State fun fact index value required'});
    }
    if(!funfact || funfact.length === 0) {
      return res.status(400).json({"message": "State fun fact value required"});
    }

    // Adjust index for zero-based array
    const adjustedIndex = index - 1;

    const filter = { stateCode: code };
    const update = { $set: { [`funfacts.${adjustedIndex}`]: funfact } };
    const stateData = data.states.find(state => state.code === code);
    const state = await State.findOne({stateCode: code})
    
    if(!state?.funfacts || state?.funfacts?.length === 0) {
      return res.status(404).json({"message": `No Fun Facts found for ${stateData?.state}`});
    }
  
    if(index > state?.funfacts?.length) {
      return res.status(404).json({"message": `No Fun Fact found at that index for ${stateData?.state}`})
    }
    
    State.updateOne(filter, update)
        .then((result) => {
        res.json(result)
        })
        .catch((err) => {
        console.error(err);
        res.status(500).send('Internal server error.');
    });
}

// Setup deleteFunfact to remove a single funfact (if any funfacts have been added) from an existing state to the MongoDB database.
const deleteFunfact = async (req,res) => {
    const code = req.params.code;
    const index = req.body.index;

    if (!index) {
        return res.status(400).json({"message": 'State fun fact index value required'});
    }

    // Adjust index for zero-based array
    const adjustedIndex = index - 1;

    const filter = { stateCode: code };
    const update = { $unset: { [`funfacts.${adjustedIndex}`]: 1 } };
    const remove = { $pull: { funfacts: { $eq: null } }};
  
    const stateData = data.states.find(state => state.code === code);
    const state = await State.findOne({stateCode: code})
    
    if(!state?.funfacts || state?.funfacts?.length === 0) {
      return res.status(404).json({"message": `No Fun Facts found for ${stateData?.state}`});
    }
  
    if(index > state?.funfacts?.length) {
      return res.status(404).json({"message": `No Fun Fact found at that index for ${stateData?.state}`})
    }

    await State.updateOne(filter, update)
    State.updateOne(filter, remove)
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Internal server error.');
    });
}

// Return the state capital for the specified state in the statesData.json file.
const getCapital = async (req, res, next) => {
  try {
    const capital = getStateData(req.params.code.toUpperCase(), 'capital', res)
    res.json(capital);
  } catch (err) {
    next(err);
  }
};

// Return the state nickname for the specified state in the statesData.json file.
const getNickName = async (req, res, next) => {
  try {
    const nickname = getStateData(req.params.code.toUpperCase(), 'nickname',res )
    res.json(nickname);
  } catch (err) {
    next(err);
  }
};

// Return the state population for the specified state in the statesData.json file.
const getPopulation = async (req, res, next) => {
  try {
    const population = getStateData(req.params.code.toUpperCase(), 'population', res)
    res.json(population);
  } catch (err) {
    next(err);
  }
    
};

// Return the admission date for the specified state in the statesData.json file.
const getAdmission = async (req, res, next) => {
    try {
      const admitted = getStateData(req.params.code.toUpperCase(), 'admitted', res)
      res.json(admitted);
    } catch (err) {
    next(err);
  }
};

// Return all the available data for the specified state.
const getStateData = (code, type, res) => {
    const state = data.states.find(state => state.code === code);
    if (!state) {
      return res.status(404).json({ "message": `Invalid state abbreviation parameter`});
    }
    switch(type) {
        case 'capital':
            return {
                state: state.state,
                capital: state.capital_city
            };   
        case 'nickname':
            return {
                state: state.state,
                nickname: state.nickname
            }
        case 'population':
            return {
                state: state.state,
                population: state.population
            }
        case 'admitted':
            return {
                state: state.state,
                admitted: state.admission_date
            }
    }
}

// Export all modules
module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteState,
    getState,
    getFunfact,
    getPopulation,
    getAdmission,
    getCapital,
    getNickName,
    createFunfact,
    patchFunfact,
    deleteFunfact
};