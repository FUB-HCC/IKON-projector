export const createNewStateFromUrlData = (state, urlData) => {
  const filterValues = {
    forschungsgebiet: urlData.f ? urlData.f.map(f => fieldsIntToString(f)) : [],
    hauptthema: urlData.t ? urlData.t.map(t => fieldsIntToString(t)) : [],
    geldgeber: urlData.s ? urlData.s.map(s => fieldsIntToString(s)) : []
  };

  let newState = {
    graph: urlData.g ? urlData.g : "0",
    filters: {
      ...state.filters,
      forschungsgebiet: {
        ...state.filters.forschungsgebiet,
        value: filterValues.forschungsgebiet
      },
      hauptthema: {
        ...state.filters.hauptthema,
        value: filterValues.hauptthema
      },
      geldgeber: {
        ...state.filters.geldgeber,
        value: filterValues.geldgeber
      }
    },
    selectedProject: urlData.sP
  };
  return newState;
};

const fieldsMapping = [
  { name: "Naturwissenschaften", field: 1, color: "#989aa1" },
  { name: "Lebenswissenschaften", field: 2, color: "#989aa1"},
  { name: "Geistes- und Sozialwissenschaften", field: 3, color: "#989aa1"},
  { name: "Ingenieurwissenschaften", field: 4, color: "#989aa1"},
  { name: "Sonstige", field: 5, color: "#989aa1"}
];

const topicMapping = [
  {
    name: "Agrar-, Forstwissenschaften und Tiermedizin",
    num: "19",
    field: 2,
    color: "#989aa1"
  },
  { name: "Geologie und Paläontologie", num: "22", field: 1, color: "#989aa1" },
  {
    name: "Geochemie, Mineralogie und Kristallographie",
    num: "23",
    field: 1,
    color: "#7d913c"
  },
  { name: "Geophysik und Geodäsie", num: "24", field: 1, color: "#989aa1" },
  {
    name: "Atmosphären-, Meeres- und Klimaforschung",
    num: "25",
    field: 1,
    color: "#989aa1"
  },
  {
    name: "Kunst-, Musik-, Theater- und Medienwissenschaften",
    num: "26",
    field: 3,
    color: "#989aa1"
  },
  {
    name: "Sozialwissenschaften",
    num: "1",
    field: 3,
    color: "#989aa1"
  },
  {
    name: "Informatik",
    num: "2",
    field: 4,
    color: "#989aa1"
  },
  {
    name: "Erziehungswissenschaft und Bildungsforschung",
    num: "3",
    field: 3,
    color: "#989aa1"
  },
  {
    name: "Mathematik",
    num: "4",
    field: 1,
    color: "#989aa1"
  },
  { name: "Geschichtswissenschaften", num: "27", field: 3, color: "#989aa1" },
  { name: "Zoologie", num: "28", field: 2, color: "#989aa1" },
  { name: "Pflanzenwissenschaften", num: "29", field: 2, color: "#989aa1" },
  { name: "Sonstige", num: "30", field: 5, color: "#989aa1" }
];


