//////////////// Konstanten ////////////////////
const margin = {top: 30, right: 30, bottom: 30, left: 30};
var pageWidth = document.body.clientWidth;
  width = d3.min([pageWidth, 300]) - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
  
var zeitspanne = [1990,2019];
const durationSpan = [0, 3000];
const schrittweite = 250;
var transDuration = 1000;// 500
const animCases = ["Überblendung", "Transition"];
var animArt = animCases[0];
var animDatas = [];
var personenID = "";

var colorScheme = d3.schemeCategory10;//schemeDark2;//schemeSet1;// https://github.com/d3/d3-scale-chromatic/blob/master/README.md#schemeCategory10

const hullOpacity = 0.3;
var radius = 8;

const websites = ["../index", 
  "test01", // neue Knoten + wirken sich nicht auf die Form aus
  "test02", // Knoten verschw., ohne Verformung
  "test03", // Bewegung & Verformung
  "test04", // neue Proj. -> neues Cluster
  "test05", // Verschmelzung ohne Bewegung
  "test06", // Aufteilung: altes ex. + neues (aus 1 macht 2)
  "test07", // Clusterwechsel: altes ex., kein neues
  "test08", // neue Knoten + Verformung durch diese
  "test09", // Knoten verschwinden + Verformung durch diese 
  "test10", // neue Knoten => + Cluster + Verformung
  "test11", // Knoten verschw. => - Cluster + Verformung
  "test12", // Aufteilung: altes ex., kein neues
  "test13", // Clusterwechsel: altes ex. + neues + Verformung
  "test14", // Transitionsdauer
  "test15", // Vergleich: Trans. vs. Überblendung
  "test16", // Clusterzahl raten (JSON)
  "results"
];

function aufgabenNr(site){
  return websites.indexOf(site);
}

function aufgabenCounter(site) {
  return "Aufgabe " + aufgabenNr(site) + "/" + (websites.length-2);
}

function romanize(num) { // https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
  var roman = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, 
    L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};
  var str = '';
  for (var i of Object.keys(roman)) {
    var q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return str;
}

function parseSec(ms){
  return ((+ms)/1000).toString() + " s";
}


////////////////// SVG ////////////
class SVG {
  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Klassen
  constructor(id, ort) {
    this.svg = ort.append("svg")
      .attr("class", id)
      .attr("width",  width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    this.svg.append("g").attr("class", "hulls");
    this.svg.append("g").attr("class", "circs");
    this.svg.append("g").attr("class", "beschriftung");
  }
  
  get getSvg(){
    return this.svg;
  }
}

////////////////// Scaling ////////////
class Scale {
  constructor(vertices){
    this.xScale = d3.scaleLinear()
      .domain([0, width])
      .range([0, width]);
    this.yScale = d3.scaleLinear()
      .domain([0, height])
      .range([height, 0]);
  }
  
  setDomain(vertices) {
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/set
    this.xScale.domain([getMinXofShapes(vertices), getMaxXofShapes(vertices)]);
    this.yScale.domain([getMinYofShapes(vertices), getMaxYofShapes(vertices)]);
  }
}

////////////////////// Tooltip //////////////
// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
  
var tooltipNode = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "<b>Projekt-ID: " + d.id + "</b><br>Cluster-Nr.: " + d.clusterNo + "<br>Pos: (" + d3.format(",.2f")(d.pos.x) + " |  " + d3.format(",.2f")(d.pos.y) + ")";
  });
  
var tooltipNodeNoCluster = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "<b>Projekt-ID: " + d.id + "</b><br>Pos: (" + d3.format(",.2f")(d.pos.x) + " |  " + d3.format(",.2f")(d.pos.y) + ")";
  });
  
var tooltipNodePoor = d3.tip()// zum Verbergen von Informationen
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d){return "keine Informationen"});
  
var tooltipCluster = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "<b>Cluster-ID: " + d.id + "</b><br>Knotenzahl: " + d.getLength();
  });
  
