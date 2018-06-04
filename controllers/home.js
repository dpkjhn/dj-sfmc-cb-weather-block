exports.index = (req, res) => {

    console.log(req.query.type);

    res.render('home', {
        title: 'Home is where the code is!'
    }, (err, html) => {
        res.send('Nothing to see here');
    });
};