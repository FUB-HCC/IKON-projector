/**
 * Summary. (use period)
 *
 * Description. Dieses Dokument enthält alle Klassen, welche Hüllentransformationen unterstützen.
 *
 * @link   https://make.wordpress.org/core/handbook/best-practices/inline-documentation-standards/javascript/
 * @file   This files defines the MyClass class.
 * @author Anja Wolffgramm
 * @since  2019
 */

const fehler = 0.00000000001;
const verschiebung = 0.001; // für Hüllen mit nur 1 Punkt

///////////////// FLOAT //////////////////
class Float { // statische Klasse

  /**
  * @class Float
  * @param {Double} x
  * @return {Boolean} Prüft, ob ein Double gleich Null ist. Toleriert einen kleinen Fehler
  */
  static isZero(x){
    return Math.abs(x) < fehler;
  }
  
  /**
  * @class Float
  * @param {Double} x1
  * @param {Double} x2
  * @return {Boolean} Prüft, ob zwei Doubles gleich sind. Toleriert einen kleinen Fehler
  */
  static equal(x1,x2){
    return Math.abs(x1-x2) < fehler;
  }
  
  /**
  * @class Float
  * @param {Double} x1
  * @param {Double} x2
  * @return {Boolean} Prüft, ob sich zwei Doubles sehr ähnlich sind
  */
  static closeTo(x1,x2){
    return Math.abs(x1-x2) < verschiebung;
  }
  
  /**
  * @class Float
  * @param {Double} von - Minimum
  * @param {Double} bis - Maximum
  * @return {Double} Gibt eine Zufallszahl im Intervall [von, bis] aus, Aufruf: Float.getRandFloat(a,b)
  */
  static getRandFloat(von,bis) {
    return Math.random()*(bis-von)+von;
  }
  
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
  
  /**
  * @class Index
  * @param {Integer} von - Minimum
  * @param {Integer} bis - Maximum
  * @return {Integer} Gibt eine Zufallszahl im Intervall [von, bis] aus, Aufruf: Index.getRandInt(a,b)
  */
  static getRandInt(von,bis) {
    return Math.floor(Math.random()*(bis-von+1)+von);
  }
}// Ende: Klasse Index


///////////////////// POSITION /////////////////
class Position {
  /**
  * @class Position
  * @param {Double} x Koordinate
  * @param {Double} y Koordinate
  */
  constructor (x,y) {
    this.x = x;
    this.y = y;
  }
  
  /**
  * @class Position
  * @param {Position} p
  * @return {Boolean} Gibt true aus, wenn sich die Positionen sehr nahe sind. Fehler: 0.00000000001
  */
  equal(p){
    return Float.equal(this.x, p.x) && Float.equal(this.y, p.y);
  }
  
  /**
  * @class Position
  * @param {Position} p
  * @return {Boolean} Gibt true aus, wenn sich die Positionen sehr nahe sind. Fehler: 0.001, wird benötigt, um Knoten im Polygon zu kopieren und leicht zu verschieben. Wenn sie zu dicht sind, wird der Pfad nicht gezeichnet.
  */
  closeTo(p) {
    return Float.closeTo(this.x, p.x) && Float.closeTo(this.y, p.y);
  }
  
  setX(x) {
    this.x = x;
  }
  
  setY(y) {
    this.y = y;
  }
  
