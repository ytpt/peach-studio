import {regions} from "./data";

document.addEventListener('DOMContentLoaded', function() {
    // Toggle map menu buttons
    const mapButtons = document.querySelectorAll('.map__link');

    mapButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.active').classList.remove('active');
            btn.classList.add('active');
        });
    });

    // Toggle hidden menu
    const mapHeaderButton = document.querySelector('.map__header');
    const arrowIcon = document.querySelector('.map__header-icon');
    const mapImg = document.querySelector('.map__figure');
    const hiddenMenu = document.querySelector('.map__menu--hidden');

    mapHeaderButton.addEventListener('click', function() {
        const currentAlt = arrowIcon.getAttribute('alt');

        if (currentAlt === 'Вниз') {
            mapButtons.forEach(btn => btn.classList.add('disable'));
            mapImg.classList.add('disable');
            hiddenMenu.style.maxHeight = '500px';
            hiddenMenu.style.opacity = '1';

            arrowIcon.setAttribute('alt', 'Вверх');
            arrowIcon.setAttribute('src', 'assets/arrow-up-black.svg');
        } else {
            mapButtons.forEach(btn => btn.classList.remove('disable'));
            mapImg.classList.remove('disable');
            hiddenMenu.style.maxHeight = '0';
            hiddenMenu.style.opacity = '0';

            arrowIcon.setAttribute('alt', 'Вниз');
            arrowIcon.setAttribute('src', 'assets/arrow-down-black.svg');
        }
    })

    // Hide hidden menu while click outside menu
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = hiddenMenu.contains(event.target);
        const isClickOnHeaderButton = mapHeaderButton.contains(event.target);

        if (!isClickInsideMenu && !isClickOnHeaderButton) {
            hiddenMenu.style.maxHeight = '0';
            hiddenMenu.style.opacity = '0';
            arrowIcon.setAttribute('alt', 'Вниз');
            arrowIcon.setAttribute('src', 'assets/arrow-down-black.svg');
            mapButtons.forEach(btn => btn.classList.remove('disable'));
            mapImg.classList.remove('disable');
        }
    });

    // Toggle map cities marks
    const mapFigure = document.querySelector('.map__figure');
    const mapLinks = document.querySelectorAll('.map__link');
    const allButton = document.querySelector('.map__link');
    let isAllCitiesShown = false;

    function showAllCities() {
        if (!isAllCitiesShown) {
            clearMapPoints();
            Object.keys(regions).forEach(region => drawMapPoints(regions[region]));
            isAllCitiesShown = true;
        }
    }

    showAllCities();
    allButton.addEventListener('click', showAllCities);

    mapLinks.forEach((regionLink, index) => {
        if (index !== 0) {
            regionLink.addEventListener('click', function () {
                const regionName = this.textContent;
                clearMapPoints();
                const citiesInRegion = regions[regionName];
                drawMapPoints(citiesInRegion);
            });
        }
    });

    function clearMapPoints() {
        const existingPoints = document.querySelectorAll('.mark');
        existingPoints.forEach(point => point.remove());
        isAllCitiesShown = false;
    }

    function drawMapPoints(citiesInRegion) {
        citiesInRegion.cities.forEach(city => {
            const cityCoords = city.position;
            const cityName = city.title;
            const fontSize = city.fontSize;

            let point = document.createElement('div');
            point.classList.add('mark');
            point.style.left = `${cityCoords.x}px`;
            point.style.top = `${cityCoords.y}px`;

            let pointImg = document.createElement('img');
            pointImg.src = 'assets/ellipse.svg';
            pointImg.alt = 'Точка';
            pointImg.width = 8;
            pointImg.height = 8;

            let pointTitle = document.createElement('p');
            pointTitle.classList.add('mark__title');
            point.style.fontSize = `${fontSize}px`;
            pointTitle.textContent = cityName;

            if (cityName !== "Томск" && cityName !== "Хабаровск") {
                pointTitle.style.lineHeight = `${fontSize}px`;
                point.appendChild(pointImg);
                point.appendChild(pointTitle);
            } else {
                pointTitle.style.lineHeight = `0`;
                point.appendChild(pointTitle);
                point.appendChild(pointImg);
            }
            mapFigure.appendChild(point);
        });
    }

    // Directions items hover effect
    function addHoverEffect() {
        const directionsItems = document.querySelectorAll('.directions__item');

        if (document.documentElement.clientWidth > 1200) {
            directionsItems.forEach(item => {
                item.addEventListener('mouseover', function() {
                    item.querySelector('.directions__item-text').style.display = 'block';
                    item.querySelector('.directions__item-block').classList.remove('regular');
                    item.querySelector('.directions__item-block').classList.add('hover');
                });

                item.addEventListener('mouseout', function() {
                    item.querySelector('.directions__item-text').style.display = 'none';
                    item.querySelector('.directions__item-block').classList.remove('hover');
                    item.querySelector('.directions__item-block').classList.add('regular');
                });
            });
        }
    }
    addHoverEffect();
    window.addEventListener('resize', addHoverEffect);

    /* Slider */
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        pagination: {
            el: '.corporate-life__swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.corporate-life__swiper-buttons-next',
            prevEl: '.corporate-life__swiper-buttons-prev',
        },
    });
});