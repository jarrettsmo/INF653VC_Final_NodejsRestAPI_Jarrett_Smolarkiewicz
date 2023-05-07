const State = require('../model/State');

// const getAllStates = async (req, res, next) => {
//   try {
//     const contig = req.query.contig === 'true'; // convert string to boolean
//     const states = await State.find({});
//     let result = states;

//     if (contig) {
//       result = states.filter(state => state.contiguous === true);
//     } else if (contig === false) {
//       result = states.filter(state => state.contiguous === false);
//     }

//     res.status(200).json({ success: true, data: result });
//   } catch (error) {
//     next(error);
//   }
// };

const getAllStates = async (req, res) => {
    try {
      let states;
      const contig = req.query.contig; // get the 'contig' query parameter value
  
      // check if 'contig' query parameter is present and set states accordingly
      if (contig === undefined) {
        states = await State.find();
      } else {
        states = await State.find({ contig: contig });
      }
  
      res.status(200).json({
        success: true,
        data: states,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  };

const createNewState = async (req, res, next) => {
  try {
    const state = new State(req.body);
    const newState = await state.save();
    res.status(201).json({ success: true, data: newState });
  } catch (error) {
    next(error);
  }
};

const updateState = async (req, res, next) => {
  try {
    const { id } = req.params;
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

const deleteState = async (req, res, next) => {
  try {
    const { id } = req.params;
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

const getState = async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await State.findById(id);
    if (!state) {
      res.status(404);
      throw new Error(`State with id ${id} not found`);
    }
    res.status(200).json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStates,
  createNewState,
  updateState,
  deleteState,
  getState,
};