  /**
  * @class Position
  * @param {Position} pos - Die neue Position
  */
  moveTo(pos){
    this.x = pos.x;
    this.y = pos.y;
  }
  /**
  * @class Position
  * @return {Double} Gibt den Abstand zum Ursprungspunkt aus
  */
  getLength(){
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
  
  /**
  * @class Position
  * @return {Position} normiert den Vektor auf Länge 1.
  */
  getNormvektor(){
    const laenge = this.getLength();
    return new Position(this.x/laenge, this.y/laenge);
  }
  
  /**
  * @class Position
  * @param {Double} lambda - Skalar
  * @return {Position} multipliziert den Vektor mit einem Skalar
  */
  mul(lambda){
    return new Position(this.x*lambda, this.y*lambda);
  }
  
  div(lambda){
    if (lambda == 0)
      throw new RangeError("Division durch Null");
    else
      return new Position(this.x/lambda, this.y/lambda);
  }
  
  /**
  * @class Position
  * @param {Position} v - zu addierender Vektor
  * @return {Position} addiert zwei Vektoren
  */
  add(v){
    return new Position(this.x+v.x, this.y+v.y);
  }
  
  sub(v){
    return new Position(this.x-v.x, this.y-v.y);
  }
  
  /**
  * @class Position
  * @param {Position} v
  * @return {Double} gibt den Abstand zwischen 2 Punkten aus
  */
  getDistance(v){
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return Math.sqrt(dx*dx + dy*dy);
  }
  
  /**
  * @class Position
  * @return {Double} berechnet den Winkel zwischen x-Achse und dem Punkt, result in [0,2pi)
  */
  getAngle() {
    /*if (Float.isZero(this.x))
      return Math.PI/2;
    else
      */
    return (Math.atan2(this.y, this.x) + 2*Math.PI) % (2*Math.PI);
  }
  
  /**
  * @class Position
  * @param {Position} v
  * @return {Position} berechnet den Mittelpunkt zwischen 2 Punkten
  */
  getMid(v){
    return this.add(v).mul(0.5);
  }
  
  /**
  * @class Position
  * @return {Integer} gibt den Quadranten aus, in welchem sich der Punkt befindet, result in [1,2,3,4]
  */
  getQuadrant() {
    const winkel = this.getAngle();
    return Math.floor(winkel / Math.PI * 2) + 1;
  }
  
  /**
  * @class Position
  * @return {Position} berechnet die linke Orthogonale gleicher Länge
  */
  getLinkeOrthogonale(){
    return new Position(this.y, -this.x);
  }
  
  /**
  * @class Position
  * @return {Position} berechnet die rechte Orthogonale gleicher Länge
  */
  getRechteOrthogonale(){
    return new Position(-this.y, this.x);
  }
  
  /**
  * @class Position
  * @return {Position} kopiert diesen Vektor
  */
  copy(){
    return new Position(this.x, this.y);
  }
  
  static getUrsprung(){
    return new Position(0, 0);
  }
} // Ende: Klasse Position


///////////////////// GERADE /////////////////
class Gerade{
  /**
  * @class Gerade
  * @param {Position} p1 - Ortsvektor (Position A)
  * @param {Position} p2 - 2. Vektor (Position B)
  */
  constructor(p1,p2){
    this.ort = p1;
    this.richtung = p2.sub(p1);
  }
  
  /**
  * @class Gerade
  * @return {Position} gibt den Ortsvektor (p1) zurück
  */
  getPositionA(){
    return this.ort;
  }
  
  /**
  * @class Gerade
  * @return {Position} gibt den Vektor p2 zurück
  */
  getPositionB(){
    return this.ort.add(this.richtung);
  }
  
  /**
  * @class Gerade
  * @param  {Gerade} g - andere Gerade
  * @return {Boolean} prüft, ob die Geraden paralllel zueinander sind
  */
  sindParalleel(g){
    const ri1 = this.richtung.getNormvektor();
    const ri2 = g.richtung.getNormvektor();
    return ri1.equal(ri2) || ri1.equal(ri2.mul(-1));
  }
  
  /**
  * @class Gerade
  * @return {Double} berechnet den Winkel des Richtungsvektors zur x-Achse
  */
  getAngle(){
    const p1 = this.getPositionA();
    const p2 = this.getPositionB();
//     if (Float.equal(p1.x, p2.x))
//       return Math.PI/2;
//     else
    return (Math.atan2(p2.y-p1.y, p2.x-p1.x) + 2*Math.PI) % (2*Math.PI);
  }
  
  /**
  * @class Gerade
  * @param  {Gerade} g - andere Gerade
  * @return {Position} berechnet den Schnittpunkt zweier Geraden
  */
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
  
  /**
  * @class Gerade
  * @param  {Position} p - Punkt
  * @return {Position} berechnet den zu P dichtesten Punkt, der auf der Geraden liegt
  */
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
  