//////////////// Kreise ///////////////
class Kreise {
  constructor(vertices, svg, klasse, scale) {
    this.circles = svg.svg.select("g.circs")
      .selectAll("circle."+klasse)
      .data(vertices, function(d){return d.id;})
      .enter()
      .append("circle")
      .attr("class", klasse)
      .attr("cx", function(d) {return scale.xScale(d.pos.x);})
      .attr("cy", function(d) {return scale.yScale(d.pos.y);})
      .attr("r", radius)
      .on("mouseover", tooltipNode.show)
      .on("mouseout", tooltipNode.hide)
      // https://github.com/d3/d3-scale-chromatic
      /*.style("stroke", function(d){
        return d3.rgb(colorScheme[d.researchArea.disziplin]).brighter(2);
      })// .darker(2)
      .style("fill", function(d){
        return d3.rgb(colorScheme[d.researchArea.disziplin]);
      })*/
      .style("opacity", 1)
      .style("pointer-events", "all");
    this.label = svg.svg.select("g.beschriftung")
      .selectAll("text." + klasse)
      .data(vertices, function(d){return d.id;})
      .enter()
      .append("text")
      .attr("class", klasse)
      .attr("x", function(d) {return scale.xScale(d.pos.x);})
      .attr("y", function(d) {return scale.yScale(d.pos.y);})
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .attr("dy", "0.7ex")
      .text(function(d){return d.id;})
      .on("mouseover", tooltipNode.show)
      .on("mouseout", tooltipNode.hide);
      
    svg.svg.call(tooltipNode);// call the function on the selection
  }
}

//////////////// Hüllen ///////////////
class Pfade {  
  constructor(gruppen, svg, klasse, scale){
    this.nester = gruppen.nest;
    this.hull = svg.svg.select("g.hulls")
      .selectAll("path."+klasse)
      .data(gruppen.nest, function(d){return d.id;})
      .enter()
      .append("path")
      .attr("class", klasse)
      .attr("d", function(c){// c = Cluster{id, polygons}
        return c.makePolygons2Path(scale);}
      )
      /*.attr('fill', "gray")
      .attr('stroke', "gray")*/
      .style('opacity', hullOpacity)
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide);
    this.label = svg.svg.select("g.beschriftung")
      .selectAll("text." + klasse)
      .data(gruppen.nest, function(d){return d.id;})
      .enter()
      .append("text")
      .attr("class", klasse)
      .attr("x", function(c) {
        return getClusterLabelPos(c, scale).x;
      })
      .attr("y", function(c) {
        return getClusterLabelPos(c, scale).y;
      })
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .attr("dy", "0.7ex")
      .text(function(d){return "Cluster " + d.id;})
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide);
    
    svg.svg.call(tooltipCluster);// call the function on the selection
  }
}

//////////////// Funktionen ///////////////
function getClusterLabelPos(cluster, scale){
  var s = cluster.getSchwerpunkt();
  if (cluster.getLength() < 2)
    return {x: scale.xScale(s.x), y: scale.yScale(s.y) - 3*radius};
  else
    return {x: scale.xScale(s.x), y: scale.yScale(s.y)};
}


function getMinXofShapes(vertices){
  return Math.min(0, d3.min(vertices.filter(function(d){
    return d.year >= zeitspanne[0] && d.year <= zeitspanne[1];
  }), function(d){return d.pos.x;}));
}
function getMaxXofShapes(vertices){
  return d3.max(vertices.filter(function(d){
    return d.year >= zeitspanne[0] && d.year <= zeitspanne[1];
  }), function(d){return d.pos.x;});
}
function getMinYofShapes(vertices){
  return Math.min(0, d3.min(vertices.filter(function(d){
    return d.year >= zeitspanne[0] && d.year <= zeitspanne[1];
  }), function(d){return d.pos.y;}));
}
function getMaxYofShapes(vertices){
  return d3.max(vertices.filter(function(d){
    return d.year >= zeitspanne[0] && d.year <= zeitspanne[1];
  }), function(d){return d.pos.y;});
}

/////////////// Schieberegler /////////////
class Schieberegler {
  constructor(){
    var breite = document.getElementsByClassName("layout")[0].clientWidth;
    this.schieberegler = d3.select("div.layout")
      .append("div")
      .attr("class", "centerBar")
      .style("width", (breite-d3.min([breite, 300])/2) + "px")
      .style("margin-left", ((breite-d3.min([breite, 300]))/2) + "px")
      .style("text-align", "left");
  }
  
