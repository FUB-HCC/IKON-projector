const fehler = 0.00000000001;
const verschiebung = 0.001; // für Hüllen mit nur 1 Punkt

///////////////// FLOAT //////////////////
class Float { // statische Klasse

  static isZero(x){
    return Math.abs(x) < fehler;
  }
  
  static equal(x1,x2){
    return Math.abs(x1-x2) < fehler;
  }
  
  static closeTo(x1,x2){
    return Math.abs(x1-x2) < verschiebung;
  }
  
  static getRandFloat(von,bis) {
    return Math.random()*(bis-von)+von;
  }// Aufruf: Float.getRandFloat(a,b)
  
}// Ende: Klasse Float


///////////////// INDEX //////////////////
class Index { // statische Klasse
  
  static curr(idx,l) {
    // gibt den aktuellen Index aus [0, l-1]
    return (idx +l) % l;
  }
  
  static pred(idx,l) {
    // gibt den Vorgänger des Index aus
    return (idx-1+l) % l;
  }

  static succ(idx,l) {
    // gibt den Nachfolger des Index aus
    return (idx+1) % l;
  }
  
  static equal(idx1, idx2){
    return Math.floor(Math.abs(idx1 - idx2)) == 0;
  }
  
  static getRandInt(von,bis) {
    return Math.floor(Math.random()*(bis-von+1)+von);
  }
}// Ende: Klasse Index


