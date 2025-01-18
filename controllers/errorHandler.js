const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    if (err.name === 'SequelizeValidationError') {
        return res.status(400).send({ err: `${err.message}` })
    } 

    res.status(500).json({ error: 'Something went wrong' });
}

module.exports = errorHandler;