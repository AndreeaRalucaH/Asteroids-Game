const app = {
    canvas: null,
    context: null,

    //nava
    marimeNava: 30,
    navaX: null,
    navaY: null,
    navaDx: 0, //contor axa Ox
    navaDy: 0, //contor axa Oy
    unghi: 0, //unghiul de directie al navei
    vitezaRotatie: 0.005, //viteza de rotatie a navei
    raza: 15, //imi indica marimea navei
    laturi: 3,
    navaStatus: 1,


    //racheta
    racheta: [],
    nrRachete: 1,
    racRaza: 4, //marimea rachetei
    racViteza: 5, //viteza de deplasare a rachetei
  

    //tastatura
    key: [], //vector ce contine codurile aferente tastaturii


    //asteroizi
    asteroid: [],
    asteroidLinie: 3,
    asteroidColoana: 5,
    asteroidRaza: 40,
    asteroidOffsetTop: 50,
    asteroidOffsetLeft: 60,
    asteroidPadding: 60,
    asteroidHeight: 150,
    asteroidWidth : 150,
   
   

    //scor
    score: 0,
    

    //vieti
    lives: 3



}



app.load = function(){
    app.canvas = document.getElementById("asteroidCanvas");
    app.context = app.canvas.getContext("2d"); //luam contextul grafic al canvasului
    app.resizeCanvas();
    
    

    //pozitionam coordonatele navei la mijlocul canvasului
    app.navaX = app.canvas.width / 2;
    app.navaY = app.canvas.height / 2;

    
   
    for(let i = 0; i < app.nrRachete; i++){
        app.racheta[i] = {
            x: null, //coordonate racheta
            y: null,
            dx: 0, //contor racheta
            dy: 0,
            raza: 4,
            status: 1
            
        }
    }

   

    app.lanseazaRacheta(app.unghi);

    for(let r = 0; r < app.asteroidLinie; r++){
        app.asteroid[r] = [];
        for(let c = 0; c < app.asteroidColoana; c++){
            app.asteroid[r][c] = {
                x: 0,
                y: 0,
                radius: 0,
                stare: 1,
                valoareAstr: 0


            }
        }
    }

    for(let r = 0; r < app.asteroidLinie; r++){
            
        for(let c = 0; c < app.asteroidColoana; c++){
            app.asteroid[r][c].x = app.asteroidOffsetLeft +  c * (app.asteroidWidth  + app.asteroidPadding); //coordonatele de unde se vor desena asteroizii
            app.asteroid[r][c].y = app.asteroidOffsetTop + r * (app.asteroidHeight + app.asteroidPadding);
               
               
        }
    }

    
    for(let r = 0; r < app.asteroidLinie; r++){
            
        for(let c = 0; c < app.asteroidColoana; c++){

            const val =  Math.floor((Math.random() * 4) + 1); //imi genereaza un numar aleator intre 1 si 4

            if(val <= 2){
                app.asteroid[r][c].valoareAstr = val; //salvez valoarea actuala pentru fiecare asteroid
            }

            if(val >= 2 && val <= 3){
                app.asteroid[r][c].valoareAstr = val;
            }
            
            
            if(val >= 3 && val <= 4){
                app.asteroid[r][c].valoareAstr = val;
            }
        }
    }
    
    requestAnimationFrame(app.draw);

}

app.resizeCanvas = function(){ //redimensionam canvasul
    app.canvas.width = app.canvas.clientWidth;
    app.canvas.height = app.canvas.clientHeight;
}