class Keywords {
  static getRandStr(researchArea,clusterNo){// wählt ein zufälliges Keyword für das Cluster i
    var keylist = {// gelb
      0: ["Chemie", "Formel", "Versuch", "Physik", "Gleichung", "Biologie", "Ergebnis", "Probe", "Messung", "Analyse", "Membran", "Arznei", "Wirkung", "Algebra", "Stochastik", "Evaluation", "Technik", "Innovation", "Forschung", "Methode", "Technologie"],
      
      1: ["Mineral", "Lava", "Gestein", "Kristall", "Eisen", "Element", "Erde", "Aufbau", "Schichten", "Abbau", "MRT", "Analyse", "Legierung", "Keramik", "Metall", "Herstellung", "Bearbeitung", "Schliff", "Reinheit", "Wachstum", "Verbindung", "Vulkan", "Beschaffenheit", "Material", "Stabilität", "Kreislauf", "Isotop", "Boden", "Wasser", "Biosphäre", "Erdkruste", "Fluid", "Flöz", "Arsen", "Chrom", "Selen", "Endlager", "Radionukliden", "Schadstoff", "Partikeln", "Kolloiden", "Ressource", "Rohstoff", "Untergrund", "Spurenmetall", "Sediment", "Stalagmit", "Bodenkunde"],
      
      2: ["Erdbeben", "Höhenlage", "Zusammensetzung", "Probe", "Erdoberfläche", "Schwerefeld", "Vermessung", "Grenzen", "Kartierung", "Planet", "Karte", "Beschaffenheit", "Einteilung", "Globus", "Breitengrad", "Längengrad", "Schwerkraft", "Staumaür", "Windkraftanlage", "Grundstück", "Feld", "Pol", "Rotationsellipsoid", "Kugel", "Festlegung", "Bestimmung", "Seimologie", "Dynamik", "Physik", "Atmosphäre", "Kontinentalplatte", "Tektonik", "verschiebung", "Erdkern", "Sedimentbecken", "Klima", "Gebirge", "Kontinent", "Rohstoff", "Umweltschutz", "Seismik", "Meteor"],
      
      3: ["Gestein", "Erdkruste", "Fossil", "MRT", "Einordnung", "Ausgrabung", "Mikroorganismus", "Mikroskoph", "Sediment", "Systematik", "versteinert", "Röntgen", "Sammlung", "Entstehung", "Beschaffenheit", "Entwicklung", "Tektonik", "Vulkan", "Pluton", "Statigraphie", "Datierung", "Baugrund"],
      
      4: ["Erwärmung", "Saürstoffgehalt", "CO2", "Ozon", "Wasser", "Riff", "Verschmutzung", "Erdatmosphäre", "Stickstoff", "O2", "O3", "Temperatur", "Wetter", "Nachhaltigkeit", "Umwelt", "Athmosphäre", "Gas", "Wolken", "Klima", "Messung", "Gewitter", "Tsunami", "Astronaut", "Astronomie", "Planet", "Fische", "Meeressäuger", "Strudel", "Salzwasser", "Ozean", "Expedition", "Tiefsee", "Schleppnetz", "Atlantik", "Plankton", "Fischfang", "Arktis", "Taucher", "Küste", "Plastikmüll", "Eisberg", "Wal", "Bohrinsel", "Umweltschutz", "Fisch"],
      
      // grün
      5: ["Gewebe", "DNA", "Nahrung", "Medizin", "Molekularbiologie", "Pharmazie", "Biodiversität", "Vermehrung", "Biochemie", "Zelle", "Umweltschutz", "Protein", "Genom", "Biodiversität", "Systembiologie", "Biomedizin", "Neurowissenschaft", "Infektionsbiologie", "Krebsforschung", "Alzheimer", "Krebs", "Einzelzellanalyse", "Grundlagenforschung", "Forschung", "Photonik", "Krankheit", "Ursache", "Molekül", "Lebensmittel", "Analyse", "Kultur", "Tomographie", "MRT", "Diagnostik", "Tumor", "Spektroskophie", "Blut", "Blutplasma", "Herz", "Kreislauf", "Proband", "Mikroskoph", "Organismus"],
      
      6: ["Tiger", "Fortpflanzung", "Milbe", "Sammlung", "Metazoa", "Animalia", "Anatomie", "Morphologie", "Physiologie", "Genetik", "Verbreitung", "Entwicklung", "Systematik", "Tier", "Verhalten", "Biologie", "Organismus", "Saügetier", "Wirbeltier", "Evolution", "Population", "Tierschutz", "Museum", "Biodiversität", "Ökosystem", "Raubtier", "Fisch", "Meeressäuger"],
      
      7: ["Humus", "Agrar", "Baumbestand", "Pfote", "Knochen", "Skelett", "Zahnmedizin", "Ernährung", "Lebensmittel", "Wald", "Plantage", "Landschaft", "Holz", "Nachhaltigkeit", "Ressource", "Boden", "Dünger", "Forst", "Obst", "Gemüse", "Knolle", "Saat", "Kultur", "Freiland", "Veterinärmedizin", "Tierarzt", "Anatomie", "Arznei", "Bakteriologie", "Botanik", "Futterpflanze", "Giftpflanze", "Heilpflanze", "Chirurgie", "Anästhesie", "Fleisch", "Hygiene", "Genetik", "Parasit", "Pathologie", "Pharmakologie", "Toxikologie", "Tierhaltung", "Tierschutz", "Seuche", "Virologie", "Zoologie", "Viehzucht", "Ackerbau", "Ökologie", "Trockenheit", "Getreide", "Eier", "Milch", "Fisch", "Bodenkunde", "Agrarpolitik", "Phytomedizin", "Nutztier", "Biometrie", "Grünland", "Futterbau", "Pflanzenschutz"],
      
      8: ["Trieb", "Sonnenlicht", "Wasser", "Wachstum", "Erde", "Zucht", "Botanik", "Weidepflanze", "Futterpflanze", "Stoffwechsel", "Wachstum", "Systematik", "Inhaltsstoffe", "Biozönose", "Osmoplasmose", "Fotosynthese", "Wurzel", "Blatt", "Frucht", "Saat", "Samen", "Kultur", "Pflanzenschutz", "Artenschutz", "Biodiversität", "Gene", "Landbau", "Gartenbau", "Gemüse", "Obst", "Knolle", "Landwirtschaft", "Freiland", "Biotechnologie"],
      
      // rot
      9: ["Sozialisation", "Gesellschaft", "Zusammenleben", "Institutionen", "Individuum", "Anthropologie", "Ethnologie", "Politik", "Religion", "Soziologie", "Sport", "Gericht", "Legislative", "Judikative", "Exekutive", "Polizei"],
      
      10: ["Schwinngung", "Guitarre", "Saite", "Note", "Takt", "Maske", "Licht", "Trauer", "Kommunikation", "Medium", "TV", "Kino", "Bühne", "Instrument", "Malerei", "Acryl", "Farben", "Film", "Video", "Raubkopie"],
      
      11: ["Politik", "Historiker", "König", "Schemata", "Einordnung", "Gemeinschaft", "Gesetze", "Literatur", "Ereignis", "Überlieferung", "Edda", "Vergangenheit", "Migration", "Epoche", "Dokument", "Schrift", "Herrscher", "Tyrann", "Kirche", "Krieg", "Schlacht", "Frieden", "Handel", "Lyrik", "Sprache"],
      
      12: ["12 gibt es nicht", "12 gibt es nicht", "12 gibt es nicht", "12 gibt es nicht", "12 gibt es nicht", "12 gibt es nicht"]
    };
    var keys = keylist[researchArea.id].filter(function(d,i){
      return i % 4 == clusterNo;// 4=clusterzahl
    });
    return keys[Index.getRandInt(0, keys.length-1)];
  }
  
