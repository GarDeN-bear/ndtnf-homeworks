const errorMiddleware = (req, res) => {
    res.render('errors/404', {
        title: '404'
    })
};

export default errorMiddleware;