  /**
  * @class Gerade
  * @param  {Position} p - Punkt
  * @return {Double} berechnet den kürzesten Abstand von p zur Geraden
  */
  getDistance(p){
    const sP = this.getClosestPoint(p);
    return p.getDistance(sP);
  }
  
  /**
  * @class Gerade
  * @return {Double} berechnet die Länge der durch die Geradenpunkte definierte Strecke
  */
  getLength(){
    return this.getPositionA().getDistance(this.getPositionB());
  }
  
  /**
  * @class Gerade
  * @param  {Position} p - Punkt
  * @return {Boolean} prüft, ob der Punkt p auf der Geraden, innerhalb der durch die Geradenpunkte definierte Strecke liegt
  */
  contains(p) {
    const pLiegtAufGerade = Float.isZero(this.getDistance(p));
    const dist1 = p.getDistance(this.getPositionA());
    const dist2 = p.getDistance(this.getPositionB());
    const length = this.getLength();
    return pLiegtAufGerade && dist1 <= length && dist2 <= length;
  }
} // Ende: Klasse Gerade




///////////////////// KNOTEN /////////////////
class Knoten {
  /**
  * @class Knoten
  * @param {Position} pos - Mittelpunkt des Kreises
  * @param {Integer}  id  - ID
  * @param {Integer}  clusterNo - Nummer des zugrhörigen Clusters
  * @param {String}   researchArea - zugrhöriges Forschungsgebiet
  * @param {Integer}  year - Jahr des Projekts
  * @param {Object}   keywords - [String]
  */
  constructor(pos, id, clusterNo, researchArea, year, keywords, title){
    this.pos = pos; // Position
    this.id = id;   // Integer
    this.clusterNo = clusterNo;
    this.researchArea = researchArea;// {id, name, disziplin}
    this.year = year;
    this.keywords = keywords;
    this.title = title;
  }
  
  /**
  * @class Knoten
  * @return {Knoten} kopiert den Knoten und seine Position, nicht aber die anderen Objekte
  */
  copy(){
    // falls der String kopiert werden muss: 
    // var newStr = (' ' + oldStr).slice(1);
    return new Knoten(this.pos.copy(), this.id, this.clusterNo, this.researchArea, this.year, this.keywords, this.title);
  }
  
  /**
  * @class Knoten
  * @param  {Knoten} node
  * @return {Boolean} prüft, ob die Knoten die gleiche ID haben
  */
  equal(node) {
    return Index.equal(this.id, node.id);
  }
  
  /**
  * @class Knoten
  * @param  {Position} pos - neue Position
  * @return {} verschiebt den Knoten auf pos
  */
  moveTo(pos){// verschiebt die Knotenposition
    this.pos = pos;
  }
  
  /**
  * @class Knoten
  * @param  {Position} pos - neue Richtung
  * @return {} verschiebt den Knoten um den Vektor pos
  */
  moveBy(vektor) {
    this.pos = this.pos.add(vektor);
  }
  
  /**
  * @class Knoten
  * @return {Object} gibt den Knoten als Array aus, wobei die ersten beiden Stellen die x- und y-Koordinaten sind. Wird für calculateHull() gebraucht. Der Knoten wird in ein Array gepackt, result: [x, y, id, clusterNo, researchArea, year, keywords]
  */
  morphToArray() {
    return [this.pos.x, this.pos.y, this.id, this.clusterNo, this.researchArea, this.year, this.keywords, this.title];
  }
  
  /**
  * @class Knoten
  * @static 
  * @param  {Object} arr - Array der Form [x, y, id, clusterNo, researchArea, year, keywords], |arr|=7
  * @return {Knoten} wandelt das Array in einen Knoten zurück
  */
  static morphBack(arr) { // erstellt aus dem Array einen Knoten. Wird für calculateHull() gebraucht
    if (arr.length != 8)
      throw Error("Das Array hat nicht die richtige Anzahl an Informationen, um in einen Knoten gewandelt zu werden.");
    else
      return new Knoten(new Position(arr[0], arr[1]), arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]);
  }
} // Ende: Knoten-Klasse


///////////////////// POLYGON /////////////////
class Polygon {
  /**
  * @class Polygon
  * @param {Object} vertices - [Knoten]
  */
  constructor(vertices){
    this.vertices = vertices;
  }
  
