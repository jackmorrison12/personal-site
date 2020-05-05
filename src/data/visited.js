import * as am4core from "@amcharts/amcharts4/core";

var colorSet = new am4core.ColorSet();
            
const data = [{
  "title": "Lapland",
  "latitude": 67.9222,
  "longitude": 26.5046,
  "color":colorSet.next()
}, {
  "title": "London",
  "latitude": 51.5002,
  "longitude": -0.1262,
  "color":colorSet.next()
}, {
  "title": "Washington D.C.",
  "latitude": 38.8921,
  "longitude": -77.0241,
  "color":colorSet.next()
}, {
  "title": "Paris",
  "latitude": 48.8567,
  "longitude": 2.3510,
  "color":colorSet.next()
}, {
  "title": "Estepona",
  "latitude": 36.4256,
  "longitude": -5.1510,
  "color":colorSet.next()
}, {
  "title": "Barcelona",
  "latitude": 41.3851,
  "longitude": -2.1734,
  "color":colorSet.next()
}, {
  "title": "Cartaegena",
  "latitude": 37.6257,
  "longitude": -0.9966,
  "color":colorSet.next()
}, {
  "title": "Gibraltar",
  "latitude": 36.1408,
  "longitude": -5.3536,
  "color":colorSet.next()
}, {
  "title": "Rome",
  "latitude": 41.9028,
  "longitude": 12.4964,
  "color":colorSet.next()
}, {
  "title": "Naples",
  "latitude": 40.8518,
  "longitude": 14.2681,
  "color":colorSet.next()
}, {
  "title": "Pisa",
  "latitude": 43.7228,
  "longitude": 10.4017,
  "color":colorSet.next()
}, {
  "title": "Florence",
  "latitude": 43.7696,
  "longitude": 11.2558,
  "color":colorSet.next()
}, {
  "title": "Cannes",
  "latitude": 43.5528,
  "longitude": 7.0174,
  "color":colorSet.next()
}, {
  "title": "Marseille",
  "latitude": 43.2965,
  "longitude": 5.3698,
  "color":colorSet.next()
}, {
  "title": "Lisbon",
  "latitude": 38.7223,
  "longitude": -9.1393,
  "color":colorSet.next()
}, {
  "title": "Bilbao",
  "latitude": 43.2630,
  "longitude": -2.9350,
  "color":colorSet.next()
}, {
  "title": "Eindhoven",
  "latitude": 51.5002,
  "longitude": 5.4697,
  "color":colorSet.next()
}, {
  "title": "Livigno",
  "latitude": 46.5386,
  "longitude": 10.1357,
  "color":colorSet.next()
}, {
  "title": "Zakynthos",
  "latitude": 37.7870,
  "longitude": 20.8999,
  "color":colorSet.next()
}, {
  "title": "Izmir",
  "latitude": 38.4237,
  "longitude": 27.1428,
  "color":colorSet.next()
}, {
  "title": "Valletta",
  "latitude": 35.8989,
  "longitude": 14.5146,
  "color":colorSet.next()
}, {
  "title": "Nicosia",
  "latitude": 35.1856,
  "longitude": 33.3823,
  "color":colorSet.next()
}, {
  "title": "Lanzarote",
  "latitude": 29.0469,
  "longitude": -13.5900,
  "color":colorSet.next()
}, {
  "title": "Dubai",
  "latitude": 25.1124,
  "longitude": 55.1390,
  "color":colorSet.next()
}, {
  "title": "Bali",
  "latitude": -8.3405,
  "longitude": 115.0920,
  "color":colorSet.next()
}, {
  "title": "Koh Samui",
  "latitude": 9.5120,
  "longitude": 100.0136,
  "color":colorSet.next()
 }, {
  "title": "Singapore",
  "latitude": 1.3521,
  "longitude": 103.8198,
  "color":colorSet.next()
}, {
  "title": "Hong Kong",
  "latitude": 22.3193,
  "longitude": 114.1694,
  "color":colorSet.next()
}, {
  "title": "Orlando",
  "latitude": 28.5383,
  "longitude": -81.3792,
  "color":colorSet.next()
}, {
  "title": "Miami",
  "latitude": 26.1224,
  "longitude": -80.1373,
  "color":colorSet.next()
}, {
  "title": "Boston",
  "latitude": 42.3601,
  "longitude": -71.0589,
  "color":colorSet.next()
}, {
  "title": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "color":colorSet.next()
}, {
  "title": "Los Angeles",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "color":colorSet.next()
}, {
  "title": "San Francisco",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "color":colorSet.next()
}, {
  "title": "Las Vegas",
  "latitude": 36.1699,
  "longitude": -115.1398,
  "color":colorSet.next()
}, {
  "title": "Phoenix",
  "latitude": 33.4484,
  "longitude": -112.0740,
  "color":colorSet.next()
}, {
  "title": "Santa Barbara",
  "latitude": 34.4208,
  "longitude": -119.6982,
  "color":colorSet.next()
}, {
  "title": "San Diego",
  "latitude": 32.7157,
  "longitude": -117.1611,
  "color":colorSet.next()
}, {
  "title": "Cancún",
  "latitude": 21.1619,
  "longitude": -86.8515,
  "color":colorSet.next()
}, {
  "title": "Cozumel",
  "latitude": 20.4230,
  "longitude": -86.9223,
  "color":colorSet.next()
}, {
  "title": "Labadee",
  "latitude": 19.7721,
  "longitude": -72.2475,
  "color":colorSet.next()
}, {
  "title": "Ocho Rios",
  "latitude": 18.4074,
  "longitude": -77.1031,
  "color":colorSet.next()
}, {
  "title": "George Town",
  "latitude": 19.2869,
  "longitude": -81.3674,
  "color":colorSet.next()
}, {
  "title": "St Andrews",
  "latitude": 56.3398,
  "longitude": -2.7967,
  "color":colorSet.next()
}, {
  "title": "Nice",
  "latitude": 43.7102,
  "longitude": 7.2620,
  "color":colorSet.next()
}, {
  "title": "Menorca",
  "latitude": 39.9496,
  "longitude": 4.1104,
  "color":colorSet.next()
}]

let len = data.length;

export {data, len};
