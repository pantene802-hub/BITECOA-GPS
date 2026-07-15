// =============================
// BITECOA GPS TRACKER
// =============================

// GANTI DENGAN IP ESP32 KAMU
const ESP32_IP = "10.210.94.94";

let watchID = null;
let map = null;
let marker = null;

// =============================
// Membuat Peta
// =============================
function initMap(){

    map = L.map('map').setView([-7.7956,110.3695],15);

    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxZoom:19,
            attribution:'© OpenStreetMap'
        }
    ).addTo(map);

    marker = L.marker([-7.7956,110.3695]).addTo(map);

}

// =============================
// Mulai Tracking
// =============================
function mulaiGPS(){

    if(!navigator.geolocation){
        alert("Browser tidak mendukung GPS.");
        return;
    }

    document.getElementById("status").innerHTML="🟢 Tracking";

    document.getElementById("btnMulai").disabled=true;
    document.getElementById("btnStop").disabled=false;

    watchID = navigator.geolocation.watchPosition(

        function(pos){

            let lat = pos.coords.latitude;
            let lng = pos.coords.longitude;
            let acc = pos.coords.accuracy;

            document.getElementById("lat").innerHTML = lat.toFixed(6);
            document.getElementById("lng").innerHTML = lng.toFixed(6);
            document.getElementById("acc").innerHTML = acc.toFixed(2)+" Meter";
            document.getElementById("time").innerHTML =
                new Date().toLocaleTimeString();

            marker.setLatLng([lat,lng]);

            map.setView([lat,lng],18);

            kirimKeESP32(lat,lng);

        },

        function(error){

            alert(error.message);

        },

        {
            enableHighAccuracy:true,
            maximumAge:0,
            timeout:10000
        }

    );

}

// =============================
// Stop Tracking
// =============================
function stopGPS(){

    if(watchID!==null){

        navigator.geolocation.clearWatch(watchID);

        watchID=null;

    }

    document.getElementById("status").innerHTML="🔴 Berhenti";

    document.getElementById("btnMulai").disabled=false;
    document.getElementById("btnStop").disabled=true;

}

// =============================
// Kirim ke ESP32
// =============================
function kirimKeESP32(lat,lng){

    fetch(`http://${ESP32_IP}/gps?lat=${lat}&lng=${lng}`)
    .then(res=>res.text())
    .then(data=>{

        console.log(data);

    })
    .catch(err=>{

        console.log("ESP32 Offline");
        console.log(err);

    });

}

// =============================
// Jalankan Saat Halaman Dibuka
// =============================
window.onload=function(){

    initMap();

};
