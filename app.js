const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser");

let campgrounds = [
		{name: "Zubumafu", image: "https://farm66.staticflickr.com/65535/47748587281_d693351939.jpg"},
		{name: "Londres", image: "https://farm66.staticflickr.com/65535/47748587281_d693351939.jpg"}, 
		{name: "Wakanda", image: "https://farm8.staticflickr.com/7884/46141213895_9fe978022c.jpg"}, 
		{name: "Gotham", image: "https://farm4.staticflickr.com/3039/2595824124_df6e3c5c00.jpg"},
		{name: "Zubumafu", image: "https://farm66.staticflickr.com/65535/47748587281_d693351939.jpg"},
		{name: "Londres", image: "https://farm66.staticflickr.com/65535/47748587281_d693351939.jpg"}, 
		{name: "Wakanda", image: "https://farm8.staticflickr.com/7884/46141213895_9fe978022c.jpg"}, 
		{name: "Gotham", image: "https://farm4.staticflickr.com/3039/2595824124_df6e3c5c00.jpg"}, 
		{name: "Zubumafu", image: "https://farm66.staticflickr.com/65535/47748587281_d693351939.jpg"},
		{name: "Londres", image: "https://farm66.staticflickr.com/65535/47748587281_d693351939.jpg"}, 
		{name: "Wakanda", image: "https://farm8.staticflickr.com/7884/46141213895_9fe978022c.jpg"}, 
		{name: "Gotham", image: "https://farm4.staticflickr.com/3039/2595824124_df6e3c5c00.jpg"}, 
		{name: "Zubumafu", image: "https://farm66.staticflickr.com/65535/47748587281_d693351939.jpg"},
		{name: "Londres", image: "https://farm66.staticflickr.com/65535/47748587281_d693351939.jpg"}, 
		{name: "Wakanda", image: "https://farm8.staticflickr.com/7884/46141213895_9fe978022c.jpg"}, 
		{name: "Gotham", image: "https://farm4.staticflickr.com/3039/2595824124_df6e3c5c00.jpg"},
	
	];	

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
	res.render("landing");
});

app.get("/campgrounds", (req, res) => {
	
	res.render("campgrounds", {campgrounds: campgrounds})
});

app.post("/campgrounds", (req, res) => {
	let name = req.body.name,
		image = req.body.image,
		newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds")
});

app.get("/campgrounds/new", (req, res) => {
	res.render("new.ejs");
});



app.get("*", (req, res) => {
	res.send("Essa página não existe.")
});

app.listen(3000, ()=> console.log("Server iniciado."));