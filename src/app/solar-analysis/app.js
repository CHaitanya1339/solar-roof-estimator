import fetch from 'node-fetch';
import * as geotiff from 'geotiff';
import proj4 from 'proj4';
import { geokeysToProj4 } from 'geotiff-geokeys-to-proj4';
import geotiff from '../solar';



async function downloadGeoTIFF(url, apiKey){
  console.log(`Downloading data layer: ${url}`);
  const solarUrl = url.includes('solar.googleapis.com') ? `${url}&key=${apiKey}` : url;
  
  try {
    const response = await fetch(solarUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP Error ${response.status}: ${response.statusText}`);
      console.error(`Response body: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await geotiff.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const rasters = await image.readRasters();
    
    // ... rest of the function remains the same ...
    
  } catch (error) {
    console.error('Error in downloadGeoTIFF:', error);
    throw error;
  }
}

// Test the function
const url = "https://solar.googleapis.com/v1/geoTiff:get?id=YWM0MWU3ODhiNDA1YWM3ZTA4ZjdmMjc2YTkyNzJlZGYtOTY5OWRkMjdiODQ3YzVmNjBjMTdjOGJhZDI5ZDg0YWM6TUFTSzpMT1c";
const apiKey = "YOUR_API_KEY_HERE";

downloadGeoTIFF(url, apiKey)
  .then(result => console.log('GeoTIFF downloaded successfully:', result))
  .catch(error => console.error('Failed to download GeoTIFF:', error));