const Movie = require('../models/Movie');
const {errorHandler} = require('../auth');

module.exports.addMovie = (req, res) => {
    const { title, director, year, description, genre } = req.body;

    if(!req.user.isAdmin)
        return res.status(403).send({ message: "Forbidden Action" });

    let newMovie = new Movie({
        title,
        director,
        year,
        description,
        genre
    })

    return Movie.findOne({ title })
    .then(movie => {
        if(movie)
            return res.status(409).send({ message: "Movie already added" });

        return newMovie.save()
        .then(addedMovie => {
            return res.status(201).send({ addedMovie });
        })
        .catch(err => errorHandler(err, req, res));
    })
    .catch(err => errorHandler(err, req, res));

}

module.exports.getAllMovies = (req, res) => {

    return Movie.find({})
    .then(movies => {
        if(!movies)
            return res.status(404).send({ message: "No movies found" });

        return res.status(200).send({ movies });
    })
    .catch(err => errorHandler(err, req, res));

}

module.exports.getMovie = (req, res) => {

    return Movie.findById( req.params.id )
    .then(movie => {
        if(!movie)
            return res.status(404).send({ message: "Movie not found" });

        return res.status(200).send( movie );
    })
    .catch(err => errorHandler(err, req, res));

}

module.exports.updateMovie = (req, res) => {
    const { title, director, year, description, genre } = req.body;

    if(!req.user.isAdmin)
        return res.status(403).send({ message: "Forbidden Action" });

    let updatedMovie = {
        title,
        director,
        year,
        description,
        genre
    }

    return Movie.findByIdAndUpdate( 
        req.params.id,
        updatedMovie,
        {new: true}
    )
    .then(movie => {
        if(!movie)
            return res.status(404).send({ message: "Movie not found" });

        return res.status(200).send({
            message: "Movie updated successfully",
            updatedMovie: movie
        });
    })
    .catch(err => errorHandler(err, req, res));
}

module.exports.deleteMovie = (req, res) => {
    return Movie.findByIdAndDelete(req.params.id)
    .then(movie => {
        if(!movie)
            return res.status(404).send({ message: "Movie not found" });

        return res.status(200).send({ message: "Movie deleted successfully"});
    })
    .catch(err => errorHandler(err, req, res));
}

module.exports.addComment = (req, res) => {
    const { comment } = req.body;

    if(req.user.isAdmin)
        return res.status(403).send({ message: "Admin is forbidden" });

    const addedComment = {
        userId: req.user.id,
        comment
    }

    return Movie.findById(req.params.id)
    .then(movie => {
        if(!movie)
            return res.status(404).send({ message: "Movie not found" });

        movie.comments.push(addedComment);

        return movie.save()
        .then(updatedMovie => {
            return res.status(200).send({
                message: "comment added successfully",
                updatedMovie
            })
        })
        .catch(err => errorHandler(err, req, res));
        })
    .catch(err => errorHandler(err, req, res));
}

module.exports.getComments = (req, res) => {

    return Movie.findById(req.params.id)
    .then(movie => {
        if(!movie)
            return res.status(404).send({ message: "Movie not found" });

        return res.status(200).send({
            comments: movie.comments
        });
    })
    .catch(err => errorHandler(err, req, res));

}