  static getMajorWords(wordlist){
    var buckets = d3.nest()
      .key(function(d) {return d;})
      .entries(wordlist);
      
    var haeufigkeit = buckets.map(function(d){
        return {key: d.values.length, values: d.key};
    });
      
    haeufigkeit.sort(function(a,b){
      return b.key - a.key;
    });
    
    return haeufigkeit.slice(0,3);
  }
  
  static mergeKeywords(list){
    return [].concat.apply([], list);
  }
  
} // Ende: Klasse Keywords



///////////////////// POSITION /////////////////
class Position {
  constructor (x,y) {// x,y sind Doubles
    this.x = x;
    this.y = y;
  }
  
  equal(p){
    return Float.equal(this.x, p.x) && Float.equal(this.y, p.y);
  }
  
  closeTo(p) {
    return Float.closeTo(this.x, p.x) && Float.closeTo(this.y, p.y);
  }
  
  setX(x) {
    this.x = x;
  }
  
  setY(y) {
    this.y = y;
  }
  
  moveTo(pos){
    this.x = pos.x;
    this.y = pos.y;
  }
  
  getLength(){
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
  
  getNormvektor(){
    const laenge = this.getLength();
    return new Position(this.x/laenge, this.y/laenge);
  }
  
  mul(lambda){
    return new Position(this.x*lambda, this.y*lambda);
  }
  
  div(lambda){
    if (lambda == 0)
      throw new RangeError("Division durch Null");
    else
      return new Position(this.x/lambda, this.y/lambda);
  }
  
  add(v){
    return new Position(this.x+v.x, this.y+v.y);
  }
  
  sub(v){
    return new Position(this.x-v.x, this.y-v.y);
  }
  
  getDistance(v){ // Distanz zw. 2 Punkten
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return Math.sqrt(dx*dx + dy*dy);
  }
  
  getAngle() {// berechnet den Winkel zwischen x-Achse und dem Punkt
    // result: [0,2pi)
    if (Float.isZero(this.x))
      return Math.PI/2;
    else
      return (Math.atan2(this.y, this.x) + 2*Math.PI) % (2*Math.PI);
  }
  
  getMid(v){
    return this.add(v).mul(0.5);
  }
  
  getQuadrant() {// in welchem Quadrant sich der Punkt this befindet
    const winkel = this.getAngle();
    return Math.floor(winkel / Math.PI * 2) + 1;
  }
  
  getLinkeOrthogonale(){
    return new Position(this.y, -this.x);
  }
  
  getRechteOrthogonale(){
    return new Position(-this.y, this.x);
  }
  
  copy(){
    return new Position(this.x, this.y);
  }
  
  static getUrsprung(){
    return new Position(0, 0);
  }
} // Ende: Klasse Position


///////////////////// GERADE /////////////////
class Gerade{
  constructor(p1,p2){
    this.ort = p1;
    this.richtung = p2.sub(p1);
  }
  
  getPositionA(){
    return this.ort;
  }
  
  getPositionB(){
    return this.ort.add(this.richtung);
  }
  
  sindParalleel(g){
    const ri1 = this.richtung.getNormvektor();
    const ri2 = g.richtung.getNormvektor();
    return ri1.equal(ri2) || ri1.equal(ri2.mul(-1));
  }
  
  getAngle(){
    // berechnet den Winkel des Richtungsvektors
    const p1 = this.getPositionA();
    const p2 = this.getPositionB();
    if (Float.equal(p1.x, p2.x))
      return Math.PI/2;
    else
      return (Math.atan2(p2.y-p1.y, p2.x-p1.x) + 2*Math.PI) % (2*Math.PI);
  }
  
  getSchnittPunkt(g){
    if (this.sindParalleel(g))
      throw new Error("Es gibt keinen Schnittpunkt, da die Geraden paralleel sind.");
    else {// es gibt eine Lösung
      const ri1 = this.richtung;
      const ri2 = g.richtung;
      const deltaO = g.ort.sub(this.ort);
      var lambda2 = (deltaO.y*ri1.x - deltaO.x*ri1.y) / (ri2.x*ri1.y - ri2.y*ri1.x);
      var lambda1 = (deltaO.x - ri2.x*lambda2) / ri1.x;// forall ri1.x != 0
      var lambda = new Position(lambda1, lambda2);
      var sP = g.ort.add(g.richtung.mul(lambda.y));
      return sP;
    }
  }
  
  getClosestPoint(p){
    // berechnet den zu p dichtesten Punkt auf der Gerade
    const orthogonale = this.richtung.getRechteOrthogonale();
    const geradeP = new Gerade(p, orthogonale);
    try {
      return this.getSchnittPunkt(geradeP);
    }
    catch (err) {
      console.log(err.name + ': ' + err.message);
    }
  }
  
  getDistance(p){
    // berechnet den kürzesten Abstand vom Punkt p zu g
    const sP = this.getClosestPoint(p);
    return p.getDistance(sP);
  }
  
