exports.index = (req, res) => {
    res.render('home', {
        title: 'Home is where the code is!'
    });
};