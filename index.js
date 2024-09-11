const script = document.createElement('script');
script.src = '../solar-roof-estimator/geotiff/geotiff.js';
document.head.appendChild(script);
script.onload = function() {
    console.log('geotiff loaded successfully');
  };
var buildingInsights = "";
var dataLayersUrls = "";
var api = 'AIzaSyBgBzxUb1STGGRI4gMGooODJYRVG_yUK9o';
var center = { latitude: 40.7303257, longitude: -73.9350145 };
const dataLayersObj = {
    "imageryDate": {
        "year": 2021,
        "month": 5,
        "day": 14
    },
    "imageryProcessedDate": {
        "year": 2022,
        "month": 3,
        "day": 21
    },
    "dsmUrl": "https://solar.googleapis.com/v1/geoTiff:get?id=ODI2MmRiMGZkMWE5ZjExMWE5MTM4ZTgxOTgxMTQzZTAtMjI0ODhiMmFiMGE1ODg3NDM1ZDJlYmY5MTc3ZDg3OTI6RFNNOkhJR0g",
    "rgbUrl": "https://solar.googleapis.com/v1/geoTiff:get?id=YTcyYzVlM2M1NWJiMTFlOWNiYmViMGVlMDlmZTdkN2UtY2I1YjlkMzc4NDAxMTMyNWJjODI4YTRkMDcyN2EwY2I6UkdCOkhJR0g",
    "maskUrl": "https://solar.googleapis.com/v1/geoTiff:get?id=NjkzN2Y1ZDliMWY3NjEwOWUzMjg2MjE2MTg4ZTFiOWEtYzdhMzUwOWZmNzFhMmQ3MTUwZmZlNzQxYzQ5ODUwNjY6TUFTSzpISUdI",
    "annualFluxUrl": "https://solar.googleapis.com/v1/geoTiff:get?id=OGEwZGI1MDgwMWI2ZjhlNDk3YTE0YTY4NzBmZWI4ZDYtZTFlZmZhMjQxM2U5NTQxYjdhZTc4M2Q3ZmQ3MThjNTg6QU5OVUFMX0ZMVVg6SElHSA",
    "monthlyFluxUrl": "https://solar.googleapis.com/v1/geoTiff:get?id=NDhjNjY5ZWYzMWFkNjg5NGY1OTAxMGVlNWY4NmMxMmEtODM0NGI4NTc1Zjg0ZjU5YzI0NTU1Y2IwM2I0MGQ4YTU6TU9OVEhMWV9GTFVYOkhJR0g",
    "hourlyShadeUrls": [
        "https://solar.googleapis.com/v1/geoTiff:get?id=ZGUwZjU3NzYzOGNiZjdmYjhiNjU1OWVkNWE3YjA1M2EtNTFiOWU4ZDdiYzVlMWE5NGIwN2MxMGE1YzBjODhkZTQ6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=MWE2NGM1MjFiYzFmNjNkZjExODYzM2NiNmQxMzIxMWUtZmM5MzBmODJkYTg2MWY3ZTg5ZmJjNjUxMjY4ZGM4Mjg6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=M2FiM2VjY2U1MmJkZjcyOWY0YzFjYmM0ZWU3ODQ0NWMtYjE4MWRhN2IzZjYzNWZiMDg1NGQzOWYwZGRkY2E3ZWY6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=NzFkZDNjYzM1OGJjNDc0MWQ2MGFiODVhMzcwODUzMDctODMyY2ZlMzA2NzU4NWFkNjRmZmJiOTE3MjQ2NGM0OTc6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=MTVlZGRmOWE0MzE1YzRmZDAzOWZhODFjZDkxMDZjZDQtNzM0NDVkMjNlM2I0NzQ0ZTRjNzNhZjY4Yzc2ODBlN2E6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=NTYwYjU2YmUwMzNjNTNkZjc2MmJkNmI3OWVkZmQ1NjctYWVmNzIyOWMwMTg5YzAyZWEyODU1OTU3ZDU5MWU5NWI6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=NGNmNDNkOWM2MTM5NGMxMzJiMDkxNTNjMTQ5M2MwODQtMWY3MzVlOTJkY2I1MmFhODk4ZGQ4YzExNTFiZGU0NmM6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=NmFjOWViMmUzMTZjYzY1NzY1NzdiYzgwZjFlN2NhZGMtMDc3NjRlOTAwNWY5ZmNhZjYxY2RhNzU3ZDhiMDFlMWE6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=YmE1NTdlNjY3MWUwYjg0ZDEwZDQzY2NlMTViNmUyNTMtNTUxZmViZTE1ZGE4MWUwNWI3Yjg3YzYzZDcwYjJiZjE6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=OTUwNDIxNmNjZmQ4YTFjN2I5M2IxMzlmMTVkZDU0NTYtYmNiMWQzNWQ0NWZiNDkxMmU2NmQ4NTZhMjM2YjRkOWU6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=MjIyODBmNGFlYjY3MGU2YTg3YWE4OGRmYWU1MmU0MTktNWJlYTlhMTZiMmE3Y2JhNmI1NWJlZDMyOTEwOGFmZGE6SE9VUkxZX1NIQURFOkhJR0g",
        "https://solar.googleapis.com/v1/geoTiff:get?id=NDY1YmI1NWIwMWQ1ZDYxYjlmYTQxZjBjNDdjZDZiY2QtMzg4YTE0NGZmZmU3NmU4YjIyOGYyM2U5M2Y3OWE0Nzc6SE9VUkxZX1NIQURFOkhJR0g"
    ],
    "imageryQuality": "HIGH"
};

