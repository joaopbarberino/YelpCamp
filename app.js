// Requere e salva os pacotes utilizados no projeto em variáveis
const express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

// Conecta o banco de dados à app
mongoose.connect("mongodb://localhost/YelpCamp", { useNewUrlParser: true });
// Permite a app lidar com as URL's
app.use(bodyParser.urlencoded({ extended: true }));
// Define a engine de renderização como arquivos ejs nas pasta view
app.set("view engine", "ejs");

// Cria um esquema para definir um objeto acampamento no banco de dados
const campSchema = new mongoose.Schema({
	name: String,
	imgURL: String
}),
	// Cria um objeto capaz de manipular o banco de dados a partir do esquema
	Camp = mongoose.model("Camp", campSchema);

// Quando a URL path for solicitada
app.get("/", (req, res) => {
	// Renderiza pagina inicial
	res.render("landing");
});

// Quando a URL /campgrounds for solicitada
app.get("/campgrounds", (req, res) => {
	// Pega todos os camps do banco de dados
	Camp.find({}, (err, camps) => {
		// Verifica se houve erro
		if (err) {
			console.log("ERRO AO COLETAR CAMPS!")
			console.log(err);
			// Se não houve erro, renderiza a página de campgrounds com os dados coletados
		} else {
			res.render("campgrounds", { campgrounds: camps });
		}
	});
});

// Quando a URL /campgrounds/new for solicitada (adição de novo acampamento)
app.get("/campgrounds/new", (req, res) => {
	// Renderiza a página de formulário
	res.render("new.ejs");
});

// Quando uma requisição POST for feita à URL /campgrounds, no caso, vinda de um form 
app.post("/campgrounds", (req, res) => {
	// Guarda os dados recebidos da requisição
	let name = req.body.name,
		imgURL = req.body.image,
		newCampground = { name: name, imgURL: imgURL };
	// Cria um objeto no banco de dados com os dados recebidos
	Camp.create(newCampground, (err, camp) => {
		// Verifica se houve erro
		if (err) {
			console.log("ERRO AO SALVAR CAMP!");
			console.log(err);
			// Se não houve erro, redireciona o usuário a página de campgrounds
		} else {
			console.log("Camp adicionado.");
			console.log(camp);
			res.redirect("/campgrounds")
		}
	});
});

// Quando qualquer URL não reconhecida for solicitada 
app.get("*", (req, res) => {
	// TODO renderiza página de erro (404)
	res.send("Essa página não existe.")
});

// Dá uma porta para o servidor Node rodar
app.listen(3000, () => console.log("Server iniciado."));