app.draw = function(){
    app.drawNava();
    app.drawRacheta();
   
    app.drawAsteroizi();

    
 
    app.shoot(app.unghi); //porneste racheta

    
    //viteza cu care se var deplasa fiecare asteroid
    for(let r = 0; r < app.asteroidLinie; r++){
            
        for(let c = 0; c < app.asteroidColoana; c++){

            const val = Math.round(app.getRandom(1,4)); 
            //generam o valoare random intre 1 si 4 iar in functie de aceasta coordonata x 
            //a asteroidului va creste cu o valoare generata aleator, cu cat valoarea este mai mica cu atat asteroidul se va deplasa mai incet

            if(val <= 2){
                app.asteroid[r][c].x += app.getRandom(0,3);
                
            }

            if(val >= 2 && val <= 3){
                app.asteroid[r][c].x += app.getRandom(0,4);
            }

            if(val >= 3 && val <= 4){
                app.asteroid[r][c].x += app.getRandom(0,2);
            }


            //daca asteroizii au valori mai mare decat cele ale canvasului, ii aducem in partea opusa, pentru a crea efectul de revenire
            if( app.asteroid[r][c].x > app.canvas.width)
            {
                app.asteroid[r][c].x = app.asteroid[r][c].radius;
            }

            if(app.asteroid[r][c].y < app.asteroid[r][c].radius)
            {
                app.asteroid[r][c].y = app.canvas.height;
            }

            if(app.asteroid[r][c].y > app.canvas.height)
            {
                app.asteroid[r][c].y = app.asteroid[r][c].radius;
            }
        }
    }

    //coliziunea dintre 2 asteroizi
    app.coliziuneAsteroizi();

    //coliziune asteroid - racheta
    app.coliziuneAsteroidRacheta();

    //coliziune asteroid - nava
    app.coliziuneAsteroiziNava();

    app.drawScore();
    app.drawLives();
    
   
    document.addEventListener("keydown", app.keyDownEvent,false);
    document.addEventListener("keyup",app.keyUpEvent,false);

   
    //facem functia sa se apeleze periodic
    requestAnimationFrame(app.draw);
}

app.keyDownEvent = function(event){

    //setam codurile pe true, ne cream o intrare pentru fiecare tasta apasata
    app.key[event.keyCode] = true;

    //sageata stanga
    if(app.key[37]){
        app.navaDx -= 4;
       
        
    }

    //sageata dreapta
    if(app.key[39]){
        app.navaDx += 4;
        
    }

    //sageata jos
    if(app.key[38]){
        app.navaDy -= 4;
        
    }

    //sageata sus
    if(app.key[40]){
        app.navaDy += 4;
        
    }

    //rotire stanga
    if(app.key[90]){
        
        app.rotateNava(-1);
        
   
    }
  
    //rotire dreapta
    if(app.key[67]){
        app.rotateNava(1);
        
    }

    //lansare racheta
    if(app.key[68]){

        app.pozitieRacheta(app.unghi);
        app.drawRacheta();
    }

    
    app.drawNava();
}

app.getRandom = function(min,max){ //functie care calculeaza o valoare random dintre 2 numere date
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min + 1) + min);
}

app.coliziuneAsteroiziNava = function(){

    for(let r = 0; r < app.asteroidLinie; r++){
        for(let c = 0; c < app.asteroidColoana; c++){

            const asteroid = app.asteroid[r][c]
            var dx = asteroid.x - app.navaX;
            var dy = asteroid.y - app.navaY;
                        
            var distance = Math.sqrt(dx*dx + dy*dy); //calculam distanta dintre asteroid si nava

            if(distance < asteroid.radius + app.raza) //daca distanta este mai mica decat suma razelor atunci scadem numarul de vieti si reluam jocul
            {
                document.location.reload();
                app.lives -= 1;
                console.log(app.lives);
                if(app.lives < 3){
                    //daca numarul de vieti este mai mic decat 3 va aparea GAME OVER
                    app.drawGameOver();
                }
            }

        }

    }
}

app.drawScore = function(){
    app.context.fillStyle = "white";
    app.context.font = "30px Arial";
    app.context.fillText("Score: " +app.score, 90, 30);
}

app.drawLives = function(){
    app.context.fillStyle = "white";
    app.context.font = "30px Arial";
    app.context.fillText("Lives: " +app.lives, app.canvas.width - 80, 30);
}

app.drawGameOver = function(){
    app.context.fillStyle = "white";
    app.context.font = "50px Arial";
    app.context.fillText("GAME OVER", app.canvas.width / 2, app.canvas.height / 2);
}

