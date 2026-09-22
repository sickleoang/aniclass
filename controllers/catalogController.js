const db = require('../config/db');

exports.index = async (req, res, next) => {
    try {
        const q = String(req.query.q || '').trim().slice(0, 100);
        let sql =  `select id, title, slug, synopsis, genre, year, poster_url, status
        from anime`;

        const params = [];

        if(q) {
            sql += ` where title like ? or genre like ?`;
            const keyword = `%${q}%`;
            params.push(keyword, keyword);
        }

        sql += ` order by created_at desc, id desc`

        const [animeList] = await db.query(sql, params);

        res.render('catalog/index', {
            title: 'Daftar Anime',
            animeList,
            q
        });
    } catch (error) {
        next(error);
    }
};

exports.show = async (req, res, next) => {
    try {
        const slug = String(req.params.slug || '').trim();

        const [animeRows] = await db.query(`select id, title, slug, synopsis, genre, year, poster_url, status
            from anime where slug = ?`, [slug]);

        if(animeRows.length === 0) {
            return res.status(404).render('errors/404', { title: 'Anime Tidak Ditemukan' });
        }

        const anime = animeRows[0];

        const [episodes] = await db.query(`select id, anime_id, title, episode_number, video_url, access_level
            from episodes where anime_id = ? order by episode_number asc`, [anime.id]);

        res.render('catalog/show', {
            title: anime.title,
            anime,
            episodes
        });

    }catch (error) {
        next(error);
    }
}