  /**
  * @class Polygon
  * @return {Integer} gibt die Knotenzahl aus
  */
  getLength(){
    return this.vertices.length;
  }
  
  /**
  * @class Polygon
  * @param {Knoten} v - [Knoten]
  * @return {Integer} gibt den Index aus, an dem sich v im Array vertices befindet. Ist v nicht enthalten, wird -1 zurück gegeben
  */
  indexOfNode(v){
    return this.vertices.findIndex(function(k){return k.equal(v);});
  }
  
  /**
  * @class Polygon
  * @param {Knoten} v
  * @return {Boolean} prüft, ob die Knoten dem gleichen Cluster angehören und gibt den Index im Polygon aus. Falls v nicht enthalten ist, wird -1 ausgegeben.
  */
  hasSameClusterNoAs(v){
    for (var i in this.vertices) {
      if (this.vertices[i].clusterNo == v.clusterNo)
        return idx;
    }
    return -1;
  }
  
  /**
  * @class Polygon
  * @param {Knoten} v
  * @return {Boolean} prüft, ob der Knoten Teil des Clusters ist
  */
  contains(v){
    return this.vertices.findIndex(elem => elem.equal(v)) >= 0;
  }
  
  /**
  * @class Polygon
  * @return {Polygon} kopiert das Polygon und all seine Knoten
  */
  copy(){
    return new Polygon(this.vertices.map(
      function(node){return node.copy();}
    ));
  }
  
  /**
  * @class Polygon
  * @return {Object} sucht den Knoten, der am weitesten rechts liegt. Falls es mehrere gibt, wird der mit dem geringsten Winkel zum Schwerpunkt ausgegeben. Result: {p: Position, i: index}
  */
  getHighestX(){
    // gibt Index und Wert der Position mit höchstem x aus
    if (this.getLength() == 0)
       throw new Error("Es existiert kein Knoten, weswegen kein Maximum ermittelt werden kann.");
    else {
      var max, idx, point;
      this.vertices.forEach(function(d,i){
        if (max == undefined || d.pos.x > max.pos.x /*|| Float.equal(d.pos.x, max.pos.x) && d.pos.y > max.pos.y*/) {
          max = d;
          idx = i;
        }
      });
      return {p: max, i:idx};
    }
  }
  
  /**
  * @class Polygon
  * @return {Knoten} gibt den Schwerpunkt des Polygons aus
  */
  getSchwerpunkt() {
    // berechnet den Mittelpunkt einer Punktemenge
    if (this.getLength() == 0)
       throw new Error("Es existiert kein Knoten, weswegen kein Schnittpunkt errechnet werden kann.");
    else { // es existiert mind. 1 Knoten
      var m = new Position(0,0);// neutrales Element der Addition
      this.vertices.forEach(function(v){
        m = m.add(v.pos);
      });
      try {
        return m.div(this.vertices.length);
      }
      catch (err) {
        console.log(err.name + ': ' + err.message);
      }
    }
  }
  
  /**
  * @class Polygon
  * @return {} ordnet die Knoten im Uhrzeigersinn um den Mittelpunkt an
  */
  putUhrzeigersinn(){
    if (this.vertices.length > 1) {
      const s = this.getSchwerpunkt();
      var p = this.vertices.sort(
        // ordnet die Punkte im Uhrzeigersinn an
        function(a,b){
          const g1 = new Gerade(s, a.pos);
          const g2 = new Gerade(s, b.pos);
          return g2.getAngle() - g1.getAngle();}
      );
    }
  }
  
  /**
  * @class Polygon
  * @return {} ordnet die Knoten im Uhrzeigersinn um den Mittelpunkt an, angefangen, beim größten x. Wenn mehrere Punkte x als Maximum haben, wird der untersete (kleinstes y) gewählt
  */
  sort() {
    this.putUhrzeigersinn();
    var maxX = this.getHighestX();
    this.vertices = this.vertices.slice(maxX.i).concat(this.vertices.slice(0,maxX.i));
  }
  
