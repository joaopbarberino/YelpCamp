const Camp = require("../models/campground"),
    Comment = require("../models/comment");

let middlewares = {};

middlewares.isLogged = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/warning");
}

middlewares.isTheCommentOwner = function (req, res, next) {
    // Caso o usuario esteja logado
    if (req.isAuthenticated()) {
        // Procura o comentario desejado no db
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                console.log(`ERRO AO ENCONTRAR COMENTÁRIO APÓS CONFIRMAR MIDDLEWARE DE IDENTIDADE: ${err}`);
                res.redirect("back");
                // Se não tiver erro, confirma se o usuario logado é o dono do coment
            } else {
                // Se for, continua
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                    // Se não, redireciona à página de aviso
                } else {
                    res.redirect("/warning");
                }
            }
        });
    } else {
        res.redirect("/warning");
    }
}

middlewares.isTheCampOwner = function (req, res, next) {
    // Caso o usuario esteja logado
    if (req.isAuthenticated()) {
        // Procira o camp desejado no db
        Camp.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log(`ERRO AO ENCONTRAR CAMP APÓS CONFIRMAR MIDDLEWARE DE IDENTIDADE ${err}`);
                res.redirect("back");
                // Se não tiver erro, confirma se o usuario logado é o dono do camp
            } else {
                // Se for, continua
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                    // Se não, redireciona à página de aviso
                } else {
                    res.redirect("/warning");
                }
            }
        });
    } else {
        res.redirect("/warning");
    }
}

module.exports = middlewares;