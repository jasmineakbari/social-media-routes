const router = require('express').Router();
const { getAllThoughts, 
    getThoughtById, 
    addThought, 
    updateThought, 
    removeThought, 
    addReaction, 
    removeReaction 
} = require('../../controllers/thought-controller');


router
    .route('/')
    .get(getAllThoughts)
    .post(addThought);

router
    .route('/:Id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(removeThought);

router
    .route('/:thoughtId/reaction')
    .post(addReaction);

router
    .route('/:thoughtId/reaction/:reactionId')
    .delete(removeReaction)

module.exports = router;