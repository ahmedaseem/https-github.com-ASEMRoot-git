const translations = {

ar: {

"title":"مرحبًا بك في ASEM",
"subtitle":"asem@gov-server | حلول رقمية وتقنية",

"nav-home":"الرئيسية",
"nav-projects":"المشاريع",
"nav-works":"الأعمال",
"nav-about":"عن ASEM",
"nav-contact":"تواصل",

"explore":"استكشف",

"sec-projects":"المشاريع",
"sec-works":"الأعمال",
"sec-about":"ASEM",
"sec-contact":"تواصل",

"skills-title":"المهارات",

"works-text":"أعمال رقمية، أنظمة، وبرمجيات حديثة.",

"about-text":"ASEM منصة تقنية تهتم ببناء حلول ذكية."

},


en: {

"title":"Welcome to ASEM",
"subtitle":"asem@gov-server | Digital Solutions",

"nav-home":"Home",
"nav-projects":"Projects",
"nav-works":"Works",
"nav-about":"About ASEM",
"nav-contact":"Contact",

"explore":"Explore",

"sec-projects":"Projects",
"sec-works":"Works",
"sec-about":"ASEM",
"sec-contact":"Contact",

"skills-title":"Skills",

"works-text":"Digital works, systems and modern software.",

"about-text":"ASEM creates smart technical solutions."

},


fr: {

"title":"Bienvenue chez ASEM",
"subtitle":"asem@gov-server | Solutions numériques",

"nav-home":"Accueil",
"nav-projects":"Projets",
"nav-works":"Travaux",
"nav-about":"À propos de ASEM",
"nav-contact":"Contact",

"explore":"Explorer",

"sec-projects":"Projets",
"sec-works":"Travaux",
"sec-about":"ASEM",
"sec-contact":"Contact",

"skills-title":"Compétences",

"works-text":"Projets numériques modernes.",

"about-text":"ASEM développe des solutions intelligentes."

},


es: {

"title":"Bienvenido a ASEM",
"subtitle":"asem@gov-server | Soluciones digitales",

"nav-home":"Inicio",
"nav-projects":"Proyectos",
"nav-works":"Trabajos",
"nav-about":"Acerca de ASEM",
"nav-contact":"Contacto",

"explore":"Explorar",

"sec-projects":"Proyectos",
"sec-works":"Trabajos",
"sec-about":"ASEM",
"sec-contact":"Contacto",

"skills-title":"Habilidades",

"works-text":"Proyectos digitales modernos.",

"about-text":"ASEM crea soluciones inteligentes."

}

};



function applyLanguage(lang){

const t = translations[lang] || translations.en;


document.documentElement.lang = lang;


document.documentElement.dir =
lang === "ar" ? "rtl" : "ltr";



Object.keys(t).forEach(key=>{

const element = document.getElementById(key);

if(element){

element.textContent = t[key];

}

});


localStorage.setItem("lang",lang);

}



// اختيار اللغة تلقائيا

const browserLanguage =
navigator.language.split("-")[0];


let language =
localStorage.getItem("lang") ||

(translations[browserLanguage]
? browserLanguage
: "en");



applyLanguage(language);



// زر تغيير اللغة

const langSwitch =
document.getElementById("lang-switch");


if(langSwitch){

langSwitch.value = language;


langSwitch.addEventListener(
"change",
function(){

applyLanguage(this.value);

});

}




// الوضع الليلي


const darkButton =
document.getElementById("dark-btn");



function updateDarkIcon(){

if(!darkButton) return;


if(document.body.classList.contains("dark")){

darkButton.textContent="☀️";

}else{

darkButton.textContent="🌙";

}

}




if(localStorage.getItem("dark")==="true"){

document.body.classList.add("dark");

}


updateDarkIcon();



if(darkButton){

darkButton.addEventListener("click",()=>{


document.body.classList.toggle("dark");



localStorage.setItem(
"dark",
document.body.classList.contains("dark")
);



updateDarkIcon();


});

}
