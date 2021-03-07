const { Thought, User } = require('../models');

const thoughtController = {

    // thought routes
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No Thought found at this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    addThought({ params, body }, res) {
        Thought.create(body)
        .then(({ username, _id }) => {
            return User.findOneAndUpdate(
            { username: username },
            { $push: { thought: _id } },
            { new: true, runValidators: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    updateThought({ body, params }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, 
            runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No Thought found at this id!' })
                }

                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.Id })
        .then(deletedThought => {
            if (!deletedThought) {
            return res.status(404).json({ message: 'No Thought with this id!' });
            }
            return User.findOneAndUpdate(
            { username: username },
            { $pull: { thought: params.Id } },
            { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // reaction routes
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $push: { reactons: body } },
          { new: true, runValidators: true }
        )
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No Thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
    },

    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }
}

module.exports = thoughtController;