  /**
  * @class Polygon
  * @return {Polygon} berechnet eine konvexe Hülle
  */
  calculateHull() {
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
      var hull = (this.getLength() < 3)? this.vertices : d3.polygonHull(this.vertices.map(function(d){
        return d.morphToArray();
      })).map(function(d){return Knoten.morphBack(d);});
      var newPoly = new Polygon(hull);
      newPoly.sort();
      return newPoly;
    }
  }
  
  /**
  * @class Polygon
  * @param {Object} scale - scaleLinear()
  * @return {String} wandelt ein Polygon in einen Pfad um
  */
  makeHull2Path(scale) {
    var string = "M ";
    this.vertices.forEach(function(d){
      string = string + scale.xScale(d.pos.x) + " ";
      string = string + scale.yScale(d.pos.y) + " L ";
    });
    // schneidet das letzte "L " ab und ersetzt es durch " Z"
    string = string.slice(0,string.length-2) + " Z ";
    return string;
  }
  
  moveBy(richtung){
    this.vertices.map(function(n){return n.moveBy(richtung)});
  }
  
  compensateNodeNumber(newPoly) {
    // füllt das Polygon mit geringerer Knotenzahl auf
    // wird von der Funktion huellenAbgleichen aufgerufen
    // this und newPoly sind bereits Kopien, auf denen gearbeitet werden kann
    var L = this.vertices, R = newPoly.vertices;
    var i = 0, j = 0;
    function curr(A,i) {return A[i % A.length]}
    function succ(A,i) {return A[(i+1) % A.length]}
    function prev(A,i) {return A[(A.length+i-1) % A.length]}
    function getNewPoint(A,a,B,b) {// fügt Knoten B[b] mit modifizierter Position in A zwischen A[a-1] und A[a] ein.
      var gerade = new Gerade(prev(A,a).pos, curr(A,a).pos);
      var d1 = B[b].pos.getDistance(prev(A,a).pos);
      var d2 = B[b].pos.getDistance(curr(A,a).pos);
      var lambda = gerade.getLength() / (d1+d2) * d1;
      var richtVek = gerade.richtung.getNormvektor().mul(lambda);
      gerade.richtung = richtVek;
      var newNode = B[b].copy();
      newNode.pos = gerade.getPositionB();
      // fügt den neuen Knoten ein
      A.splice(a,0,newNode);
    }
    while (i < L.length && j < R.length) {
      if (L[i].equal(R[j])) {
        i++; j++;
      }
      else if (succ(L,i).equal(R[j])) {
        getNewPoint(R,j,L,i);//R.splice(j,0,L[i]);
        i+=2; j+=2;
      }
      else if (L[i].equal(succ(R,j))) {
        getNewPoint(L,i,R,j);//L.splice(i,0,R[j]);
        i+=2; j+=2;
      }
      else {
        getNewPoint(L,i,R,j);//L.splice(i,0,R[j]);
        getNewPoint(R,j+1,L,i);//R.splice(j+1,0,L[i]);
        i+=2; j+=2;
      }
    }// ende der Schleife
    while (i < L.length || j < R.length) {
      if (i < L.length) {// R ist kürzer
        getNewPoint(R,j,L,i);//R.splice(j,0,L[i]);
        i++; j++;
      }
      else {// L ist kürzer
        getNewPoint(L,i,R,j);//L.splice(i,0,R[j]);
        i++; j++;
      }
    }
    return [this, newPoly];// L,R sind Pointer
  }
  
  /**
  * @class Polygon
  * @param {Object} Polygon - Zielpolygon, muss im Uhrzeigersinn vorliegen
  * @return {Object} [Polygon] - gleicht beide Polygone aneinander an: findet gleiche Punkte und bringt sie an den gleichen Index, fügt ggf. fehlende Punkte hinzu
  */
  huellenAbgleichen(newPoly){
    var iOld = 0, iNew = 0; // Anfangsindex
    var polyOld = this.copy();
    var polyNew = newPoly.copy();
    var haveSameElem = false;
    if (polyOld.getLength() == 0 || polyNew.getLength() == 0)
      throw new Error("Eines der Polygone hat keine Knoten. Darum kann kein Vergleich stattfinden.");
    else {// sucht gleiche Knoten
      var erstesElem = this.vertices[0];
      // findet gleiche Elemente, O(n*m) worst-case
      while (iOld < polyOld.getLength() && !haveSameElem) {
        while (iNew < polyNew.getLength() && !haveSameElem) {
          if (polyOld.vertices[iOld].equal(polyNew.vertices[iNew]))
            haveSameElem = true;
          iNew++;
        }
        iOld++;
      }// hat gleiche Punkte gefunden, oder aber (iOld,iNew=0)
      // bringt diese an die Position 0
      if (iOld > 0) {// O(n)
        polyOld.vertices = this.vertices.slice(iOld)
          .concat(this.vertices.slice(0,iOld));
      }
      if (iNew > 0) {// O(m)
        polyNew.vertices = newPoly.vertices.slice(iNew)
          .concat(newPoly.vertices.slice(0, iNew));
      }
      // gleicht an und füllt kürzeres Polygon mit weiteren Punkten auf, O(n+m)
      var huellen = polyOld.compensateNodeNumber(polyNew);
      polyOld.vertices = huellen[0].vertices;
      polyNew.vertices = huellen[1].vertices;
      console.log('polyOld',polyOld,'polyNew',polyNew);
      return [polyOld, polyNew];
    }// ende else
  }
  
  mapToNodes(fkt){
    this.vertices.map(function(n){fkt(n);});
  }
  
  moveVertsCloserTogether(faktor){// faktor € (0, 1]
    // die Knoten rücken dichter zusammen
    var mid = this.getSchwerpunkt();
    this.vertices.forEach(function(v){
      var g = new Gerade(v.pos, mid);
      g.richtung = g.richtung.mul(faktor);
      v.moveTo(g.getPositionB());
    });
  }
  
} // Ende: Polygon-Klasse