app.coliziuneAsteroizi = function(){

    for(let r = 0; r < app.asteroidLinie; r++){
        for(let c = 0; c < app.asteroidColoana-1; c++)
        {
            const val = app.asteroid[r][c];
            const val2 = app.asteroid[r][c+1]

            var dx = val.x - val2.x;
            var dy = val.y - val2.y;
                    
            var distance = Math.sqrt(dx*dx + dy*dy);

            if(distance < val.radius + val2.radius ){ 
                //daca distanta calcultata este mai mica decat razele adunate ale celor 2 asteroizi atunci schimbam directia de deplasare pentru x
                // si scaden y cu o valoare aleatoare
                app.asteroid[r][c].y -= 0.5;
                app.asteroid[r][c+1].y -= 0.9;
                app.asteroid[r][c].x = - app.asteroid[r][c].x;
                app.asteroid[r][c+1].x = - app.asteroid[r][c+1].x;

            }
        }
    }
}

app.coliziuneAsteroidRacheta = function(){

    for(let i = 0; i < app.nrRachete; i++){
        for(let r = 0; r < app.asteroidLinie; r++){
            for(let c = 0; c < app.asteroidColoana; c++)
            {
                const asteroid = app.asteroid[r][c];
                const racheta = app.racheta[i]
                    var dx = asteroid.x - racheta.x;
                    var dy = asteroid.y - racheta.y;
                            
                    var distance = Math.sqrt(dx*dx + dy*dy);

                    if(distance < asteroid.radius + racheta.raza)
                    {
                        //app.racheta[i].status = 0;
                        if(app.asteroid[r][c].valoareAstr === 1){
                            app.asteroid[r][c].stare = 0;
                           
                        }else{
                            racheta.status = 0
                            app.asteroid[r][c].x = 90; //redesenez asteroidul la alte coordonate fata de cele initiale
                            app.asteroid[r][c].valoareAstr -= 1; //scad numarul de rachete necesare pentru distrugerea asteroidului
                            app.drawAsteroizi();
                            
                            
                        }
                        racheta.status = 1;
                        app.score++;
                        if(app.score > 30){
                            app.lives += 1;
                            console.log(app.lives);
                        }
                        
                    }
                    
                
            }
        }
    }

}

//desenam asteroizii
//desenam asteroizii sub forma unei matrici de 3 linii si 5 coloane
app.drawAsteroizi = function(){
    
   
    for(let r = 0; r < app.asteroidLinie; r++){
            
        for(let c = 0; c < app.asteroidColoana; c++){
                
            if(app.asteroid[r][c].stare === 1){

                if(app.asteroid[r][c].valoareAstr < 2) 
                {
                    //daca valoarea aferenta asteroidului este mai mica de 2 acesta va fi alb iar raza se va mari cu de 3 ori valoarea lui
                    app.asteroid[r][c].radius = app.asteroidRaza +  3 * app.asteroid[r][c].valoareAstr;
                    app.context.beginPath();
                    app.context.fillStyle = "white";
                    app.context.arc(app.asteroid[r][c].x, app.asteroid[r][c].y, app.asteroid[r][c].radius, 0, 2*Math.PI); 
                    app.context.fill();
                    app.context.closePath();
                    app.context.textAlign = "center"
                    app.context.font = "20px Arial"
                    app.context.fillStyle = "black"
                    app.context.fillText(app.asteroid[r][c].valoareAstr,app.asteroid[r][c].x,app.asteroid[r][c].y);

                }
                if(app.asteroid[r][c].valoareAstr >= 2 && app.asteroid[r][c].valoareAstr <= 3){
                    //daca valoarea aferenta asteroidului este mai mica sau egala cu 3 si mai mare sau egala cu 2
                    // acesta va fi rosu iar raza se va mari cu de 3 ori valoarea lui
                    app.asteroid[r][c].radius = app.asteroidRaza +  3 * app.asteroid[r][c].valoareAstr;
                    app.context.beginPath();
                    app.context.fillStyle = "red";
                    app.context.arc(app.asteroid[r][c].x, app.asteroid[r][c].y, app.asteroid[r][c].radius, 0, 2*Math.PI);
                    app.context.fill(); 
                    app.context.closePath();
                    app.context.textAlign = "center"
                    app.context.font = "20px Arial"
                    app.context.fillStyle = "black"
                    app.context.fillText(app.asteroid[r][c].valoareAstr,app.asteroid[r][c].x,app.asteroid[r][c].y);
                
                }
                
                
                if(app.asteroid[r][c].valoareAstr > 3 && app.asteroid[r][c].valoareAstr <= 4){
                    //daca valoarea aferenta asteroidului este mai mica sau egala cu 4 si mai mica decat 3
                    // acesta va fi verde iar raza se va mari cu de 3 ori valoarea lui
                    app.asteroid[r][c].radius =app.asteroidRaza +  3 * app.asteroid[r][c].valoareAstr;
                    app.context.beginPath();
                    app.context.fillStyle = "green";
                    app.context.arc(app.asteroid[r][c].x, app.asteroid[r][c].y, app.asteroid[r][c].radius, 0, 2*Math.PI);
                    app.context.fill(); 
                    app.context.closePath();
                    app.context.textAlign = "center"
                    app.context.font = "20px Arial"
                    app.context.fillStyle = "black"
                    app.context.fillText(app.asteroid[r][c].valoareAstr,app.asteroid[r][c].x,app.asteroid[r][c].y);

                }
            }
        }
    }

}