async function getBuildingInsights(lat, lng) {
    const apiKey = 'AIzaSyBgBzxUb1STGGRI4gMGooODJYRVG_yUK9o';
    const solarApiUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${apiKey}`;
  
    try {
      const response = await fetch(solarApiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching solar data: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching solar data:', error);
      throw error;
    }
  }

  getBuildingInsights(40.730610, -73.935242)
  .then(data => {
    console.log('Building Insights:', data);
    this.buildingInsights = data;
  })
  .catch(error => {
    console.error('Error fetching building insights:', error);
  });

  async function getDataLayerUrls(location, radiusMeters, apiKey) {
    const args = {
      'location.latitude': location.latitude.toFixed(5),
      'location.longitude': location.longitude.toFixed(5),
      radius_meters: radiusMeters.toString(),
      // The Solar API always returns the highest quality imagery available.
      // By default the API asks for HIGH quality, which means that HIGH quality isn't available,
      // but there is an existing MEDIUM or LOW quality, it won't return anything.
      // Here we ask for *at least* LOW quality, but if there's a higher quality available,
      // the Solar API will return us the highest quality available.
      required_quality: 'LOW',
    };
  
    console.log('GET dataLayers\n', args);
  
    const params = new URLSearchParams({ ...args, key: "AIzaSyBgBzxUb1STGGRI4gMGooODJYRVG_yUK9o" });
    // https://developers.google.com/maps/documentation/solar/reference/rest/v1/dataLayers/get
    const response = await fetch(`https://solar.googleapis.com/v1/dataLayers:get?${params}`);
    console.log(`https://solar.googleapis.com/v1/dataLayers:get?${params}`);
    if (!response.ok) {
      const content = await response.json();
      console.error('getDataLayerUrls\n', content);
      throw content;
    }
  
    const data = await response.json();
    console.log('dataLayersResponse', data);
    return data;
  }

  getDataLayerUrls({ latitude: 40.7303257, longitude: -73.9350145 }, 1000, "AIzaSyBgBzxUb1STGGRI4gMGooODJYRVG_yUK9o")
  .then(data => {
    console.log('Data Layer Urls:', data);
    this.dataLayersUrls = data;
  })
  .catch(error => {
    console.error('Error fetching Data Layers:', error);
  });

  async function downloadGeoTIFF(url, apiKey) {
    console.log(`Downloading data layer: ${url}`);
  
    // Include your Google Cloud API key in the Data Layers URL.
    const solarUrl = url.includes('solar.googleapis.com') ? `${url}&key=${apiKey}` : url;
    console.log("Now fetching this URL: ", solarUrl);
    
    const response = await fetch(solarUrl);
    
    if (response.status !== 200) {
      const error = await response.json();
      console.error(`downloadGeoTIFF failed: ${url}\n`, error);
      throw error;
    }
  
    // Get the GeoTIFF rasters, which are the pixel values for each band.
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await geotiff.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const rasters = await image.readRasters();
  
    // Reproject the bounding box into lat/lon coordinates.
    const geoKeys = image.getGeoKeys();
    const projObj = geokeysToProj4.toProj4(geoKeys);
    const projection = proj4(projObj.proj4, 'WGS84');
    const box = image.getBoundingBox();
    
    const sw = projection.forward({
      x: box[0] * projObj.coordinatesConversionParameters.x,
      y: box[1] * projObj.coordinatesConversionParameters.y,
    });
    
    const ne = projection.forward({
      x: box[2] * projObj.coordinatesConversionParameters.x,
      y: box[3] * projObj.coordinatesConversionParameters.y,
    });
  
    return {
      width: rasters.width,
      height: rasters.height,
      rasters: [...Array(rasters.length).keys()].map((i) =>
        Array.from(rasters[i])
      ),
      bounds: {
        north: ne.y,
        south: sw.y,
        east: ne.x,
        west: sw.x,
      },
    };
  }

  downloadGeoTIFF(dataLayersObj.dsmUrl, "AIzaSyBgBzxUb1STGGRI4gMGooODJYRVG_yUK9o").then(data => {
    console.log('Downloaded DSM:', data);
    document.getElementById('data').textContent = JSON.stringify(data);
  })