import { formTemplate } from './templates';
import './yandex.html';
import './styles/main.css';


let ymaps;
let clusterer;

document.addEventListener('DOMContentLoaded', function() {
    ymaps = window.ymaps;
    ymaps.ready(init);
})


function init(){
    const myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 12
    });

    myMap.events.add('click', function(e) {
        const coords = e.get('coords');
        console.log (coords);

        openBalloon(myMap, coords, []);
    });

    clusterer = new ymaps.Clusterer({clusterDisableClickZoom: true});
    clusterer.options.set('hasBalloon', false);
    
    renderGeoObjects(myMap);

    clusterer.events.add('click', function(e) {
        let geoObjectsInCluster = e.get('target').getGeoObjects();
        openBalloon(myMap, e.get('coords'), geoObjectsInCluster);
    });
}

function getReviewsFromLS() {
    const reviews = localStorage.reviews;
    return JSON.parse(reviews || '[]');
}

function getReviewList(currentGeoObjects) {
    let reviewListHTML = '';
    
    
    for(const review of getReviewsFromLS()) {
        if(currentGeoObjects.some(geoObject => JSON.stringify(geoObject.geometry._coordinates) === JSON.stringify(review.coords))) {
            
            reviewListHTML += `
            <div class="review">
                <div class="review review__cont">
                    <div class="review review__author">${review.author}</div>
                    <div class="review review__place">${review.place}</div>
                    <div class="review review__date">${review.currentDate}. ${review.currentMonth}. ${review.currentYear} </div>
                </div>
                <div class="review review__text">${review.reviewText}</div>
            </div>
            `
        }

    }
    return reviewListHTML;
}

function renderGeoObjects(map) {
    const geoObjects = [];
    
    for (const review of getReviewsFromLS()) {
        const placemark = new ymaps.Placemark(review.coords);
        placemark.events.add('click', function(e) {
            e.stopPropagation();
            openBalloon(map, review.coords, [e.get('target')]);
        });
        geoObjects.push(placemark);
    }

    clusterer.removeAll();
    map.geoObjects.remove(clusterer);
    clusterer.add(geoObjects);
    map.geoObjects.add(clusterer);
}

async function openBalloon(map, coords, currentGeoObjects) {
    await map.balloon.open(coords, {
        content: `<div class="reviews">${getReviewList(currentGeoObjects)}</div>` + formTemplate
        
    },
    {
        maxWidth:353,
        maxHeight:501,
        
    });

    document.querySelector('#add-form').addEventListener('submit', function(e) {
        e.preventDefault();
        let now = new Date();
            
        const review = {
            currentYear:now.getFullYear(),
            currentMonth:now.getMonth(),
            currentDate:now.getDate(),
            coords:coords,
            author: this.elements.author.value,
            place: this.elements.place.value,
            reviewText: this.elements.review.value
        }

        localStorage.reviews = JSON.stringify([...getReviewsFromLS(), review]);

        
        renderGeoObjects(map);
        
        

        map.balloon.close();
    });
}