const iconPaths = [
  "M50,27.7c-12.4,0-22.3,10-22.3,22.3c0,12.4,10,22.3,22.3,22.3S72.3,62.4,72.3,50S62.4,27.7,50,27.7z M8.1,43.2c-0.5,0-0.9-0.1-1.4-0.2c-2.4-0.8-3.7-3.3-2.9-5.7C10.9,15.6,25.3,8,37.2,3.9c2.3-0.8,4.9,0.4,5.7,2.7 c0.8,2.3-0.4,4.9-2.7,5.7c-18.6,6.6-24.4,17.2-27.8,27.7C11.7,42,10,43.2,8.1,43.2z M38.6,96.6c-0.5,0-0.9-0.1-1.4-0.2C15.6,89.3,8,74.8,3.8,63c-0.8-2.3,0.4-4.9,2.7-5.7c2.3-0.8,4.9,0.4,5.7,2.7 C18.9,78.6,29.5,84.4,40,87.8c2.4,0.8,3.7,3.3,2.9,5.7C42.3,95.4,40.5,96.6,38.6,96.6z M91.9,43.1c-1.9,0-3.7-1.2-4.3-3.1c-3.4-10.5-9.2-21.1-27.8-27.7c-2.3-0.8-3.6-3.4-2.7-5.7c0.8-2.3,3.4-3.6,5.7-2.7 c22.5,7.9,29.6,22,33.4,33.4c0.8,2.4-0.5,4.9-2.9,5.7C92.8,43,92.4,43.1,91.9,43.1z M61.4,96.5c-1.9,0-3.7-1.2-4.3-3.1c-0.8-2.4,0.5-4.9,2.9-5.7c10.5-3.4,21.1-9.2,27.7-27.8c0.8-2.3,3.4-3.6,5.7-2.7 c2.3,0.8,3.6,3.4,2.7,5.7c-7.9,22.5-22,29.6-33.4,33.4C62.3,96.4,61.8,96.5,61.4,96.5z",

  "M8.1,43.2c-0.5,0-0.9-0.1-1.4-0.2c-2.4-0.8-3.7-3.3-2.9-5.7C10.9,15.6,25.3,8,37.2,3.9c2.3-0.8,4.9,0.4,5.7,2.7 c0.8,2.3-0.4,4.9-2.7,5.7c-18.6,6.6-24.4,17.2-27.8,27.7C11.7,42,10,43.2,8.1,43.2z M38.6,96.6c-0.5,0-0.9-0.1-1.4-0.2C15.6,89.3,8,74.8,3.8,63c-0.8-2.3,0.4-4.9,2.7-5.7c2.3-0.8,4.9,0.4,5.7,2.7 C18.9,78.6,29.5,84.4,40,87.8c2.4,0.8,3.7,3.3,2.9,5.7C42.3,95.4,40.5,96.6,38.6,96.6z M91.9,43.1c-1.9,0-3.7-1.2-4.3-3.1c-3.4-10.5-9.2-21.1-27.8-27.7c-2.3-0.8-3.6-3.4-2.7-5.7c0.8-2.3,3.4-3.6,5.7-2.7 c22.5,8,29.6,22,33.4,33.4c0.8,2.4-0.5,4.9-2.9,5.7C92.8,43,92.4,43.1,91.9,43.1z M61.4,96.5c-1.9,0-3.7-1.2-4.3-3.1c-0.8-2.4,0.5-4.9,2.9-5.7c10.5-3.4,21.1-9.2,27.7-27.8c0.8-2.3,3.4-3.6,5.7-2.7 c2.3,0.8,3.6,3.4,2.7,5.7c-7.9,22.5-22,29.6-33.4,33.4C62.3,96.4,61.8,96.5,61.4,96.5z M65.9,69.6c-0.5,0-31.4,0-31.4,0c-2.1,0-4.1-1.2-4.1-3.7c0,0,0-28.3,0-30.8c0-3,1.9-4.7,4.2-4.7h30.8 c2.5,0.1,4.3,2.3,4.3,3.9v31.8C69.5,68,67.5,69.6,65.9,69.6z",

  "M8.1,43.2c-0.5,0-0.9-0.1-1.4-0.2c-2.4-0.8-3.7-3.3-2.9-5.7C10.9,15.6,25.3,8,37.2,3.9c2.3-0.8,4.9,0.4,5.7,2.7 s-0.4,4.9-2.7,5.7c-18.6,6.6-24.4,17.2-27.8,27.7C11.7,42,10,43.2,8.1,43.2z M38.6,96.6c-0.5,0-0.9-0.1-1.4-0.2C15.6,89.3,8,74.8,3.8,63c-0.8-2.3,0.4-4.9,2.7-5.7c2.3-0.8,4.9,0.4,5.7,2.7 C18.9,78.6,29.5,84.4,40,87.8c2.4,0.8,3.7,3.3,2.9,5.7C42.3,95.4,40.5,96.6,38.6,96.6z M91.9,43.1c-1.9,0-3.7-1.2-4.3-3.1c-3.4-10.5-9.2-21.1-27.8-27.7c-2.3-0.8-3.6-3.4-2.7-5.7c0.8-2.3,3.4-3.6,5.7-2.7 c22.5,7.9,29.6,22,33.4,33.4c0.8,2.4-0.5,4.9-2.9,5.7C92.8,43,92.4,43.1,91.9,43.1z M61.4,96.5c-1.9,0-3.7-1.2-4.3-3.1c-0.8-2.4,0.5-4.9,2.9-5.7c10.5-3.4,21.1-9.2,27.7-27.8c0.8-2.3,3.4-3.6,5.7-2.7 c2.3,0.8,3.6,3.4,2.7,5.7c-8,22.5-22,29.6-33.4,33.4C62.3,96.4,61.8,96.5,61.4,96.5z M65.8,69.9H34.2c-5.4,0-7.1-5.6-4.3-10.3l15.9-31.8c1.9-3.8,6-3.8,8.3-0.4c0,0,13.2,26.7,16.2,32.3S69.8,69.9,65.8,69.9z",

  "M74.1,52.4c-0.3,0.3-21.3,21.3-21.3,21.3c-1.4,1.4-3.6,1.9-5.3,0.2c0,0-19.3-19.3-20.9-20.9c-2.1-2.1-2-4.5-0.4-6.1 l20.9-20.9c1.7-1.6,4.4-1.4,5.5-0.2l21.6,21.6C75.4,48.8,75.2,51.3,74.1,52.4z M8.1,43.2c-0.5,0-0.9-0.1-1.4-0.2c-2.4-0.8-3.7-3.3-2.9-5.7C10.9,15.6,25.3,8,37.2,3.9c2.3-0.8,4.9,0.4,5.7,2.7 c0.8,2.3-0.4,4.9-2.7,5.7c-18.6,6.6-24.4,17.2-27.8,27.7C11.7,42,10,43.2,8.1,43.2z M38.6,96.6c-0.5,0-0.9-0.1-1.4-0.2C15.6,89.3,8,74.8,3.8,63c-0.8-2.3,0.4-4.9,2.7-5.7c2.3-0.8,4.9,0.4,5.7,2.7 C18.9,78.6,29.5,84.4,40,87.8c2.4,0.8,3.7,3.3,2.9,5.7C42.3,95.4,40.5,96.6,38.6,96.6z M91.9,43.1c-1.9,0-3.7-1.2-4.3-3.1c-3.4-10.5-9.2-21.1-27.8-27.7c-2.3-0.8-3.6-3.4-2.7-5.7c0.8-2.3,3.4-3.6,5.7-2.7 c22.5,8,29.6,22,33.4,33.4c0.8,2.4-0.5,4.9-2.9,5.7C92.8,43,92.4,43.1,91.9,43.1z M61.4,96.5c-1.9,0-3.7-1.2-4.3-3.1c-0.8-2.4,0.5-4.9,2.9-5.7c10.5-3.4,21.1-9.2,27.7-27.8c0.8-2.3,3.4-3.6,5.7-2.7 c2.3,0.8,3.6,3.4,2.7,5.7c-7.9,22.5-22,29.6-33.4,33.4C62.3,96.4,61.8,96.5,61.4,96.5z"
];

