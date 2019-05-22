const express = require("express"),
	router = express.Router(),
	passport = require("passport");

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
			console.log(`ERRO AO REGISTRAR USUÁRIO: ${err}`);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
			console.log(`USUÁRIO REGISTRADO: ${user}`)
			res.redirect("/campgrounds");
		})
	});
});

// Mostrar form de acesso (login)
router.get("/login", (req, res) => {
	res.render("login")
});

// Lógica de acesso de usuário (login)
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), (req, res) => {
	});


router.get("/warning", (req, res) => {
	res.render("warning");
});


// Lógica de encerramento de sessão (logout)
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
});

function isLogged(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/warning");
}

module.exports = router;