  getLength(){ // berechnet die Länge der durch die Geradenpunkte definierte Strecke
    return this.getPositionA().getDistance(this.getPositionB());
  }
  
  contains(p) {
    // berechnet, ob Punkt p auf der Geraden und innerhalb der Strecke liegt
    const pLiegtAufGerade = Float.isZero(this.getDistance(p));
    const dist1 = p.getDistance(this.getPositionA());
    const dist2 = p.getDistance(this.getPositionB());
    const length = this.getLength();
    return pLiegtAufGerade && dist1 <= length && dist2 <= length;
  }
} // Ende: Klasse Gerade




///////////////////// KNOTEN /////////////////
class Knoten {
  constructor(pos, id, clusterNo, researchArea, year, keywords){
    this.pos = pos; // [Position]
    this.id = id;   // Integer
    this.clusterNo = clusterNo;
    this.researchArea = researchArea;// {id, name, disziplin}
    this.year = year;
    this.keywords = keywords;
  }
  
  copy(){
    // falls der String kopiert werden muss: 
    // var newStr = (' ' + oldStr).slice(1);
    return new Knoten([this.pos[0].copy(), this.pos[1].copy()], this.id, this.clusterNo, this.researchArea, this.year, this.keywords);
  }
  
  equal(node) {
    return Index.equal(this.id, node.id);
  }
  
  moveTo(pos){// verschiebt die Knotenposition
    this.pos[0] = pos;
    this.pos[1] = pos;
  }
  
  moveBy(vektor) {
    this.pos[0] = this.pos[0].add(vektor);
    this.pos[1] = this.pos[1].add(vektor);
  }
  
  morphToArray(gridScatter) {// gridScatter € [0,1]
    // gibt den Knoten als Array aus. Wird für calculateHull() gebraucht
    var other = (gridScatter+1)%2;
    // die bevorzugten Positionen sind vorne
    return [this.pos[gridScatter].x, this.pos[gridScatter].y, this.pos[other].x, this.pos[other].y, this.id, this.clusterNo, this.researchArea, this.year, this.keywords];
  }
  
  static morphBack(arr, gridScatter) { // erstellt aus dem Array einen Knoten. Wird für calculateHull() gebraucht
    if (arr.length != 9)
      throw Error("Das Array hat nicht die richtige Anzahl an Informationen, um in einen Knoten gewandelt zu werden.");
    else {
      var k = 2*gridScatter;
      return new Knoten([new Position(arr[(0+k)%4], arr[(1+k)%4]), new Position(arr[(2+k)%4], arr[(3+k)%4])], arr[4], arr[5], arr[6], arr[7], arr[8]);
    }
  }
} // Ende: Knoten-Klasse


///////////////////// POLYGON /////////////////
class Polygon {
  constructor(vertices){
    this.vertices = vertices; // vertices = [Knoten]
  }
  
  getLength(){
    return this.vertices.length;
  }
  
  indexOfNode(v){
    return this.vertices.findIndex(function(k){return k.equal(v);});
  }
  
  hasSameClusterNoAs(v){
    for (i in this.vertices) {
      if (this.vertices[i].clusterNo == v.clusterNo)
        return idx;
    }
    return -1;
  }
  
  contains(v){
    return this.vertices.indexOfNode(v) >= 0;
  }
  
  copy(){
    return new Polygon(this.vertices.map(
      function(node){return node.copy();}
    ));
  }
  
  getHighestX(gridScatter){// gridScatter € [0,1]
    // gibt Index und Wert der Position mit höchstem x aus
    if (this.getLength() == 0)
       throw new Error("Es existiert kein Knoten, weswegen kein Maximum ermittelt werden kann.");
    else {
      var max, idx, point;
      this.vertices.forEach(function(d,i){
        if (max == undefined || d.pos[gridScatter].x > max.pos[gridScatter].x || d.pos[gridScatter].x == max.pos[gridScatter].x && d.pos[gridScatter].y > max.pos[gridScatter].y // nimmt den obersten, wenn mehrere die gleiche x-Pos haben
        ) {
          max = d;
          idx = i;
        }
      });
      return {p: max, i:idx};
    }
  }
  
  getSchwerpunkt(gridScatter) {
    // berechnet den Mittelpunkt einer Punktemenge
    if (this.getLength() == 0)
       throw new Error("Es existiert kein Knoten, weswegen kein Schnittpunkt errechnet werden kann.");
    else { // es existiert mind. 1 Knoten
      var m = new Position(0,0);// neutrales Element der Addition
      this.vertices.forEach(function(v){
        m = m.add(v.pos[gridScatter]);
      });
      try {
        return m.div(this.vertices.length);
      }
      catch (err) {
        console.log(err.name + ': ' + err.message);
      }
    }
  }
  
