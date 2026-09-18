const homePage = (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

export { homePage };