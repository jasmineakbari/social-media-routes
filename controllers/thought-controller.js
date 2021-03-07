const { Thought, User } = require('../models');

const thoughtController = {
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

    // remove comment
    removeThought({ params }, res) {
        // find one and delete to find commeny by id and delete
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
            return res.status(404).json({ message: 'No comment with this id!' });
            }
            return Pizza.findOneAndUpdate(
            { _id: params.pizzaId },
            // pull removes it from the pizza object
            { $pull: { comments: params.commentId } },
            { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // remove reply
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
        { _id: params.commentId },
        { $pull: { replies: { replyId: params.replyId } } },
        { new: true }
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    }
}

module.exports = thoughtController;