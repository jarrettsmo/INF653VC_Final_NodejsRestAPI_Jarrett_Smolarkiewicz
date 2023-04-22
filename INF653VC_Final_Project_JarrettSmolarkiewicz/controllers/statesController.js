const StateFact = require('../model/State');

const getAllStateFacts = async (req, res) => {
    const stateFacts = await StateFact.find();
    if (!StateFacts) return res.status(204).json({ 'message': 'No states with fun facts found.' });
    res.json(stateFacts);
}

const createNewStateFact = async (req, res) => {
    if (!req?.body?.stateCode) {
        return res.status(400).json({ 'message': 'A state code is required at minimum.' });
    }
    
    try {
        const result = await StateFact.create({
            stateCode: req.body.stateCode,
            funfacts: req.body.funfacts
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateStateFact = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const stateFact = await StateFact.findOne({ _id: req.body.id }).exec();
    if (!stateFact) {
        return res.status(204).json({ "message": `No state matches ID ${req.body.id}.` });
    }
    if (req.body?.stateCode) stateFact.stateCode = req.body.stateCode;
    if (req.body?.funfacts) stateFact.funfacts = req.body.funfacts;
    const result = await stateFact.save();
    res.json(result);
}

const deleteStateFact = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'State ID required.' });

    const stateFact = await StateFact.findOne({ _id: req.body.id }).exec();
    if (!stateFact) {
        return res.status(204).json({ "message": `No state matches ID ${req.body.id}.` });
    }
    const result = await stateFact.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getStateFact = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'State ID required.' });

    const stateFact = await StateFact.findOne({ _id: req.params.id }).exec();
    if (!stateFact) {
        return res.status(204).json({ "message": `No state matches ID ${req.params.id}.` });
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

