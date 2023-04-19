var map = L.map('map').setView([25.033976, 121.5623502], 13);
// ('map') 要記得改成自己命名的 id 才不會錯誤

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// contributors 後方可加入自己的名字及網址，如 GitHub 網址或個人網頁網址


// 1.新增 init 函式，讓網頁載入時可以預設執行 init 裡的函式

function init() {
    getData();
}


// 1.定義 marker 顏色
function maskColor(color) {
    // 2.我們取出綠、橘、紅三個顏色來代表口罩數量的不同狀態
    let commonCode = new L.Icon({
        iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        // 3.只要更改上面這一段的 green.png 成專案裡提供的顏色如：red.png，就可以更改 marker 的顏色
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    return commonCode;
}



let data;

//取資料
function getData() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json', true);
    // 只要讀取資料的話，填null空值即可
    xhr.send(null);
    // onload 當資料確定有回傳了，則開始執行以下function
    xhr.onload = function () {
        data = JSON.parse(xhr.responseText).features;
        //3.這是我們下一步要用的函式，為地圖上的藥局加上 marker
        addMarker();


        // const marker = L.marker(center, {
        //     title: '跟 <a> 的 title 一樣', // 跟 <a> 的 title 一樣
        //     opacity: 1.0
        //   }).addTo(map);
    }


}
// 2.別忘了執行 init
init();

//在地圖上加上 marker
const markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 18 }).addTo(map);

function addMarker() {
    //4.在地圖上加上 marker 前，先看看資料有沒有載入成功
    //console.log(data[0].geometry.coordinates);

    data.forEach(function callback(value, index) {
        //console.log(`${index}: ${value.geometry.coordinates}`);
        //console.log(`[${value.geometry.coordinates}]`);
        const maskAdult = value.properties.mask_adult;
        const maskChild = value.properties.mask_child;
        console.log(value.properties);


        //座標
        const lat = value.geometry.coordinates[1];
        const lng = value.geometry.coordinates[0];

        let mask;
        // 2.下判斷式，依據不同的口罩數量，來顯示不同的 marker 顏色
        if (maskAdult == 0 || maskChild == 0) {
            //mask = redIcon;
            mask = maskColor('red');
        } else if (maskAdult < 100 && maskAdult !== 0 || maskChild < 100 && maskChild !== 0) {
            mask = maskColor('orange');
        } else {
            mask = maskColor('green');
        }


        // 3.最後，將 marker 標至地圖上
        let properties = value.properties;
        markers.addLayer(L.marker([lat,lng], {icon: mask}).bindPopup(`<b>${properties.name}</b><hr><p class="popupText"><i class="fas fa-map-marker-alt"></i> ${properties.address}</p><p class="popupText"><i class="fa-solid fa-phone"></i>${properties.phone}</p><p class="popupText"><i class="fa-solid fa-bell"></i>${properties.note}</p><div>
        成人口罩：${maskAdult}
        兒童口罩：${maskChild}

        </div>`));
        
        // L.marker([lat, lng], {
        //     icon: mask
        // }).addTo(map);

        //var marker = L.marker([lat, lng]).addTo(map);


        // var circle = L.marker([25.033976, 121.5623502], {
        //    // color: 'red',
        //     fillColor: '#f03',
        //     fillOpacity: 0.5,
        //     radius: 500,
        //     icon: L.divIcon({
        //         //className: 'my-custom-icon',
        //         html: "5"
        //     })
        // }).addTo(map);

        //circle.bindPopup("I am a circle.");

    });
    map.addLayer(markers);

    //geometry,coordinates

    //var marker = L.marker([25.033976, 121.5623502]).addTo(map);




}