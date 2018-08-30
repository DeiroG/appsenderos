/* This app can be configured by changing the variables
in this file.

Webscene:
 - copy the webscene that I use: http://www.arcgis.com/home/item.html?id=d0580bb5df3840d384bda44b6ddeb54e
 - remove/add layers with additional data in the Layers group
 - remove/add basemap layers in the Basemap group

Data:
 - replace the trails service url
 - replace the attribute names to the ones in your service
 - remove attributes if they don't make sense for your data
 - Status has hard-coded values Open/Closed (whether the track is open or closed)
 - filterOptions are the attributes that will be used for filtering
    they can be removed in case they are not useful
"https://services2.arcgis.com/cFEFS0EWrhfDeVw9/arcgis/rest/services/SwissNationalParkTrails/FeatureServer/0"
    

Colors:
 - change the colors for visualizing the trails
 - for CSS colors check also the variables.scss file - selectedTrail is $orange

 Flickr API key:
 - your Flickr API key: https://www.flickr.com/services/api/
 - set it to an empty string if no Flickr images should be displayed
*/

export default {
  scene: {
    websceneItemId: "5b5f90782875427f8cdad9922e0e7597"
  },
  data: {
    trailsServiceUrl: "https://services.arcgis.com/DDzi7vRExVRMO5AB/ArcGIS/rest/services/senderosCocuy/FeatureServer/0",
    trailAttributes: {
      name: "Name",
      id: "RouteId",
      difficulty: "Difficulty",
      walktime: "Hiketime",
      status: "Access",
      ascent: "Ascent",
      description: "Description"
    },
    filterOptions: {
      singleChoice: ["difficulty", "status"], // have string values 
      range: ["ascent"] // have numeric values "walktime", 
    }
  },
  colors: {
    defaultTrail: "#db5353",
    selectedTrail: "#f9a352"
  },
  flickrApiKey: "70ccb733a3f3dc6ab85165bccab2cae9"
};
