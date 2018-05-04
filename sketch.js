var w = 800, h = 600;//40;

var sx = 30, sy = 18;

var figurinhas_por_linha = Math.floor((w-20)/(sx+1));

var numero_de_figurinhas = 682;

function Figurinha(n, x, y){
  this.n = n;
  this.jatenho = false;
  this.x = x;
  this.y = y;
  this.real_x = x;
  this.real_y = y;


  this.render = function(x = this.x, y = this.y){
    this.real_x = x;
    this.real_y = y;

    var colorS = 180;
    rectMode(CENTER);
    fill(colorS, 70, 255);
    stroke(colorS, 255, 200);
    rect(this.real_x, this.real_y, sx, sy)
    if(this.jatenho){
      colorS = (colorS+220)%360;
      rectMode(CORNERS);
      fill(colorS, 70, 255);
      noStroke();
      rect(this.real_x-(sx/2)+1, this.real_y-(sy/2)+1, this.real_x+(sx/2), this.real_y+(sy/2));
    }
    fill(colorS, 255, 200);
    noStroke();
    text(this.n, this.real_x, this.real_y);
  }

  this.clicked = function(x, y){
    if(x > (this.real_x-(sx/2)+1) && x <= (this.real_x+(sx/2)))
      if(y > (this.real_y-(sy/2)+1) && y <= (this.real_y+(sy/2)))
        return true;
  }
}

function Button(x, y, sx, sy, txt){
  this.x = x;
  this.y = y;
  this.sx = sx;
  this.sy = sy;
  this.txt = txt;

  this.render = function(new_txt, new_sx=6*this.txt.length){
    if(new_txt !== null || new_txt !== undefined){
      this.txt = new_txt;
      this.sx = new_sx;
    }
    fill(200, 70, 255);
    stroke(200, 200, 200);
    rectMode(CORNER);
    rect(this.x, this.y, this.sx, this.sy);
    fill(200, 200, 200);
    noStroke();
    text(this.txt, this.x+(this.sx/2), this.y+(this.sy/2));
  }

  this.clicked = function(x, y){
    if(x >= (this.x) && x <= (this.x+sx))
      if(y >= (this.y) && y <= (this.y+sy))
        return true;
  }
}

var figs = [];
var n_obtidas;
var obtidas = [1,4,5,9,12,13,15,16,17,18,20,21,22,23,25,26,27,28,31,32,34,35,36,37,40,41,43,44,45,46,47,48,50,51,52,53,54,58,62,63,64,67,68,69,70,75,77,78,79,81,82,83,84,85,86,87,89,90,93,96,98,99,102,103,105,106,107,110,114,115,116,117,118,119,121,122,123,124,126,127,129,130,131,132,133,134,135,136,138,139,140,141,142,143,145,146,147,149,150,151,153,155,156,157,159,160,161,162,163,164,165,167,168,169,170,171,173,174,175,176,177,178,179,180,182,183,184,185,187,190,193,194,196,197,199,200,201,202,203,204,205,206,208,209,210,213,214,215,218,221,222,223,226,228,229,230,231,232,233,234,235,237,238,241,245,246,247,249,250,251,252,253,254,255,256,257,258,259,261,262,265,266,267,268,269,270,271,272,273,274,276,278,280,281,282,285,286,289,290,291,292,293,294,295,296,298,299,300,301,302,303,306,308,309,310,314,316,318,322,323,325,327,328,329,330,331,333,334,335,337,339,341,343,344,348,349,353,354,355,356,357,359,361,362,363,366,367,368,371,372,374,375,377,378,379,380,381,384,387,392,393,395,396,397,399,402,403,404,407,409,410,413,415,417,421,422,423,424,425,426,428,430,431,435,437,439,440,441,444,445,446,447,448,449,450,451,453,454,455,457,459,460,461,463,464,465,466,467,470,473,474,476,478,479,481,483,484,486,488,490,491,495,497,498,500,501,502,503,505,506,507,510,511,513,514,515,516,517,518,520,522,523,524,526,530,531,533,535,537,539,541,543,544,545,546,547,548,549,550,551,553,554,557,558,559,560,561,564,565,566,568,570,571,573,575,578,579,582,583,584,585,587,588,590,592,593,595,596,597,599,600,601,606,609,610,613,614,616,617,618,620,621,623,625,626,627,628,630,631,633,634,636,637,640,641,643,644,645,646,649,651,652,654,655,656,657,658,659,660,663,664,667,668,670,676,677,680,681];
var num = 0;
var but;

var faltantes;
var falt_str = "Faltam x figurinhas";

var temos;
var tem_str = "Temos x figurinhas";

var draw_all = 1;
var draw_str = ["Mostrar todas as figurinhas <--\nMostrar figurinhas que faltam",
"Mostrar todas as figurinhas\nMostrar figurinhas que faltam <--"];

var escrevendo = 0;

