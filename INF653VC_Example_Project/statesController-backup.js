const data = {
    states: require('../model/state.json'),
    setStateFacts: function (data) { this.states = data }
};

const getAllStateFacts = (req, res) => {
    res.json(data.states);
}

const createNewStateFact = (req, res) => {
    const newStateFact = {
        id: data.states?.length ? data.states[data.states.length - 1].id + 1 : 1,
        stateCode: req.body.stateCode,
        funfacts: req.body.funfacts
    }

    if (!newStateFact.stateCode || !newStateFact.funfacts) {
        return res.status(400).json({ 'message': 'A state code and at least one fun fact is required.' });
    }

    data.setStateFact([...data.states, newStateFact]);
    res.status(201).json(data.states);
}

const updateStateFact = (req, res) => {
    const stateFact = data.states.find(stf => stf.id === parseInt(req.body.id));
    if (!stateFact) {
        return res.status(400).json({ "message": `State Fact ID ${req.body.id} not found` });
    }
    if (req.body.stateCode) stateFact.stateCode = req.body.stateCode;
    if (req.body.funfacts) stateFact.funfacts = req.body.funfacts;
    const filteredArray = data.states.filter(stf => stf.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, stateFact];
    data.setStateFacts(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.states);
}

const deleteStateFact = (req, res) => {
    const stateFact = data.states.find(stf => stf.id === parseInt(req.body.id));
    if (!stateFact) {
        return res.status(400).json({ "message": `State Fact ID ${req.body.id} not found` });
    }
    const filteredArray = data.states.filter(stf => stf.id !== parseInt(req.body.id));
    data.setStateFacts([...filteredArray]);
    res.json(data.states);
}

const getStateFact = (req, res) => {
    const stateFact = data.states.find(stf => stf.id === parseInt(req.params.id));
    if (!stateFact) {
        return res.status(400).json({ "message": `State Fact ID ${req.params.id} not found` });
    }
    res.json(stateFact);
}

module.exports = { 
    getAllStateFacts,
    createNewStateFact,
    updateStateFact,
    deleteStateFact,
    getStateFact
};