  putUhrzeigersinn(gridScatter){
    // ordnet die Knoten im Uhrzeigersinn um den Mittelpunkt an
    const s = this.getSchwerpunkt(gridScatter);
    this.vertices.sort(
      // ordnet die Punkte im Uhrzeigersinn an
      function(a,b){
        const g1 = new Gerade(s, a.pos[gridScatter]);
        const g2 = new Gerade(s, b.pos[gridScatter]);
        return g2.getAngle() - g1.getAngle();}
    );
//     if (this.vertices[0].clusterNo == 1)
//       console.log("uhrzeigersinn",this.vertices);
  }
  
  sort(gridScatter) {// gridScatter € [0,1]
    // ordnet die Knoten im Uhrzeigersinn um den Mittelpunkt an, angefangen, beim größten x
    // wenn mehrere Punkte x als Maximum haben, wird der untersete (kleinstes y) gewählt
    this.putUhrzeigersinn(gridScatter);
    var maxX = this.getHighestX(gridScatter);
//     if (maxX.p.clusterNo == 1)
//       console.log(maxX);
    this.vertices.slice(maxX.i).concat(this.vertices.slice(0,maxX.i));
  }
  
  calculateHull(gridScatter) { // berechnet eine konvexe Hülle
    if (this.getLength() == 0)
      throw new Error("Es existiert kein Knoten, weswegen keine Hülle berechnet werden kann.");
    else if (this.getLength() == 1) {
      // kopiert den Punkt mit leichtem Versatz, weil mind. 2 Punkte für eine Hülle notwendig sind
      var knoten = this.vertices[0].copy();
      knoten.moveBy(new Position(verschiebung, verschiebung));
      return new Polygon([this.vertices[0], knoten]);
    }
    else { // mind. 2 Knoten
      // ordnet die Punkte im Uhrzeigersinn an und übergibt sie als [x,y]-Koordinate an die Funktion d3.polygonHull()
      //this.sort(gridScatter);
      var hull = (this.getLength() < 3)? this.vertices : d3.polygonHull(this.vertices.map(function(d){
        return d.morphToArray(gridScatter);
      })).map(function(d){return Knoten.morphBack(d, gridScatter);});
      return new Polygon(hull);
    }
  }
  
  makeHull2Path(xScale, yScale, gridScatter) {
    var string = "M ";
    this.vertices.forEach(function(d){
      string = string + xScale(d.pos[gridScatter].x) + " ";
      string = string + yScale(d.pos[gridScatter].y) + " L ";
    });
    // schneidet das letzte "L " ab und ersetzt es durch " Z"
    string = string.slice(0,string.length-2) + " Z ";
    return string;
  }
  
  moveBy(richtung){
    this.vertices.map(function(n){return n.moveBy(richtung)});
  }
  
  compensateNodeNumber(newPoly, gridScatter) {
    // füllt das Polygon mit geringerer Knotenzahl auf
    // wird von der Funktion huellenAbgleichen aufgerufen, d.h. die nicht-smoothen(!) Hüllen liegen im Uhrzeigersinn vor und haben die gleichen Anfangsknoten
    // erhält ein Polygon und gibt 2 Polygone aus
    var smallerP, biggerP, fst, snd;
    if (this.getLength() < newPoly.getLength()) {// füllt this.vertices auf
      smallerP = this.copy().vertices;
      biggerP = newPoly.copy().vertices;
      fst = smallerP;
      snd = biggerP;
    }
    else {// füllt newPoly.vertices auf
      smallerP = newPoly.copy().vertices;
      biggerP = this.copy().vertices;
      fst = biggerP;
      snd = smallerP;
    }
    var diff = Math.abs(biggerP.length - smallerP.length);
    // findet die Stellen, die aufgefüllt werden müssen
    var i=0, pred, curr, succ, gerade, posBetween, d1, d2, newNode;
    while (i < biggerP.length && diff > 0) {
      if (i >= smallerP.length || ! biggerP[i].equal(smallerP[i])) {
        // hier muss ein neuer Knoten berechnet werden
        newNode = biggerP[i].copy();
        pred = Index.pred(i, smallerP.length);
        curr = Index.curr(i, smallerP.length);
        succ = Index.succ(i, smallerP.length);
        gerade = new Gerade(smallerP[pred].pos[gridScatter], smallerP[curr].pos[gridScatter]);
        // sucht den dichtesten Punkt auf der Geraden
        posBetween = gerade.getClosestPoint(biggerP[i].pos[gridScatter]);
        // prüft, ob der Punkt auf der Strecke zw. pred-curr liegt
        if (!gerade.contains(posBetween)) {
          // Abstände der Außenpunkte zum errechneten Punkt
          d1 = biggerP[i].pos[gridScatter].getDistance(smallerP[curr].pos[gridScatter]);
          d2 = biggerP[i].pos[gridScatter].getDistance(smallerP[pred].pos[gridScatter]);
          // dichtester Außenpunkt wird kopiert
          posBetween = smallerP[(d1 < d2 ? curr : pred)].pos[gridScatter].copy();
        }
        newNode.pos[gridScatter] = posBetween;
        smallerP.splice(i,0, newNode);
        diff --;
      }
    i = i+1;
    }
    return [new Polygon(fst), new Polygon(snd)];
  }
  
