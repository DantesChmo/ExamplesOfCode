window.onload = function () {
    changeColor();
    loadProgress();
    let filters = document.querySelectorAll('.filter');
    toggleActive(filters);

    // dataJson = requestData(dataJson, url); // CORS
    new Cards();
    Cards.loadCards();
}
window.onscroll = function () {
    changeColor();
    if (isLoading) loadProgress();
}
function changeColor() {
    let sections = document.querySelectorAll('section');
    let body = document.body;
    sections.forEach((item) => {
        if (window.pageYOffset >= coor(item).top && window.pageYOffset <= coor(item).bottom) {
            body.style.backgroundColor = item.dataset.color;
        }
    });
}
function loadProgress() {
    let progressSection = document.querySelector('#skills');
    if (window.pageYOffset >= coor(progressSection).top && window.pageYOffset <= coor(progressSection).bottom) {
        let bars = document.querySelectorAll('.calc-progress');
        bars.forEach((item) => {
            item.querySelector('.count').style.backgroundColor = "white";
            countProgress(item);
        });
        isLoading = false;
    }
}
function coor(elem) {
    let obj = elem.getBoundingClientRect();
    return {
        top: obj.top + pageYOffset,
        bottom: obj.bottom + pageYOffset
    }
}
function countProgress(item) {
    let count = item.querySelector('.count');
    (function calcProgress(i) {
        if (i <= +count.dataset.count) {
            let deg = i * 3.6;
            item.style.cssText = "background: conic-gradient(" + count.dataset.progressColor + " 0deg " + deg + "deg, #dfe8ed " + deg + "deg 360deg)";
            count.innerHTML = i + '%';
            setTimeout(function () {
                calcProgress(++i);
            }, 100 / i / 1.1);
        }
    })(0);
}

function toggleActive(filters) {
    let activeButtons = new Set();
    let allButton = Array.from(filters).filter(item => item.innerHTML == 'All')[0];
    filters.forEach((filter) => {
        if (filter == allButton) filter.onclick = resetFilters;
        else {
            filter.onclick = function () {
                if (!activeButtons.has(this)) {
                    this.classList.add('active');
                    activeButtons.add(this);
                }
                else {
                    this.classList.remove('active');
                    activeButtons.delete(this);
                }
                if (activeButtons.size == filters.length - 1) resetFilters();
                else if (activeButtons.size >= 0 && activeButtons.size < 1) allButton.classList.add('active');
                else allButton.classList.remove('active');

                Cards.selectFilter(activeButtons);
            }
        }
    });
    function resetFilters() {
        activeButtons.forEach((button, _, set) => {
            button.classList.remove('active');
            set.delete(button);
        });
        allButton.classList.add('active');
        Cards.selectFilter(new Set());
    }
}

function Card(data) {
    let instance = document.querySelector('.instance');
    let domCard = instance.cloneNode(true);
    domCard.classList.remove('instance');

    this.elem = domCard;
    this.category = data.category;

    this.isActive = true;

    this.elem.querySelector('.card-img').src = data.imgPath;
    this.elem.querySelector('.card-title').innerHTML = data.title;
}

function Cards() {
    let perLoad = 4;
    let cardsList = [];
    let startLoad = 0;
    let data = dataJson;

    Cards.parent = document.querySelector('.card-wrapper');
    Cards.button = document.querySelector('.load-more');


    Cards.button.onclick = function () {
        Cards.loadCards();
    }

    Cards.loadCards = function () {
        for (let i = startLoad; i < perLoad + startLoad; i++) {

            if (i == data.length) {
                this.button.classList.add('no-load');
                return;
            };
            cardsList.push(new Card(data[i]));
            this.parent.appendChild(cardsList[i].elem);
        }
        startLoad += perLoad;
    }
    Cards.selectFilter = function (filters) {
        cardsList.forEach(card => {
            if (filters.size == 0) {
                card.isActive = true;
                card.elem.classList.remove('deactive');
            }
            else {
                card.isActive = Array.from(filters).some(filter => filter.innerHTML == card.category);
                if (card.isActive) card.elem.classList.remove('deactive');
                else card.elem.classList.add('deactive');
            }
        });
    }
}

function requestData(mockData, url) {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (xhr.status == 200) {
            return xhr.responseText;
        }
        else {
            return mockData ? mockData : [];
        }
    }
    xhr.send();
}

let isLoading = true;
const url = "/js/data.json";
// mock
const dataJson = [
    {
        "id": 0,
        "category": "Web",
        "imgPath": "img/1.png",
        "title": "Isometric Perspective Mock-Up"
    },
    {
        "id": 1,
        "category": "Apps",
        "imgPath": "img/2.png",
        "title": "Time Zone App UI"
    },
    {
        "id": 2,
        "category": "Apps",
        "imgPath": "img/3.png",
        "title": "Viro Media Players UI"
    },
    {
        "id": 3,
        "category": "Icons",
        "imgPath": "img/4.png",
        "title": "Blog / Magazine Flat UI Kit"
    },
    {
        "id": 4,
        "category": "Web",
        "imgPath": "img/4.png",
        "title": "Blog / Magazine Flat UI Kit"
    },
    {
        "id": 5,
        "category": "Web",
        "imgPath": "img/4.png",
        "title": "Blog / Magazine Flat UI Kit"
    },
    {
        "id": 6,
        "category": "Web",
        "imgPath": "img/4.png",
        "title": "Blog / Magazine Flat UI Kit"
    }
];