  editSchieberegler() {
    this.schieberegler.append("span");
    this.schieberegler.append("text")
      .text("Animationsdauer: ");

    this.schieberegler.append("label")
      .attr("class", "reglerText")
      .append("text")
      .attr("id", "startduration")
      .style("margin-left", "10px")
      .style("margin-right", "3px")
      .style("white-space", "nowrap")
      .style("display", "inline-block")
      .text(function(){
        return parseSec(durationSpan[0]);
      });
      
    this.schieberegler.append("input")
      .attr("type", "range")
      .attr("id", "transDurationIn")
      .style("width", "28%")
      .style("display", "inline-block")
      .attr("value", transDuration)
      .attr("min", durationSpan[0])
      .attr("max", durationSpan[1])
      .attr("step", schrittweite);
      
    document.getElementById("transDurationIn").value = transDuration;
      
    this.schieberegler.append("label")
      .attr("class", "reglerText")
      .append("text")
      .attr("id", "endduration")
      .style("margin-left", "3px")
      .style("white-space", "nowrap")// https://stackoverflow.com/questions/7300760/prevent-line-break-of-span-element/32941430
      .style("display", "inline-block")
      // https://www.computerhope.com/issues/ch001709.htm
      .text(function(){
        return parseSec(durationSpan[1]);
      });
      
    this.schieberegler.append("output")
      .attr("id", "transDurationOut")
      .attr("value", parseSec(transDuration))
      .text(parseSec(transDuration))
      .style("text-align", "center")
      .style("position", "absolute")
      .style("left", function(){
        var regler = document.getElementById("transDurationIn");
        var barKoordinates = regler.getBoundingClientRect();
        var scale = d3.scaleLinear()
          .domain([+regler.min, +regler.max])
          .range([barKoordinates.x +6, barKoordinates.x + barKoordinates.width -14]);
        return (scale(transDuration) - 14) + "px";
      })
      .style("top", function(){
        var regler = document.getElementById("transDurationIn");
        var barKoordinates = regler.getBoundingClientRect();
        return (barKoordinates.top - 13) + "px";
      });

    d3.select("#transDurationIn")
      .on("change", function(){// aktualisiert Variable 
        transDuration = parseInt(this.value);
      })
      .on("input", function(){// aktualisiert Zahl und Verschiebung
        var barKoordinates = this.getBoundingClientRect();
        var scale = d3.scaleLinear()
          .domain([+this.min, +this.max])
          .range([barKoordinates.x +6, barKoordinates.x + barKoordinates.width -14]);
        var barValue = +this.value;
        var textContent = parseSec(barValue);
        // aktualisiert den text
        document.getElementById("transDurationOut").value = textContent;
        // aktualisiert die Position
        d3.select("#transDurationOut")
          .style("left", function(){
            return (scale(barValue) -14) + "px";
          });
      });
  }
}


//////////////// Button ///////////////
class LinkButton {  
  constructor(site, fkt, sign, text, result){
    this.btn = d3.select("div.layout").append("form")
      .append("a")// https://stackoverflow.com/questions/16461512/add-a-link-to-another-page-with-d3-js
      .attr("href", function(){
        //event.preventDefault();// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
        var index = (websites.indexOf(site)+sign) % websites.length;
        if (me == "../index")
          return "sites/" + websites[index] + ".html";
        else
          return websites[index] + ".html";
      })
      //.html(text) // text für <a href></a>
      .append("button")
      .attr("type", "button")// default: submit -> let's reload page
      // https://stackoverflow.com/questions/7803814/prevent-refresh-of-page-when-button-inside-form-clicked
      .attr("id", "next")
      .text(text)
      .on("contextmenu", function(d) {
        d3.event.preventDefault();
      })
      .on("click", function(){
        //d3.event.preventDefault();
        //console.log("click",site,text);
        fkt(site, result);
      });
  }// ende Konstruktor
}

class Button {  
  constructor(ort, fkt, text){
    this.btn = ort.append("button")
      .attr("class", "button")
      .attr("type", "button")// default: submit -> let's reload page
      // https://stackoverflow.com/questions/7803814/prevent-refresh-of-page-when-button-inside-form-clicked
      .text(text)
      .on("contextmenu", function(d) {
        d3.event.preventDefault();
      })
      .on("click", function(){
        fkt();
      });
  }// ende Konstruktor
}

////////////// Button Funktionen ///////////
function storeDatas(site, res){
  localStorage.setItem(site, res);// https://diveintohtml5.info/storage.html
}

// https://www.d3-graph-gallery.com/graph/interactivity_button.html
// https://stackoverflow.com/questions/26964006/using-d3-instead-of-jquery-to-process-form-input-causes-re-load-of

