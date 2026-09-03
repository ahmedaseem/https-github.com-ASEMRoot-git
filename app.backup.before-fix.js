const translations = {
const searchRoutes =
require("./search/search.routes");


app.use(
"/api/v1/search",
searchRoutes
);
ar: {
projects: "المشاريع",
contact: "تواصل معنا",
why: "لماذا ASEM؟",
start: "ابدأ مشروعك مجانًا",
contactBtn: "تواصل معنا",
description: "مشاريع رقمية مجانية وحلول برمجية مخصصة للأفراد والشركات حول العالم",
email: "البريد الرسمي"
},

en: {
projects: "Projects",
contact: "Contact Us",
why: "Why ASEM?",
start: "Start Your Free Project",
contactBtn: "Contact Us",
description: "Free digital projects and custom software solutions for individuals and companies worldwide",
email: "Official Email"
},

fr: {
projects: "Projets",
contact: "Contact",
why: "Pourquoi ASEM ?",
start: "Commencez votre projet gratuitement",
contactBtn: "Nous contacter",
description: "Projets numériques gratuits et solutions logicielles personnalisées",
email: "Email officiel"
},

ja: {
projects: "プロジェクト",
contact: "お問い合わせ",
why: "なぜASEMなのか",
start: "無料でプロジェクトを開始",
contactBtn: "お問い合わせ",
description: "個人や企業向けの無料デジタルプロジェクトとカスタムソリューション",
email: "公式メール"
}

};



function applyLanguage(lang){

const t = translations[lang] || translations.en;


document.documentElement.lang = lang;


document.documentElement.dir =
lang === "ar" ? "rtl" : "ltr";



const projectsTitle =
document.querySelector("#projects h2");

if(projectsTitle)
projectsTitle.textContent=t.projects;



const contactTitle =
document.querySelector("#contact h2");

if(contactTitle)
contactTitle.textContent=t.contact;



const heroText =
document.querySelector(".hero p");

if(heroText)
heroText.textContent=t.description;



const buttons =
document.querySelectorAll(".btn");


if(buttons[0])
buttons[0].textContent=t.start;


if(buttons[1])
buttons[1].textContent=t.contactBtn;



localStorage.setItem("lang",lang);

}



const browserLang =
navigator.language
.split("-")[0]
.toLowerCase();



let savedLang =
localStorage.getItem("lang");



let currentLang =
savedLang ||
(translations[browserLang]
? browserLang
: "en");



applyLanguage(currentLang);



const langSwitch =
document.getElementById("langSwitch");


if(langSwitch){

langSwitch.value=currentLang;


langSwitch.addEventListener(
"change",
function(){

applyLanguage(this.value);

});

}





const darkButton = document.getElementById("themeToggle");



function updateDark(){

if(!darkButton)
return;


if(document.body.classList.contains("dark")){

darkButton.textContent="☀️";

}else{

darkButton.textContent="🌙";

}

}



if(localStorage.getItem("dark")==="true"){

document.body.classList.add("dark");

}


updateDark();



if(darkButton){

darkButton.addEventListener("click",()=>{


document.body.classList.toggle("dark");


localStorage.setItem(
"dark",
document.body.classList.contains("dark")
);


updateDark();


});

}
// Load Projects
async function loadProjects(){

    const grid = document.getElementById("projectsGrid");

    if(!grid) return;

    try {

        const response = await fetch("projects.json");

        const projects = await response.json();

        grid.innerHTML = "";

        projects.forEach(project => {

            const card = document.createElement("div");

            card.className = "card project-card";

            card.innerHTML = `
                <img src="${project.image}" 
                     alt="${project.name}"
                     loading="lazy">

                <h3>${project.name}</h3>

                <p>${project.status}</p>

                <p>${project.level}</p>

                <ul>
                    ${project.features.map(
                        item => `<li>${item}</li>`
                    ).join("")}
                </ul>

                <a href="${project.page}">
                    View Project
                </a>
            `;

            grid.appendChild(card);

        });


    } catch(error){

        console.error(
            "Projects loading error:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadProjects
);
const searchBox = document.getElementById("searchBox");


if(searchBox){

searchBox.addEventListener(
"input",
function(){

const value = this.value.toLowerCase();

const cards = document.querySelectorAll(
".project-card"
);


cards.forEach(card => {

const text =
card.textContent.toLowerCase();


if(text.includes(value)){

card.style.display="block";

}else{

card.style.display="none";

}


});


});

}
if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register(
        "/asem.digital-solutions/service-worker.js"
    );

}
