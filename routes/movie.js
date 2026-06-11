const express = require(`express`);
const router = express.Router();
const movieController = require(`../controllers/movie`);

const { verify, verifyAdmin } = require('../auth');

router.post('/addMovie', verify, verifyAdmin, movieController.addMovie);

router.get('/getMovies', verify, movieController.getAllMovies);

router.get('/getMovie/:id', verify, movieController.getMovie);

router.patch('/updateMovie/:id', verify, verifyAdmin, movieController.updateMovie);

router.delete('/deleteMovie/:id', verify, verifyAdmin, movieController.deleteMovie);

router.patch('/addComment/:id', verify, movieController.addComment);

router.get('/getComments/:id', verify, movieController.getComments);

module.exports = router;