function setup() {
  createCanvas(w, h);
  colorMode(HSB, 360, 255, 255);
  background(190, 50, 255);
  textFont("Comic Sans");
  textSize(12);
  textAlign(CENTER, CENTER);
  var max_x = 0;
  for(i = 0; i < numero_de_figurinhas; i++){
    figs.push(new Figurinha(i, 10+sx+((i%figurinhas_por_linha)*sx), (Math.floor((i/figurinhas_por_linha))*sy)+10+sy));
    if(figs[i].x > max_x)
      max_x = figs[i].x;
  }
  // saveToFirebase(obtidas);
  // localStorage.setItem("obtidas", obtidas);
  // obtidas = localStorage.getItem("obtidas");
  firebase.database().ref('figurinhas-obtidas').once('value')
    .then(function(snapshot){
      if(snapshot.val()){
        obtidas = snapshot.val().obtidas;
        for(i = 0; i < obtidas.length; i++){
          if(figs[obtidas[i]]){
            figs[obtidas[i]].jatenho = true;
            num++;
          }
        }
        obtidas = []
        n_obtidas = []
        for(i = 0; i < figs.length; i++){
          if(figs[i].jatenho == true){
            obtidas.push(i);
          } else{
            n_obtidas.push(i);
          }
        }
      }
      // obtidas = snapshot.val().obtidas;
      // console.log(obtidas);
    }, function(error){console.log('error');})
  // if(obtidas){
  //   obtidas = obtidas.split(",");
  //   for(i = 0; i < obtidas.length; i++){
  //     if(figs[Number(obtidas[i])]){
  //       figs[Number(obtidas[i])].jatenho = true;
  //       num++;
  //     }
  //   }
  // // }
  
  var max_y = figs[figs.length-1].y;
  but = new Button(max_x+sx/2-w/8, max_y+2*sy, w/8, 2*sy, "Salvar");

  faltantes = new Button(10+sx/2, max_y+2*sy, 6*falt_str.length, sy, falt_str);
  temos = new Button(10+sx/2, max_y+3*sy, 6*tem_str.length, sy, tem_str);

  select = new Button(max_x+sx/2-w/8-w/16-4*draw_str[0].length, max_y+2*sy, 4*draw_str[0].length,
  2*sy, draw_str[0]);

  box = new Button(max_x+sx/2-w/8-w/16-4*draw_str[0].length-w/4-16, max_y+2*sy, w/4, sy, "");

  bxbt = new Button(max_x+sx/2-w/8-w/16-4*draw_str[0].length-w/4-16, max_y+3*sy, w/4, sy, "OK");
}

function draw() {
  background(190, 50, 255);

  if(draw_all === 1){
    for(i = 0; i < numero_de_figurinhas; i++){
      figs[i].render();
    }
  } else{
    for(i = 0; i < n_obtidas.length; i++){
      figs[n_obtidas[i]].render(figs[i].x, figs[i].y);
    }
  }

  but.render();

  falt_str = "Faltam " + (numero_de_figurinhas - num) + " figurinhas";
  faltantes.render(falt_str);
  tem_str = "Temos " + num + " figurinhas";
  temos.render(tem_str);

  select.render();

  box.render();
  bxbt.render();
  // // console.log(num);
  // // noLoop();
}

function mousePressed(){
  var x = Math.round(mouseX);
  var y = Math.round(mouseY);
  console.log(x);
  console.log(y);
  if(draw_all === 1){
    for(i = 0; i < figs.length; i++){
      if(figs[i].clicked(x, y)){
        figs[i].jatenho = !figs[i].jatenho;
        if(figs[i].jatenho)
          num++;
        else
          num--;
      }
    }
  } else{
    for(i = 0; i < n_obtidas.length; i++){
      if(figs[n_obtidas[i]].clicked(x, y)){
        figs[n_obtidas[i]].jatenho = !figs[n_obtidas[i]].jatenho;
        if(figs[n_obtidas[i]].jatenho)
          num++;
        else
          num--;
      }
    }
  }
  if(but.clicked(x, y)){
    obtidas = []
    n_obtidas = []
    for(i = 0; i < figs.length; i++){
      if(figs[i].jatenho == true){
        obtidas.push(i);
      } else{
        n_obtidas.push(i);
      }
    }
    // localStorage.setItem("obtidas", obtidas);
    saveToFirebase(obtidas);
    console.log("Saving");
    but.render("Salvo", but.sx);
  } else{
    but.render("Salvar", but.sx);
  }

  if(select.clicked(x, y)){
    if(draw_all === 1){
      draw_all = 0;
      select.render(draw_str[1], 4*draw_str[1].length);
    } else{
      draw_all = 1;
      select.render(draw_str[0], 4*draw_str[0].length);
    }
  }

  if(box.clicked(x, y)){
    escrevendo = 1;
  } else if (!(bxbt.clicked(x, y))){
    escrevendo = 0;
  }

  if(bxbt.clicked(x, y)){
    bxbt.render("", bxbt.sx);
  }
}

function keyPressed(){
  if(escrevendo === 1){
    if(keyCode === ENTER){
      if(int(box.txt) >= 0 && int(box.txt) < 682){
        if(figs[int(box.txt)].jatenho === true){
          bxbt.render("Tem", bxbt.sx);
        } else{
          figs[int(box.txt)].jatenho = true;
          num++;
          bxbt.render("Ñ tem", bxbt.sx);
        }
      } else{
        bxbt.render("", bxbt.sx);
      }
    } else if(keyCode === BACKSPACE){
      if(box.txt !== ""){
        // if(box.txt.length === 1)
        //   box.render("", box.sx);
        // else
          box.render(box.txt.slice(0, box.txt.length-1), box.sx);
      }
    } else if(key >= '0' && key <= '9'){
      if(box.txt.length <= 3){
        box.render(box.txt + str(key), box.sx);
      }
    }
  }
}

function saveToFirebase(obtidas) {
  var obtidasObject = {
      obtidas: obtidas
  };

  firebase.database().ref('figurinhas-obtidas').set(obtidasObject)
      .then(function(snapshot) {
      }, function(error) {
          console.log('error');
      });
}