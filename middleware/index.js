const Camp = require("../models/campground"),
    Comment = require("../models/comment");

let middlewares = {};

middlewares.isLogged = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Você precisa entrar para fazer isso!");
    res.redirect("/login");
}

middlewares.isTheCommentOwner = function (req, res, next) {
    // Caso o usuario esteja logado
    if (req.isAuthenticated()) {
        // Procura o comentario desejado no db
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash("error", "Comentário não encontrado!");
                console.log(`ERRO AO ENCONTRAR COMENTÁRIO APÓS CONFIRMAR MIDDLEWARE DE IDENTIDADE: ${err}`);
                res.redirect("back");
                // Se não tiver erro, confirma se o usuario logado é o dono do coment
            } else {
                // Se for, continua
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                    // Se não, redireciona à página de aviso
                } else {
                    req.flash("denied", "Você não tem permissão para fazer isso!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Você precisa entrar para fazer isso!");
        res.redirect("/login");
    }
}

middlewares.isTheCampOwner = function (req, res, next) {
    // Caso o usuario esteja logado
    if (req.isAuthenticated()) {
        // Procira o camp desejado no db
        Camp.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "Acampamento não encontrado!")
                console.log(`ERRO AO ENCONTRAR CAMP APÓS CONFIRMAR MIDDLEWARE DE IDENTIDADE ${err}`);
                res.redirect("/backgrounds");
                // Se não tiver erro, confirma se o usuario logado é o dono do camp
            } else {
                // Se for, continua
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                    // Se não, redireciona à página de aviso
                } else {
                    req.flash("denied", "Você não tem permissão para fazer isso!");
                    res.redirect("/campgrounds");
                }
            }
        });
    } else {
        req.flash("error", "Você precisa entrar para fazer isso!");
        res.redirect("/login");
    }
}

module.exports = middlewares;