//desenam racheta avand forma rotunda
app.drawRacheta = function(){
    
    for(let i = 0; i < app.nrRachete; i++){

        if(app.racheta[i].status === 1){
            app.context.beginPath();
            app.context.arc(app.racheta[i].x,app.racheta[i].y,app.racheta[i].raza,0,2*Math.PI);
            app.context.fillStyle = "blue";
            app.context.fill();
            app.context.closePath();
        }
    }
   

}

app.shoot = function(unghi){
    for(let i = 0; i < app.nrRachete; i++){
        let radiani = unghi / Math.PI * 180;
        app.racheta[i].x += app.racheta[i].dx * Math.cos(radiani); //incrementam coordonatele navei cu directia calculata anterior si inmultim cu cosinusul si sinusul unghiului 
        app.racheta[i].y += app.racheta[i].dx * Math.sin(radiani); 
    }
    
}

app.lanseazaRacheta = function(unghi){ //imi lanseaza racheta in functie de unghiul navei

    for(let j = 0; j < app.nrRachete; j++){
        let radiani = unghi / Math.PI * 180; 
        app.racheta[j].dx -= Math.cos(radiani) * app.racViteza; //directia in care se va duce racheta
        app.racheta[j].dy -= Math.sin(radiani) * app.racViteza;
    }

}

app.rotateNava = function(directie){
    app.unghi += app.vitezaRotatie * directie;  //functia de rotatie a navei, unghiul va creste sau scadea in functie de valoarea primita in parametru
}

app.keyUpEvent = function(event){

    //marcam faptul ca am eliberat tastele
    app.key[event.keyCode] = false;

   
}


app.pozitieRacheta = function(unghi){
    
    for(let i = 0; i < app.nrRachete; i++){
        let radiani = unghi / Math.PI * 180;
        app.racheta[i].x = app.navaX - app.raza * Math.cos(radiani);
        app.racheta[i].y = app.navaY - app.raza * Math.sin(radiani);
        app.racheta[i].x += app.navaDx;
        app.racheta[i].y += app.navaDy;
    }
}



//desenam nava
app.drawNava = function(){

    if(app.navaStatus === 1){
        app.context.clearRect(0,0,app.canvas.width, app.canvas.height); //golim canvasul la fiecare desenare, pentru a se crea efectul de miscare
        app.context.strokeStyle = "white"; //setam culoarea cu care vom desena nava
        app.context.lineWidth = app.marimeNava / 20; //setam grosimea liniei cu care vom desena
        app.context.beginPath(); //incepem sa desenam o forma
        let ung =((Math.PI * 2) / app.laturi);
        let radiani = app.unghi / Math.PI * 180; //formula de transformare in radiani
        //desenam laturile triunghiului
        for(var i = 0; i < app.laturi; i++){
            app.context.lineTo(app.navaX - app.raza * Math.cos(ung * i + radiani) + app.navaDx,
                                app.navaY - app.raza * Math.sin(ung * i + radiani) + app.navaDy);
        }
        app.context.closePath();
        app.context.stroke();
    }
    

}