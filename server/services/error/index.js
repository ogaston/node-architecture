module.exports = function () {

    const response = err => ({
        error: {
            code: err.code,
            success: false,
        }
    })

    const codeStatus = err => err.code ? 400 : 500

    return function (err, req, res, next) {
        res.status(codeStatus(err)).json(response(err))
    }
}
