const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const PORT = process.env.PORT || 3030;
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//PASAMOS DE EJS A HTML
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//PARA QUE EXPRESS USE LA CARPETA PUBLIC "ESTILOS,IMAGENES,JS ETC"
app.use(express.static(__dirname + "/public"));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
//CONECTION WITH THE DATABASE
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pokimon"
});

//ROUTES

app.get("/login",(req,res)=>{
    res.render("login");
    
});
//LOGIN AUTENTICACION
app.post("/auth",(req,res)=>{
    let user = req.body.user;
	let pass = req.body.pass;

    if (user && pass) {
        conexion.query('SELECT * FROM entrenadores WHERE user = ? AND pass = ?',[user,pass],function(error, results, fields) {
            if (error) throw error;
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.user = user;
				res.redirect('/pokimon');
                
        
    } else {
        res.send('Usuario o Contraseña Incorrectas!');
    }
    res.end();
});
    }else{
        res.send('Ingrese el Usuario y la Contraseña');
        console.log(`SELECT * FROM entrenadores WHERE user = ${req.body.user} AND pass = ${req.body.pass}`);
	res.end();
    }
});



app.get("/",function(req,res){
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.user + '!')
    }else{
        res.send('Ingrese al login para ingresar al sistema');
    }
    res.end();
});

app.get("/pokimon",(req,res)=>{
    res.render("Pokimon");
    
});


app.post("/registrar", async (req,res)=>{
    const nombre = req.body.nombre;
    const tipo = req.body.tipo;
    const punt_ataque = req.body.punt_ataque;
    const punt_defensa = req.body.punt_defensa;
    
    
    conexion.query("INSERT INTO pokimon SET ?", {nombre:nombre, tipo:tipo, punt_ataque:punt_ataque, punt_defensa:punt_defensa}, async (error,results)=>{
        if (error) {
            console.log("Error en el Registro de Datos");
        }else{
            res.redirect('/pokimon'); 
            
        }
    })
});
app.post("/curar", async (req,res)=>{
   
  
    
    conexion.query('UPDATE pokimon SET vida_pokimon = "100%"  WHERE id = 16 ?', async (error,results)=>{
        if (error) {
            console.log("Error en el Registro de Datos");
        }else{
            res.redirect('/pokimon'); 
            
        }
    })
});

app.get("/entrenador",(req,res)=>{
    res.render("Entrenador");
    
});
app.get("/addpo",(req,res)=>{
    res.render("addpo");
    
});
app.get("/adden", async (req, res)=>{
    res.render("adden");
});


app.post("/registrarEN", async (req, res)=>{
    const user = req.body.user;
    const correo = req.body.correo;
    const direccion = req.body.dirreccion;
    const pass = req.body.pass;
    
    conexion.query("INSERT INTO entrenador SET ?", {user:user, correo:correo, direccion:direccion, pass:pass}, async (error,results)=>{
        if (error) {
            console.log("Error en el Registro de Datos");
        }else{
            res.redirect('/adden'); 
            
        }
    })
}

);

conexion.connect(err=>{
    if (err) throw console.error();{
    }
});

app.listen(PORT,()=>console.log(`Server Running in: http://localhost:${PORT}`));
