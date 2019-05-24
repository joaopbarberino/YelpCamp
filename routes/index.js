const express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	middleware = require("../middleware");

// Importa as models utilizadas no projeto
const User = require("../models/user");

// Path Route
// Quando a URL path for solicitada
router.get("/", (req, res) => {
	// Renderiza pagina inicial
	res.render("landing");
});

// --------------------------------------------- Auth Routes ------------------------------------------------
// Mostrar form de registro
router.get("/register", (req, res) => {
	res.render("register");
});

// Lógica de registro de usuário
router.post("/register", (req, res) => {
	let newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash("error", "Não foi possível registrar o usuário!");
			console.log(`ERRO AO REGISTRAR USUÁRIO: ${err}`);
			res.redirect("/register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", `Registro concluído com sucesso! Bem-vindo(a), ${req.user.username} !`);
			console.log(`USUÁRIO REGISTRADO: ${user}`)
			res.redirect("/campgrounds");
		})
	});
});

// Mostrar form de acesso (login)
router.get("/login", (req, res) => {
	res.render("login");
});

// Lógica de acesso de usuário (login)
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), (req, res) => {
		if (err) {
			req.flash("error", "Não foi possível entrar!");
			console.log(`ERRO AO LOGAR: ${err}`)
		} else {
			req.flash("success", "Bem-vindo");
			res.redirect("/campgrounds");
		}
	});


router.get("/warning", (req, res) => {
	res.render("warning");
});


// Lógica de encerramento de sessão (logout)
router.get("/logout", middleware.isLogged, (req, res) => {
	req.flash("success", `Até mais, ${req.user.username}!`);
	req.logout();
	res.redirect("/campgrounds");
});

module.exports = router;