////////////////////// CLUSTER ///////////////////
class Cluster {
  /**
  * @class Cluster
  * @param {Integer} clusterID
  * @param {Object} polygons - [Polygon]
  */
  constructor(clusterID, polygons){
    this.id = clusterID;
    this.polygons = polygons; // [Polygon], alle beinhalteten Knoten
  }
  
  /**
  * @class Cluster
  * @param {Function} fkt
  * @return {Object} [Polygon] wendet eine Funktion auf alle Polygone an
  */
  mapToPolygons(fkt){
    return this.polygons.map(fkt);
  }
  
  /**
  * @class Cluster
  * @param {Knoten} node
  * @return {Boolean} prüft, ob ein Knoten im Cluster enthalten ist
  */
  contains(node) {
    return this.polygons.some(pol => pol.contains(node));
  }
  
  /**
  * @class Cluster
  * @return {Object} [String] min. und max. Jahr aller Projekte
  */
  getYears() {
    var jahre = this.reduceToOnePolygon().vertices.map(k => k.year);
    return d3.min(jahre) + " - " + d3.max(jahre);
  }
  
  /**
  * @class Cluster
  * @return {Object} [Polygon] gibt eine Array von Hüllen aus
  */
  getHullVertices(){
    return this.mapToPolygons(function(p){
      return p.calculateHull();
    }); // [Hulls]
  }
  
  /**
  * @class Cluster
  * @return {Integer} gibt die Gesamtknotenzahl des Cluster aus
  */
  getLength(){// gibt die Anzahlan Knoten aller Polygone summiert aus
    return this.mapToPolygons(function(p){return p.getLength()})
      .reduce(function(akk,i){return akk+i;},0);
  }
  
  /**
  * @class Cluster
  * @return {String} wandelt die Hüllen in einen Path-String um
  */
  makeHulls2Path(scale){
    return this.polygons
      .map(function(hull){return hull.makeHull2Path(scale)})
      .join(" ");
  }
  
  /**
  * @class Cluster
  * @return {String} erstellt aus den Polygonen Hüllen und wandelt sie in einen Path-String um
  */
  makePolygons2Path(scale){
    return this.getHullVertices()
      .map(function(hull){return hull.makeHull2Path(scale)})
      .join(" ");
  }
  
  /**
  * @class Cluster
  * @return {Position} berechnet den Mittelpunkt aller Knoten
  */
  getMittelpunkt() {// aller Knoten
    return this.reduceToOnePolygon().getSchwerpunkt();
  }
  
