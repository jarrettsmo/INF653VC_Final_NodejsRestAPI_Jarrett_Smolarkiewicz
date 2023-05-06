const State = require('../model/State');

const getAllStates = async (req, res) => {
    const stateFacts = await State.find();
    if (!State) return res.status(204).json({ 'message': 'No states with fun facts found.' });
    res.json(stateFacts);
}

const createNewState = async (req, res) => {
    if (!req?.body?.code) {
        return res.status(400).json({ 'message': 'A state code is required at minimum.' });
    }

    try {
        const result = await State.create({
            code: req.body.code,
            contig: req.body.contig,
            nickname: req.body.nickname,
            admission: req.body.admission,
            capital: req.body.capital,
            population: req.body.population,
            funfacts: req.body.funfacts
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateState = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const stateID = await State.findOne({ _id: req.body.id }).exec();
    if (!stateID) {
        return res.status(204).json({ 'message': `No state matches ID ${req.body.id}.` });
    }
    if (req.body?.code) stateID.code = req.body.code;
    if (req.body?.funfacts) stateID.funfacts = req.body.funfacts;
    const result = await stateID.save();
    res.json(result);
}

const deleteState = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'State ID required.' });
    
    const stateID = await State.findOne({ _id: req.body.id }).exec();
    if (!stateID) {
        return res.status(204).json({ "message": `No state matches ID ${req.body.id}.` });
    }
    const result = await stateID.deleteOne(); // { _id: req.body.id }
    res.json(result);
}

const getState = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'State ID required.' });
    
    const stateID = await State.findOne({ _id: req.params.id }).exec();
    if (!stateID) {
        return res.status(204).json({ "message": `No state matches ID ${req.params.id}.` });
    }
    res.json(stateID);
}

module.exports = { 
    getAllStates,
    createNewState,
    updateState,
    deleteState,
    getState
};

