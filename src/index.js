import { regions } from './data';

document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.querySelector('.map__container');
    const mapHeaderButtons = document.querySelectorAll('.map__header');
    const mapHeader = document.querySelector('.map__header');
    const arrowIcon = document.querySelector('.map__header-icon');
    const mapImg = document.querySelector('.map__figure');
    const hiddenMenu = document.querySelector('.map__menu--hidden');
    const regionBlocks = document.querySelectorAll('.map__item--hidden');
    const mapButtons = document.querySelectorAll('.map__link');
    const arrowAlt = arrowIcon.getAttribute('alt');
    const sublistArray = document.querySelectorAll('.map__sublist');
    const regionTitleArray = document.querySelectorAll('.map__title--hidden');

    // Set attributes function
    const setAttribute = (item, alt, path) => {
        item.setAttribute('alt', alt);
        item.setAttribute('src', path);
    }

    //Create triangle marker
    const triangle = document.createElement('img');
    setAttribute(triangle, 'Вниз','assets/triangle-down.svg');
    triangle.classList.add('triangle');

    // Toggle active menu button
    mapButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.active').classList.remove('active');
            btn.classList.add('active');
        });
    });

    // Toggle sublist
    regionBlocks.forEach(region => {
        region.addEventListener('click', function () {
            const regionTitle = region.querySelector('.map__title--hidden');
            const triangleItem = region.querySelector('.triangle');
            const triangleAlt = triangleItem.getAttribute('alt');

            if (triangleAlt === 'Вниз') {
                if (region.querySelector('.map__sublist')) {
                    region.querySelector('.map__sublist').style.display = 'flex';
                    setAttribute(triangleItem, 'Вверх', 'assets/triangle-up.svg');
                    regionTitle.style.color = 'var(--color-red)';
                }
            } else {
                if (region.querySelector('.map__sublist')) {
                    region.querySelector('.map__sublist').style.display = 'none';
                }
                setAttribute(triangleItem, 'Вниз', 'assets/triangle-down.svg');
                regionTitle.style.color = 'var(--color-dark)';
            }
        })
    });

    // Toggle hidden map menu
    mapHeaderButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            regionBlocks.forEach(region => {

                // Add triangle markers
                if (!region.querySelector('.triangle')) {
                    const clonedTriangle = triangle.cloneNode(true);
                    region.firstElementChild.append(clonedTriangle);
                }
            });

            hiddenMenu.classList.toggle('visible');

            if (arrowAlt === 'Вниз') {
                mapButtons.forEach(btn => btn.classList.add('disable'));
                mapImg.classList.add('disable');
                setAttribute(arrowIcon, 'Вверх', 'assets/arrow-up-black.svg');
                sublistArray.forEach(sublist => sublist.style.display = 'none');
                regionTitleArray.forEach(title => title.style.color = 'var(--color-dark');
            } else {
                mapButtons.forEach(btn => btn.classList.remove('disable'));
                mapImg.classList.remove('disable');
                setAttribute(arrowIcon, 'Вниз', 'assets/arrow-down-black.svg');
            }

            if (window.innerWidth < 769) {
                mapContainer.style.width = 'auto';
            }
        })
    })

    // Hide hidden menu while click outside menu
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = hiddenMenu.contains(event.target);
        const isClickOnHeaderButton = mapHeader.contains(event.target);

        if (!isClickInsideMenu && !isClickOnHeaderButton) {
            if (hiddenMenu.classList.contains('visible')) {
                hiddenMenu.classList.toggle('visible');
            }

            setAttribute(arrowIcon, 'Вниз', 'assets/arrow-down-black.svg');
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
            let cityCoords;
            const cityName = city.title;
            const fontSize = city.fontSize;

            let point = document.createElement('div');
            point.classList.add('mark');

            switch (true) {
                case window.innerWidth < 768:
                    cityCoords = city.mobilePosition;
                    break;
                case window.innerWidth >= 768 && window.innerWidth < 1289:
                    cityCoords = city.tabletPosition;
                    break;
                default:
                    cityCoords = city.position;
                    break;
            }

            point.style.left = `${cityCoords.x}px`;
            point.style.top = `${cityCoords.y}px`;

            let pointImg = document.createElement('img');
            setAttribute(pointImg, 'Точка', 'assets/ellipse.svg');
            pointImg.classList.add('dot-size');

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

    /* Toggle directions items by click */
    if (window.innerWidth < 769) {
        const items = document.querySelectorAll('.directions__item');

        items.forEach(item => {
            const itemBlock = item.querySelector('.directions__item-block');
            const itemText = item.querySelector('.directions__item-text');
            const arrowIcon = item.querySelector('.directions__item-icon');

            item.addEventListener('click', function() {
                const currentAlt = arrowIcon.getAttribute('alt');
                if (currentAlt === 'Вниз') {
                    itemBlock.classList.toggle('block-visible');
                    item.classList.toggle('item-expand');
                    itemText.style.display = 'block';
                    setAttribute(arrowIcon, 'Вверх','assets/arrow-up-white.svg');
                } else {
                    item.classList.toggle('item-expand');
                    itemBlock.classList.toggle('block-visible');
                    itemText.style.display = 'none';
                    setAttribute(arrowIcon, 'Вниз','assets/arrow-down-white.svg');
                }
            })
        })
    }

    /* Slider */
    new Swiper('.swiper-container', {
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