  /**
  * @class Cluster
  * @return {Position} berechnet den Schwerpunkt der 1. Hüllenform
  */
  getSchwerpunkt() {// aller Knoten
    return this.getHullVertices()[0].getSchwerpunkt();
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
  
  positioniereCluster(anzCluster) {
    // je nach ID wird das Cluster um den Mittelpunkt des SVG platziert
    //console.log(width,height);
    const mid = new Position(width/2, height/2);
    const angle = parseFloat(this.id) / anzCluster * 2*Math.PI;
    const richVek = new Position(Math.cos(angle)*width/4, Math.sin(angle)*height/4);
    const newPos = mid.add(richVek.mul(1.5));// multiplikation ggf. löschen
    var g = new Gerade(this.getMittelpunkt(), newPos);
    // console.log("id",this.id, "mid",mid, "angle",angle, "richVek",richVek, "newPos",newPos, "g.rich", g.richtung);
    this.moveBy(g.richtung);
  }
  
  positionOfNode(v){
    var idx;
    for (var i=0; i < this.polygons.length; i++) {
      idx = this.polygons[i].indexOfNode(v);
      if (idx >= 0)
        return {poly: i, idx: idx};
    }
    return null;
  }
  
  positionOfNodeInFirstPoly(v){
    return this.polygons[0].indexOfNode(v);
  }
  
  polygonOfSameClusterNo(v){
    var idx;
    for (var i=1; i< this.polygons.length; i++) {
      idx = this.polygons[i].hasSameClusterNoAs(v);
      if (idx >= 0)
        return {poly: i, idx: idx};
    }
    return null;
  }
  
  moveVertsCloserTogether(faktor) {
    this.mapToPolygons(function(p){
      return p.moveVertsCloserTogether(faktor);
    });
  }
  
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
  
  positionOfNodeInFirstPolys(v){
    var idx;
    for (var i=0; i < this.nest.length; i++) {
      idx = this.nest[i].positionOfNodeInFirstPoly(v)
      if (idx >= 0)
        return {nestIdx: i, polyIdx: idx};
    }
    return null;
  }
  
  contains(node) {
    return this.nest.some(function(c){return c.contains(node);});
  }
  
  findClusterOfID(id){// res in [-1, nest.length)
    return this.nest.findIndex(function(c){return c.id == id});
  }
  
  createTransitionNests(newNests){
    // erstellt Kopien der Nester, um darin arbeiten zu können
    var oldNests = this.copy();
    var newNests = newNests.copy();
    
    // durchsucht oldNests nach jedem der Knoten in newNests
    // und ordnet die Polygone den Clustern neu zu
    var cluNew, fstPolNew, nNew, anzPoly, polyNew, huellen;
    var cluOld, fstPolOld, nOld, iOld, iOldTarget, cluOldTarget, pOld, polyOld, istEnthalten;
    // durchläuft newNests
    for (var iNew in newNests.nest) {// durchläuft newNests
      cluNew = newNests.nest[iNew];
      fstPolNew = cluNew.polygons[0];
      for (var jNew in fstPolNew.vertices) {// durchläuft das 1. Polygon
        nNew = fstPolNew.vertices[jNew];
        // iOld = {nestIdx: i, polyIdx: idx}
        iOld = oldNests.positionOfNodeInFirstPolys(nNew);
        if (iOld == null) {// Knoten ex. nicht in oldNests
          iOldTarget = oldNests.findClusterOfID(nNew.clusterNo);
          if (iOldTarget == -1) {// Cluster ex. nicht
            var newPoly = new Polygon([nNew]);
            cluOldTarget = new Cluster(nNew.clusterNo, [newPoly]);
            oldNests.nest.push(cluOldTarget);
          }
          //else {} // Cluster existiert breits. Nichts zu tun
        } // Ende IF Knoten ex. nicht in oldNests
        else {// Knoten ex. bereits in oldNests
          // iOld = {nestIdx, polyIdx}
          cluOld = oldNests.nest[iOld.nestIdx];
          fstPolOld = cluOld.polygons[0];
          nOld = fstPolOld.vertices[iOld.polyIdx];
          if (nOld.clusterNo != nNew.clusterNo) {// ungleiche clusterNo
            iOldTarget = oldNests.findClusterOfID(nNew.clusterNo);
            if (iOldTarget == -1) {// Cluster ex. nicht
              var newPoly = new Polygon([nNew]);
              // ALT: leeres Cluster ([] statt [newPoly]
              cluOldTarget = new Cluster(nNew.clusterNo, [newPoly]);
              oldNests.nest.push(cluOldTarget);
            }
            /* ALT
            else {// Cluster ex. bereits
              cluOldTarget = oldNests.nest[iOldTarget];
            }
            // Cluster ex. bereits oder ex. nun
            istEnthalten = cluOldTarget.contains(nNew);
            if (!istEnthalten) {// Knoten wurde noch nicht in sein neues Cluster eingefügt 
              cluOldTarget.polygons.push(fstPolOld.copy());
            }*/
            // else {} Knoten bereits im neuen Cluster enthalten
          }// Ende IF ungleiche ClusterNo
          // else {} // gleiche clusterNo. Nichts zu tun
        } // Ende: ELSE Knoten ex. in oldnests
      }// Ende: Durchlauf des 1. Polygons von newNests
    }// Ende: Durchlauf newNests
    
    // löscht Cluster in oldNests, wenn es diese in newNests nicht gibt und alle deren Knoten in NewNests ex. – interessant, wenn alle Knoten woanders übergehen
    /* ALT
    iOld = 0;
    while (iOld < oldNests.nest.length) {// durchläuft oldNests
      cluOld = oldNests.nest[iOld];
      if (newNests.findClusterOfID(cluOld.id) == -1) {
        // cluOld ex. nicht. Prüft, ob alle Knoten in newNests sind
        var nodesStillEx = cluOld.polygons[0].vertices.every(function(node){
          return newNests.contains(node);
        });
        if (nodesStillEx)
          oldNests.nest.splice(iOld, 1);
        else
          iOld++;
      }
      else
        iOld++;
    }*/
    ///////////// NEU ///////////
    // Macht aus Clustern in oldNests, die nicht in newNests ex. Hüllenpolygone
    for (var iOld in oldNests.nest) {
      cluOld = oldNests.nest[iOld];
      if (newNests.findClusterOfID(cluOld.id) == -1) {
        // cluOld ex. nicht in newNests
        anzPoly = cluOld.polygons.length;
        for (var i = 0; i < anzPoly; i++){
          // macht eine Hülle daraus
          polyOld = cluOld.polygons[i].calculateHull();
          cluOld.polygons[i] = polyOld;
        }
      }
    }
    
    // gleicht Anzahl der Polygone eines jeden Clusters (vorher/nachher) aus
    for (var iNew in newNests.nest) {// durchläuft newNests
      cluNew = newNests.nest[iNew];
      fstPolNew = cluNew.polygons[0];
      iOld = oldNests.findClusterOfID(cluNew.id);
      cluOld = oldNests.nest[iOld];
      anzPoly = cluOld.polygons.length;
      for (var i = 1; i < anzPoly; i++) {
        // vervielfacht 1. Polygon in newNests
        cluNew.polygons.push(fstPolNew.copy());
      }
    }
    // erzeugt Hüllen aus den Polygonen und gleicht die Knotenzahl (vorher/nachher) ab.
    for (var iNew in newNests.nest) {// durchläuft newNests
      cluNew = newNests.nest[iNew];
      fstPolNew = cluNew.polygons[0];
      iOld = oldNests.findClusterOfID(cluNew.id);
      cluOld = oldNests.nest[iOld];
      anzPoly = cluOld.polygons.length;
      for (var i = 0; i < anzPoly; i++) {
        // passt Polygone an
        polyOld = cluOld.polygons[i].calculateHull();
        polyNew = cluNew.polygons[i].calculateHull();
        huellen = polyOld.huellenAbgleichen(polyNew);
        cluOld.polygons[i] = huellen[0];
        cluNew.polygons[i] = huellen[1];
      }
    }
    return {old: oldNests, new: newNests};
  }// Ende der Funktion createTransitionNests
  
} // Ende: Klasse Nest