  huellenAbgleichen(newPoly, gridScatter){
    // beide nicht-smoothen(!) Hüllen müssen im Uhrzeigersinn vorliegen, findet gleiche Punkte und bringt sie an den gleichen Index, fügt ggf. fehlende Punkte hinzu
    var idxOld = 0, idxNew = 0; // Anfangsindex
    var abbrechen = false;
    if (this.getLength() == 0 || newPoly.getLength() == 0)
      throw new Error("Eines der Polygone hat keine Knoten. Darum kann kein Vergleich stattfinden.");
    else {
      // sucht gleiche Knoten
      var erstesElem = this.vertices[0];
      var huellen;
      for (var i=0; i<this.getLength(); i++){
        for (var j=0; j<newPoly.getLength(); j++) {
          if (this.vertices[i].equal(newPoly.vertices[j])) {
            idxOld = i;
            idxNew = j;
            abbrechen = true;
            break;// doppeltes break funktioniert nicht
          }
        }
        if (abbrechen)
          break;
      }// hat gleiche Punkte gefunden
      // bringt diese an die Position 0
      var polygon1 = this.copy();
      var polygon2 = newPoly.copy();
      if (idxOld != idxNew || idxOld != 0) {
        polygon1.vertices = this.vertices.slice(idxOld);
        polygon1.vertices = polygon1.vertices
          .concat(this.vertices.slice(0, idxOld));
        polygon2.vertices = newPoly.vertices.slice(idxNew);
        polygon2.vertices = polygon2.vertices
          .concat(newPoly.vertices.slice(0, idxNew));
      }
      // füllt kürzeres Polygon mit weiteren Punkten auf
      if (polygon1.getLength() != polygon2.getLength()) {
        huellen = polygon1.compensateNodeNumber(polygon2, gridScatter);
        polygon1.vertices = huellen[0].vertices;
        polygon2.vertices = huellen[1].vertices;
      }
      // bringt das ursprüngliche Element wieder nach vorne
      idxOld = 0;
      while (! polygon1.vertices[idxOld].equal(erstesElem) && idxOld < polygon1.getLength())
        idxOld++;
      if (idxOld > 0) {
        polygon1.vertices = polygon1.vertices.slice(idxOld)
          .concat(polygon1.vertices.slice(0, idxOld));
        polygon2.vertices = polygon2.vertices.slice(idxOld)
          .concat(polygon2.vertices.slice(0, idxOld));
      }
      return [polygon1, polygon2];
    }// ende else
  }
  
//   delUnneccessaryNodes(gridScatter){
//     // löscht zuvor erstellte, doppelte Knoten, die nun überflüssig sind
//     var i = 0;
//     var pred, succ, geradePredI;
//     var verts = this.copy().vertices;
//     while (i < verts.length && verts.length > 2) {// wenn nur 2 Punkte vorhanden, sollen diese nicht gelöscht werden, da mind. 2 für eine Hülle notwendig sind
//       pred = verts[Index.pred(i, verts.length)]; // Knoten
//       succ = verts[Index.succ(i, verts.length)];
//       geradePredI = new Gerade(pred.pos[gridScatter], succ.pos[gridScatter]);
//       // gleiche Elemente werden nebeneinander sein
//       if (geradePredI.contains(verts[i].pos[gridScatter]))
//         verts.splice(i, 1);
//       else if (verts[i].equal(succ))
//         verts.splice(i, 1);
//       else if (verts[i].equal(pred))
//         verts.splice(i, 1);
//       else
//         i++;
//     }
//     return new Polygon(verts);
//   }
  
  mapToNodes(fkt){
    this.vertices.map(function(n){fkt(n);});
  }
  
//   moveVertsCloserTogether(faktor){// faktor € (0, 1]
//     // die Knoten rücken dichter zusammen
//     var mid = this.getSchwerpunkt();
//     this.vertices.forEach(function(v){
//       var g = new Gerade(v.pos, mid);
//       g.richtung = g.richtung.mul(faktor);
//       v.moveTo(g.getPositionB());
//     });
//   }
  
} // Ende: Polygon-Klasse


////////////////////// CLUSTER ///////////////////
class Cluster {
  constructor(clusterID, polygons){
    this.id = clusterID;
    this.polygons = polygons; // [Polygon], alle beinhalteten Knoten
  }
  