export const fieldsIntToString = number => {
  number = parseInt(number, 10); // pls fix
  return fieldsMapping.find(e => e.field === number)
    ? fieldsMapping.find(e => e.field === number).name
    : number;
};

export const fieldsStringToInt = str => {
  return fieldsMapping.find(e => e.name === str)
    ? fieldsMapping.find(e => e.name === str).field + ""
    : str;
};

export const topicIntToString = number => {
  return topicMapping.find(e => e.num === number)
    ? topicMapping.find(e => e.num === number).name
    : "Other";
};

export const topicStringToInt = str => {
  return topicMapping.find(e => e.name === str)
    ? topicMapping.find(e => e.name === str).num
    : str;
};

export const topicToField = topic => {
  return topicMapping.concat(fieldsMapping).find(e => e.name === topic)
    ? topicMapping.concat(fieldsMapping).find(e => e.name === topic).field
    : 99;
};

export const getFieldColor = field => {
  return fieldsMapping.find(e => e.name === field)
    ? fieldsMapping.find(e => e.name === field).color
    : "#989aa1"; // default color field
};

export const getFieldIcon = field => {
  return fieldsMapping.find(e => e.name === field)
    ? iconPaths[fieldsMapping.find(e => e.name === field).field % iconPaths.length] : ""
};

export const getTopicColor = topic => {
  return topicMapping.find(e => e.name === topic)
    ? topicMapping.find(e => e.name === topic).color
    : "#989aa1"; // default color topic
};

export const sponsorStringToInt = (state, str) => {
  return state.filters.geldgeber.uniqueVals.find(e => e === str)
    ? state.filters.geldgeber.uniqueVals.indexOf(str)
    : str;
};

export const sponsorIntToString = (state, int) => {
  return state.filters.geldgeber.uniqueVals[int]
    ? state.filters.geldgeber.uniqueVals[int]
    : int;
};

export const getColor = input => {
  const fColor = getFieldColor(input);
  return fColor === "#989aa1" ? getTopicColor(input) : fColor;
};
