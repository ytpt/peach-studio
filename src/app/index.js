import { regions } from './data';
import triangleDown from '../assets/triangle-down.svg';
import ellipse from '../assets/ellipse.svg';

document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.querySelector('.map__container');
    const mapHeaderButtons = document.querySelectorAll('.map__header');
    const mapHeader = document.querySelector('.map__header');
    const mapImg = document.querySelector('.map__figure');
    const mapNav = document.querySelector('.map__nav');
    const mapButtons = document.querySelectorAll('.map__link');
    const hiddenMenu = document.querySelector('.map__menu--hidden');
    const regionBlocks = document.querySelectorAll('.map__item--hidden');

    // Set attributes function
    const setAttributes = (elem, alt, path) => {
        elem.setAttribute('alt', alt);
        elem.setAttribute('src', path);
    }

    //Create triangle marker
    let triangle = document.createElement('img');
    setAttributes(triangle, 'Вниз', triangleDown);
    triangle.classList.add('triangle');

    // Toggle active menu button
    mapButtons.forEach(link => {
        link.addEventListener('click', function() {
            document.querySelector('.active').classList.remove('active');
            link.classList.add('active');
        });
    });

    // Hide hidden menu
    const hideMenu = (arrowIcon) => {
        arrowIcon.setAttribute('alt', 'Вниз');
        arrowIcon.style.transform = 'scale(1)';
        mapButtons.forEach(btn => btn.classList.toggle('disable'));
        mapImg.classList.toggle('disable');
    }

    // Toggle sublist
    regionBlocks.forEach(region => {
        region.addEventListener('click', function () {
            const regionTitle = region.querySelector('.map__title--hidden');
            const triangleItem = region.querySelector('.triangle');
            const triangleAlt = triangleItem.getAttribute('alt');

            if (triangleAlt === 'Вниз') {
                if (region.querySelector('.map__sublist')) {
                    region.querySelector('.map__sublist').style.display = 'flex';
                    triangleItem.style.transform = 'scaleY(-1)';
                    triangleItem.setAttribute('alt', 'Вверх');
                    regionTitle.style.color = 'var(--color-red)';
                }
            } else {
                if (region.querySelector('.map__sublist')) {
                    region.querySelector('.map__sublist').style.display = 'none';
                }
                triangleItem.style.transform = 'scaleY(1)';
                triangleItem.setAttribute('alt', 'Вниз');
                regionTitle.style.color = 'var(--color-dark)';
            }
        })
    });

    // Toggle hidden map menu
    mapHeaderButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            hiddenMenu.classList.toggle('visible');
            
            regionBlocks.forEach(region => {
                // Add triangle markers
                if (!region.querySelector('.triangle')) {
                    const clonedTriangle = triangle.cloneNode(true);
                    region.firstElementChild.append(clonedTriangle);
                }
            });
            const arrowIcon = btn.querySelector('.map__header-icon');
            const arrowAlt = arrowIcon.getAttribute('alt');

            if (arrowAlt === 'Вниз') {
                mapButtons.forEach(btn => btn.classList.toggle('disable'));
                mapImg.classList.toggle('disable');
                arrowIcon.style.transform = 'scaleY(-1)';
                arrowIcon.setAttribute('alt', 'Вверх');
            } else {
                hideMenu(arrowIcon);
            }

            if (window.innerWidth < 769) {
                mapContainer.style.width = 'auto';
            }
        })
    })

    // Hide hidden menu while click outside menu
    let menuVisible = false;

    document.addEventListener('click', function(event) {
        const isClickInsideMenu = hiddenMenu.contains(event.target);
        const isClickOnHeaderButton = mapHeader.contains(event.target);
        const isClickOnNav = mapNav.contains(event.target);
        const arrowIcon = mapHeader.querySelector('.map__header-icon');

        if (isClickInsideMenu || isClickOnHeaderButton || isClickOnNav) {
            menuVisible = true;
        } else if (!isClickInsideMenu && !isClickOnHeaderButton && !isClickOnNav && menuVisible) {
            if (hiddenMenu.classList.contains('visible')) {
                hiddenMenu.classList.remove('visible');
                hideMenu(arrowIcon);
            }
            menuVisible = false;
        }
    });

    // Toggle map cities marks
    const mapFigure = document.querySelector('.map__figure');
    const mapLinks = document.querySelectorAll('.map__link');
    const allButton = document.querySelector('.map__link');
    let isAllCitiesShown = false;

    const showAllCities = () => {
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
            pointImg.src = ellipse;
            setAttributes(pointImg, 'Точка', ellipse);
            pointImg.classList.add('dot-size');

            let pointTitle = document.createElement('p');
            pointTitle.classList.add('mark__title');
            point.style.fontSize = `${fontSize}px`;
            pointTitle.textContent = cityName;

            if (cityName !== 'Томск' && cityName !== 'Хабаровск') {
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
            let arrowIcon = item.querySelector('.directions__item-icon');

            item.addEventListener('click', function() {
                const currentAlt = arrowIcon.getAttribute('alt');

                if (currentAlt === 'Вниз') {
                    itemBlock.classList.toggle('block-visible');
                    item.classList.toggle('item-expand');
                    itemText.style.display = 'block';
                    arrowIcon.style.transform = 'scaleY(-1)';
                    arrowIcon.setAttribute('alt', 'Вверх');
                } else {
                    item.classList.toggle('item-expand');
                    itemBlock.classList.toggle('block-visible');
                    itemText.style.display = 'none';
                    arrowIcon.style.transform = 'scaleY(1)';
                    arrowIcon.setAttribute('alt', 'Вниз');
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