  mapToPolygons(fkt){
    return this.polygons.map(fkt);
  }
  
  contains(node) {
    return this.positionOfNode(node) != null;
  }
  
  getKeywords(){
    return Keywords.getMajorWords(
      Keywords.mergeKeywords(
        this.mapToPolygons(function(p){
          return p.vertices.map(function(d){return d.keywords;})
        })
      )
    ).map(function(d){return d.values;}).join(", ");
  }
  
  getHullVertices(gridScatter){
    return this.mapToPolygons(function(p){
      return p.calculateHull(gridScatter);
    }); // [Hulls]
  }
  
  getLength(){// gibt die Anzahlan Knoten aller Polygone summiert aus
    return this.mapToPolygons(function(p){return p.getLength()})
      .reduce(function(akk,i){return akk+i;},0);
  }
  
  makeHull2Path(xScale, yScale, gridScatter){
    return this.getHullVertices(gridScatter)
      .map(function(hull){return hull.makeHull2Path(xScale, yScale, gridScatter)})
      .join(" ");
  }
  
  getSchwerpunkt() {// aller Knoten
    return this.reduceToOnePolygon().getSchwerpunkt();
  }
  
  reduceToOnePolygon(){
    return new Polygon(this
      .mapToPolygons(function(p){return p.vertices;})
      .reduce(function(akk,p){return akk.concat(p)},[])
    );
  }
  
  moveBy(richtung) {
    this.mapToPolygons(function(p){return p.moveBy(richtung);});
  }
  
//   positioniereCluster(anzCluster) {
//     // je nach ID wird das Cluster um den Mittelpunkt des SVG platziert
//     //console.log(width,height);
//     const mid = new Position(width/2, height/2);
//     const angle = parseFloat(this.id) / anzCluster * 2*Math.PI;
//     const richVek = new Position(Math.cos(angle)*width/4, Math.sin(angle)*height/4);
//     const newPos = mid.add(richVek);
//     var g = new Gerade(this.getSchwerpunkt(), newPos);
//     // console.log("id",this.id, "mid",mid, "angle",angle, "richVek",richVek, "newPos",newPos, "g.rich", g.richtung);
//     this.moveBy(g.richtung);
//   }
//   
//   positionOfNode(v){
//     var idx;
//     for (i=0; i < this.polygons.length; i++) {
//       idx = this.polygons[i].indexOfNode(v);
//       if (idx >= 0)
//         return {poly: i, idx: idx};
//     }
//     return null;
//   }
//   
//   positionOfNodeInFirstPoly(v){
//     return this.polygons[0].indexOfNode(v);
//   }
//   
//   polygonOfSameClusterNo(v){
//     var idx;
//     for (i=1; i< this.polygons.length; i++) {
//       idx = this.polygons[i].hasSameClusterNoAs(v);
//       if (idx >= 0)
//         return {poly: i, idx: idx};
//     }
//     return null;
//   }
//   
//   moveVertsCloserTogether(faktor) {
//     this.mapToPolygons(function(p){
//       return p.moveVertsCloserTogether(faktor);
//     });
//   }
  
  copy(){
    return new Cluster(this.id, this.mapToPolygons(function(p){
      return p.copy();
    }));
  }
  
}// Ende: Klasse Hull


class Nest {// [Cluster_1,... , Cluster_n]
  constructor(dataset){
    this.nest = d3.nest()
      // http://bl.ocks.org/donaldh/2920551
      // https://github.com/d3/d3-collection#nests
      .key(function(d) {return d.clusterNo;})
      .sortKeys(d3.ascending)
      .entries(dataset)
      .map(function(d){
        // d = {key: "1", values: [P_1,...,P_n]}, k_i € Polygon
        return new Cluster(parseInt(d.key), [new Polygon(d.values)]);
      });
  }
  
  getLength(){
    return this.nest.length;
  }
  
  mapToCluster(fkt){
    return this.nest.map(fkt);
  }
  
  copy() {// kopiert this.nest = [C1, C2, ...]
    var n = new Nest([]);
    n.nest = this.mapToCluster(function(c){
      return c.copy();
    });
    return n;
  }
  
  flatNestToCluster(clusterNo){// vereinigt alle Cluster zu einem
    var vertices = [];
    this.nest.forEach(function(c){
      vertices = vertices.concat(c.reduceToOnePolygon().vertices);
    });
    return new Cluster(clusterNo, [new Polygon(vertices)]);
  }
  