function deleteDatas(site, res) {
  localStorage.removeItem(site);
}

function deleteAllDatas(site, res) {
  //sessionStorage.clear();
  localStorage.clear();
}

function showDatas(site){ 
  // erstellt eine Datei mit den Ergebnissen
  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  // https://www.mediaevent.de/javascript/local-storage.html
  var content = ["Aufgabe;Deutung;Loesung;Antwort1;Antwort2;Antwort3;Antwort4;Antwort5;Antwort6;Antwort7;Antwort8;Antwort9"];
  var keys = Object.keys(localStorage).sort();
  keys.forEach(function(key){
    // modifiziert die Einträge
    var value = localStorage.getItem(key);
    var array = value.split(";");
    var results = [key];
    for (var i=0; i<array.length; i++)
      if (i != 0 && i != 2 && i != 4)
        results.push(array[i]);
      else if (i == 0 && key=="Teilnehmer")
        results.push(array[i]);
    content.push(results.join(";"));
  });
  //var content = document.cookie;
  download('results.csv', content.join("\n"));
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function cloneDataset(dataset){
  return dataset.map(function(d){return d.copy();});
}

function getFilteredData(datas){// https://stackoverflow.com/questions/39964570/how-to-filter-data-with-d3-js
  return datas.filter(function(node){
    return node.year >= zeitspanne[0] && node.year <= zeitspanne[1];
  });
}


////////////////// TRANSITIONEN //////////////////


//////////////// Ausgangszustand ////////////////////
function ausgangszustand(svgs, oldDataset, oldNests, scale){
  //////////////// Scaling ////////////////////
  scale.setDomain(oldDataset);
  
  for (var i in svgs) {
    var svg = svgs[i];
    if (svg != null) {
      //////////////// Kreise ////////////////////
      var circs = svg.svg.select("g.circs")
        .selectAll("circle.projekt")
        .data(oldDataset, function(d){return d.id;});
        
      circs.exit()
        .attr("class", "remove")
        .remove();
        
      circs.enter()
        .append("circle")
        .attr("class", "projekt")
        .attr("cx", function(d) {return scale.xScale(d.pos.x);})
        .attr("cy", function(d) {return scale.yScale(d.pos.y);})
        .attr("r", radius)
        .on("mouseover", tooltipNode.show)
        .on("mouseout", tooltipNode.hide)
        .style("opacity", 1)
        .style("pointer-events", "all");
      
      svg.svg.select("g.circs")
        .selectAll("circle.projekt")
        .attr("cx", function(d) {return scale.xScale(d.pos.x);})
        .attr("cy", function(d) {return scale.yScale(d.pos.y);});
        
      //////////////// Hüllen ////////////////////
      var hulls = svg.svg.select("g.hulls")
        .selectAll("path.huelle")
        .data(oldNests.nest, function(d){return d.id;});
        
      hulls.exit()
        .attr("class", "remove")
        .remove();
        
      svg.svg.select("g.hulls")
        .selectAll("path.huelle")
        .attr("d", function(c){// c = Cluster{id, polygons}
          return c.makePolygons2Path(scale);}
        );
        
      hulls.enter()
        .append("path")
        .attr("class", "huelle")
        .attr("d", function(c){// c = Cluster{id, polygons}
          return c.makePolygons2Path(scale);}
        )
        .style('opacity', hullOpacity)
        .on("mouseover", tooltipCluster.show)
        .on("mouseout", tooltipCluster.hide);
        
      //////////////// Labels ////////////////////
      var labelsCirc = svg.svg.select("g.beschriftung")
        .selectAll("text.projekt")
        .data(oldDataset, function(d){return d.id;});
        
      labelsCirc.exit()
        .attr("class", "remove")
        .remove();
      
      svg.svg.select("g.beschriftung")
        .selectAll("text.projekt")
        .attr("x", function(d) {return scale.xScale(d.pos.x);})
        .attr("y", function(d) {return scale.yScale(d.pos.y);});
        
      labelsCirc.enter()
        .append("text")
        .attr("class", "projekt")
        .attr("x", function(d) {return scale.xScale(d.pos.x);})
        .attr("y", function(d) {return scale.yScale(d.pos.y);})
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .attr("dy", "0.7ex")
        .text(function(d){return d.id;})
        .on("mouseover", tooltipNode.show)
        .on("mouseout", tooltipNode.hide);
        
      var labelsHull = svg.svg.select("g.beschriftung")
        .selectAll("text.huelle")
        .data(oldNests.nest, function(d){return d.id;});
        
      labelsHull.exit()
        .attr("class", "remove")
        .remove();
      
      svg.svg.select("g.beschriftung")
        .selectAll("text.huelle")
        .attr("x", function(c) {
          return getClusterLabelPos(c, scale).x;
        })
        .attr("y", function(c) {
          return getClusterLabelPos(c, scale).y;
        });
        
      labelsHull.enter()
        .append("text")
        .attr("class", "huelle")
        .attr("x", function(c) {
          return getClusterLabelPos(c, scale).x;
        })
        .attr("y", function(c) {
          return getClusterLabelPos(c, scale).y;
        })
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .attr("dy", "0.7ex")
        .text(function(d){return "Cluster " + d.id;})
        .on("mouseover", tooltipCluster.show)
        .on("mouseout", tooltipCluster.hide);
    } // Ende if != null Abfrage
  } // Ende der Schleife
}// Ende Funktion ausgangszustand


/////////// Transition ////////////
function transitions(svgs, newDataset, newNests, transTable, scales){
  var svg1 = svgs[0], svg2 = svgs[1];
  var scale1 = scales[0], scale2 = scales[1];
  
  if (svg1 != null) {//---------"Überblendung"----------
    scale1.setDomain(newDataset);
    
    var hulls = svg1.svg.select("g.hulls").selectAll("path.huelle")
      .data(new Nest(newDataset).nest, function(d){return d.id;});
    
    hulls.exit()
      .attr("class", "remove")
      .transition()
      .duration(transDuration/2)
      .style("opacity", 0)
      .remove();
      
    svg1.svg.select("g.hulls").selectAll("path.huelle")
      .transition()
      .duration(transDuration/2)
      .style("opacity", 0)
      .transition().duration(0)
      .attr("d", function(d){return d.makePolygons2Path(scale1)})
      .transition().duration(transDuration/2)
      .style("opacity", hullOpacity);
    
    hulls.enter()
      .append("path")
      .attr("class", "huelle")
      .attr("d", function(c){// c = Cluster{id, polygons}
        return c.makePolygons2Path(scale1);}
      )
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide)
      .style("opacity", 0)
      .transition()
      .delay(transDuration/2)
      .duration(transDuration/2)
      .style("opacity", hullOpacity);
    
    ////////// Kreise //////////////      
    var circles = svg1.svg.select("g.circs")
      .selectAll("circle.projekt")
      .data(newDataset, function(d){return d.id;});
      
    circles.exit()
      .attr("class", "remove")
      .transition().duration(transDuration/2)
      .style("opacity", 0)
      .remove();
      
    svg1.svg.select("g.circs")
      .selectAll("circle.projekt")
      .transition().duration(transDuration/2)
      .style("opacity", 0)
      .transition().duration(0)
      .attr("cx", function(d) {return scale1.xScale(d.pos.x);})
      .attr("cy", function(d) {return scale1.yScale(d.pos.y);})
      .style("pointer-events","visible")
      .transition().duration(transDuration/2)
      .style("opacity", 1);
      
    circles.enter()
      .append("circle")
      .attr("class", "projekt")
      .attr("cx", function(d) {return scale1.xScale(d.pos.x);})
      .attr("cy", function(d) {return scale1.yScale(d.pos.y);})
      .attr("r", radius)
      .on("mouseover", tooltipNode.show)
      .on("mouseout", tooltipNode.hide)
      .style("opacity", 0)
      .transition()
      .delay(transDuration/2)
      .duration(transDuration/2)
      .style("opacity", 1);
      
    ////////// Labels ////////////// 
    var labelsCircs = svg1.svg.select("g.beschriftung")
      .selectAll("text.projekt")
      .data(newDataset, function(d){return d.id;});
      
    labelsCircs.exit()
      .attr("class", "remove")
      .transition()
      .duration(transDuration/2)
      .style("opacity", 0)
      .remove();
      
    svg1.svg.select("g.beschriftung")
      .selectAll("text.projekt")
      .transition().duration(transDuration/2)
      .style("opacity", 0)
      .transition()
      .duration(0)
      .attr("x", function(d) {return scale1.xScale(d.pos.x);})
      .attr("y", function(d) {return scale1.yScale(d.pos.y);})
      .transition()
      .duration(transDuration/2)
      .style("opacity", 1);
      
    labelsCircs.enter()
      .append("text")
      .attr("class", "projekt")
      .attr("x", function(d) {return scale1.xScale(d.pos.x);})
      .attr("y", function(d) {return scale1.yScale(d.pos.y);})
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .attr("dy", "0.7ex")
      .style("opacity", 0)
      .text(function(d){return d.id;})
      .on("mouseover", tooltipNode.show)
      .on("mouseout", tooltipNode.hide)
      .transition()
      .delay(transDuration/2)
      .duration(transDuration/2)
      .style("opacity", 1);
      
    var labelsHull = svg1.svg.select("g.beschriftung")
      .selectAll("text.huelle")
      .data(newNests.nest, function(d){return d.id;});
      
    labelsHull.exit()
      .attr("class", "remove")
      .transition()
      .duration(transDuration/2)
      .style("opacity", 0)
      .remove();
    
    svg1.svg.select("g.beschriftung")
      .selectAll("text.huelle")
      .transition()
      .duration(transDuration/2)
      .style("opacity", 0)
      .transition()
      .duration(0)
      .attr("x", function(c) {
        return getClusterLabelPos(c, scale1).x;
      })
      .attr("y", function(c) {
        return getClusterLabelPos(c, scale1).y;
      })
      .transition()
      .duration(transDuration/2)
      .style("opacity", 1);
      
    labelsHull.enter()
      .append("text")
      .attr("class", "huelle")
      .attr("x", function(c) {
        return getClusterLabelPos(c, scale1).x;
      })
      .attr("y", function(c) {
        return getClusterLabelPos(c, scale1).y;
      })
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .attr("dy", "0.7ex")
      .text(function(d){return "Cluster " + d.id;})
      .style("opacity", 0)
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide)
      .transition()
      .delay(transDuration/2)
      .duration(transDuration/2)
      .style("opacity", 1);
  }// Ende if != null (Überblendung)
  if (svg2 != null) {//---------"Transition"----------
    var circles = svg2.svg.select("g.circs")
      .selectAll("circle.projekt")
      .data(newDataset, function(d){return d.id;});
      
    var esGibtExit  = circles.exit()._groups[0]
      .map(c => c != undefined).some(b => b);
    var esGibtEnter = circles.enter()._groups[0]
      .map(c => c != undefined).some(b => b);
    //console.log('esGibtExit',esGibtExit, 'esGibtEnter',esGibtEnter);
      
    ///////// Hüllen 
    svg2.svg.select("g.hulls").selectAll("path.huelle")
      .data(transTable[0].nest, function(d){return d.id;})
      .attr("d", function(d){
        return d.makeHulls2Path(scale2);
      });
    
    scale2.setDomain(newDataset);
    
    var hulls = svg2.svg.select("g.hulls").selectAll("path.huelle")
      .data(transTable[1].nest, function(d){return d.id;});
      
    hulls.exit()
      .attr("class", "remove")
      .style("opacity", 0)
      .remove();
      
    hulls.transition().ease(d3.easeQuadInOut)
      .delay(function(){
        if (esGibtExit)
          return transDuration/4;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtExit || esGibtEnter)
          return transDuration*3/4;
        else
          return transDuration;
      })
      .attr("d", function(d){
        return d.makeHulls2Path(scale2);
      });
    
    hulls.enter()
      .append("path")
      .attr("class", "huelle")
      .attr("d", function(c){// c = Cluster{id, polygons}
        var pos = c.getSchwerpunkt();
        var node = new Knoten(pos, 0, 0, {}, 2019, [""])
        var poly = new Array(c.getLength()).fill(node);
        return new Polygon(poly).makeHull2Path(scale2);
      })
      .style('opacity', 0)
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide)
      .transition()
      .delay(function(){
        if (esGibtExit)
          return transDuration/4;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtExit || esGibtEnter)
          return transDuration*3/4;
        else
          return transDuration;
      })
      .style('opacity', hullOpacity)
      .attr("d", function(c){// c = Cluster{id, polygons}
        return c.makePolygons2Path(scale2);
      });
    
    d3.transition().duration(transDuration)
      .on("end", showNewDatas);
    
    function showNewDatas(){
      svg2.svg.select("g.hulls").selectAll("path.huelle")
        .data(new Nest(newDataset).nest, function(d){return d.id;})
        .attr("d", function(d){
          return d.makePolygons2Path(scale2);
        });
    }
    
    ////////// Kreise //////////////      
    circles.exit()
      .attr("class", "remove")
      .transition()
      .duration(transDuration/4)
      .ease(d3.easeBackIn.overshoot(6))
      .attr("r", 0)
      .remove();
      
    svg2.svg.select("g.circs")
      .selectAll("circle.projekt")
      .transition()
      .delay(function(){
        if (esGibtExit)
          return transDuration/4;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtExit || esGibtEnter)
          return transDuration*3/4;
        else
          return transDuration;
      })
      .ease(d3.easeQuadInOut)
      .attr("cx", function(d) {return scale2.xScale(d.pos.x);})
      .attr("cy", function(d) {return scale2.yScale(d.pos.y);})
      .style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
      
    circles.enter()
      .append("circle")
      .attr("class", "projekt")
      .attr("cx", function(d) {return scale2.xScale(d.pos.x);})
      .attr("cy", function(d) {return scale2.yScale(d.pos.y);})
      .attr("r", 0)
      .on("mouseover", tooltipNode.show)
      .on("mouseout", tooltipNode.hide)
      .style("opacity", 1)
      .style("pointer-events", "all")
      .transition()
      .delay(transDuration*3/4)
      .duration(transDuration/4)
      .ease(d3.easeBackOut.overshoot(6))
      .attr("r", radius);
      
    ////////// Labels ////////////// 
    var labelsCircs = svg2.svg.select("g.beschriftung")
      .selectAll("text.projekt")
      .data(newDataset, function(d){return d.id;});
      
    labelsCircs.exit()
      .attr("class", "remove")
      .transition()
      .duration(transDuration/4)
      .ease(d3.easeBackIn.overshoot(6))
      .style("font-size", "0px")
      //.style("opacity", 0)
      .remove();
      
    svg2.svg.select("g.beschriftung")
      .selectAll("text.projekt")
      .transition()
      .ease(d3.easeQuadInOut)
      .delay(function(){
        if (esGibtExit)
          return transDuration/4;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtExit || esGibtEnter)
          return transDuration*3/4;
        else
          return transDuration;
      })
      .attr("x", function(d) {return scale2.xScale(d.pos.x);})
      .attr("y", function(d) {return scale2.yScale(d.pos.y);});
      
    labelsCircs.enter()
      .append("text")
      .attr("class", "projekt")
      .attr("x", function(d) {return scale2.xScale(d.pos.x);})
      .attr("y", function(d) {return scale2.yScale(d.pos.y);})
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .attr("dy", "0.7ex")
      .style("opacity", 0)
      .text(function(d){return d.id;})
      .on("mouseover", tooltipNode.show)
      .on("mouseout", tooltipNode.hide)
      .transition()
      .delay(transDuration*3/4)
      .duration(transDuration/4)
      .style("opacity", 1);
      
    var labelsHulls = svg2.svg.select("g.beschriftung")
      .selectAll("text.huelle")
      .data(newNests.nest, function(d){return d.id;});
      
    labelsHulls.exit()
      .attr("class", "remove")
      .transition()
      .duration(transDuration)
      .style("opacity", 0)
      .remove();
      
    svg2.svg.select("g.beschriftung")
      .selectAll("text.huelle")
      .transition()
      .ease(d3.easeQuadInOut)
      .delay(function(){
        if (esGibtExit)
          return transDuration/4;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtExit || esGibtEnter)
          return transDuration*3/4;
        else
          return transDuration;
      })
      .attr("x", function(c) {
        return getClusterLabelPos(c, scale2).x;
      })
      .attr("y", function(c) {
        return getClusterLabelPos(c, scale2).y;
      });
      
    labelsHulls.enter()
      .append("text")
      .attr("class", "huelle")
      .attr("x", function(c) {
        return getClusterLabelPos(c, scale2).x;
      })
      .attr("y", function(c) {
        return getClusterLabelPos(c, scale2).y;
      })
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .attr("dy", "0.7ex")
      .style("opacity", 0)
      .text(function(d){return "Cluster " + d.id;})
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide)
      .transition()
      .delay(transDuration*3/4)
      .duration(transDuration/4)
      .style("opacity", 1);
  }// Ende if != null (Transition)
}// Ende Funktion transition
