const db = require('../config/db');

exports.index = async (req, res, next) => {
    try {
        const sql =  `select id, title, slug, synopsis, genre, year, poster_url, status
        from anime order by created_at desc, id desc`;

        const [animeList] = await db.query(sql);

        res.render('catalog/index', {
            title: 'Daftar Anime',
            animeList,
        });
    } catch (error) {
        next(error);
    }
};