  makeHull2Path(scale){
    var path = "";
    this.nest.forEach(function(cl){
      path = path + cl.getHullVertices().map(function(hull){return hull.makeHull2Path(scale)}).join(" ");
    });
    return path;
  }
  
//   positionOfNodeInFirstPolys(v){
//     var idx;
//     for (i=0; i < this.nest.length; i++) {
//       idx = this.nest[i].positionOfNodeInFirstPoly(v)
//       if (idx >= 0)
//         return {nestIdx: i, polyIdx: idx};
//     }
//     return null;
//   }
//   
//   contains(node) {
//     return this.positionOfNode(node) != null;
//   }
//   
//   findClusterOfID(id){// [-1, nest.length)
//     return this.nest.findIndex(function(c){return c.id == id});
//   }
//   
//   createTransitionNests(newNests){
//     // erstellt Kopien der Nester, um darin arbeiten zu können
//     var oldNests = this.copy();
//     var newNests = newNests.copy();
//     
//     // durchsucht oldNests nach jedem der Knoten in newNests
//     // und ordnet die Polygone den Clustern neu zu
//     var cluNew, fstPolNew, nNew, anzPoly, polyNew, huellen;
//     var cluOld, fstPolOld, nOld, iOld, iOldTarget, cluOldTarget, pOld, polyOld;
//     // durchläuft newNests
//     for (var iNew in newNests.nest) {// durchläuft newNests
//       cluNew = newNests.nest[iNew];
//       fstPolNew = cluNew.polygons[0];
//       for (var jNew in fstPolNew.vertices) {// durchläuft das 1. Polygon
//         nNew = fstPolNew.vertices[jNew];
//         iOld = oldNests.positionOfNodeInFirstPolys(nNew);
//         if (iOld == null) {// Knoten ex. nicht in oldNests
//           iOldTarget = oldNests.findClusterOfID(nNew.clusterNo);
//           if (iOldTarget == -1) {// Cluster ex. nicht
//             cluOldTarget = new Cluster(nNew.clusterNo, [new Polygon([nNew])]);
//             oldNests.nest.push(cluOldTarget);
//           }
//           //else {} // Cluster existiert breits. Nichts zu tun
//         } // Ende IF Knoten ex. nicht in oldNests
//         else {// Knoten ex. bereits in oldNests
//           // iOld = {nestIdx, polyIdx}
//           cluOld = oldNests.nest[iOld.nestIdx];
//           fstPolOld = cluOld.polygons[0];
//           nOld = fstPolOld.vertices[iOld.polyIdx];
//           if (nOld.clusterNo != nNew.clusterNo) {// ungleiche clusterNo
//             iOldTarget = oldNests.findClusterOfID(nNew.clusterNo);
//             if (iOldTarget == -1) {// Cluster ex. nicht
//               cluOldTarget = new Cluster(nNew.clusterNo, []);
//               oldNests.nest.push(cluOldTarget);
//             }
//             else {// Cluster ex. breits
//               // muss Cluster der ID nNew.clusterNo kopieren
//               cluOldTarget = oldNests.nest[iOldTarget];
//               // ob bereits Polygon gleicher Clusterno ex.
//               pOld = cluOldTarget.polygonOfSameClusterNo(nNew);
//               // pOld = {poly, idx}
//               if (pOld == null) {// es ex. kein Cluster gleicher Nr.
//                 cluOldTarget.polygons.push(fstPolOld.copy());
//               }
//               // else {} es ex. ein Cluster gleicher Nr. Nichts zu tun
//             }
//           }// Ende IF ungleiche ClusterNo
//           // else {} // gleiche clusterNo. Nichts zu tun
//         } // Ende: ELSE Knoten ex. in oldnests
//       }// Ende: Durchlauf des 1. Polygons von newNests
//     }// Ende: Durchlauf newNests
//     for (var iNew in newNests.nest) {// durchläuft newNests
//       cluNew = newNests.nest[iNew];
//       fstPolNew = cluNew.polygons[0];
//       iOld = oldNests.findClusterOfID(cluNew.id);
//       cluOld = oldNests.nest[iOld];
//       anzPoly = cluOld.polygons.length;
//       for (var i = 1; i < anzPoly; i++) {
//         // vervielfacht 1. Polygon in newNests
//         cluNew.polygons.push(fstPolNew.copy());
//       }
//       for (var i = 0; i < anzPoly; i++) {
//         // passt Polygone an
//         polyNew = cluNew.polygons[i];
//         polyOld = cluOld.polygons[i];
//         huellen = polyOld.huellenAbgleichen(polyNew);
//         cluNew.polygons[i] = huellen[0];
//         cluOld.polygons[i] = huellen[1];
//       }
//     }
//     return [oldNests, newNests];
//   }// Ende der Funktion createTransitionNests
  
} // Ende: Klasse Nest
