import React, {Component} from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4maps from "@amcharts/amcharts4/maps";
import  am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

import {data} from "../../data/legacy/visited";

class Map extends Component {
    componentDidMount() {
        let chart = am4core.create("chartdiv", am4charts.XYChart);
    
        am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_dark);
            am4core.useTheme(am4themes_animated);
            // Themes end
            
            // Create map instance
            var chart = am4core.create("chartdiv", am4maps.MapChart);
            
            // Set map definition
            chart.geodata = am4geodata_worldLow;
            
            // Set projection
            chart.projection = new am4maps.projections.Miller();
            
            // Create map polygon series
            var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
            
            // Exclude Antartica
            polygonSeries.exclude = ["AQ"];
            
            // Make map load polygon (like country names) data from GeoJSON
            polygonSeries.useGeodata = true;
            
            // Configure series
            var polygonTemplate = polygonSeries.mapPolygons.template;
            polygonTemplate.tooltipText = "{name}";
            polygonTemplate.polygon.fillOpacity = 0.6;
            
            
            // Create hover state and set alternative fill color
            var hs = polygonTemplate.states.create("hover");
            hs.properties.fill = chart.colors.getIndex(0);
            
            // Add image series
            var imageSeries = chart.series.push(new am4maps.MapImageSeries());
            imageSeries.mapImages.template.propertyFields.longitude = "longitude";
            imageSeries.mapImages.template.propertyFields.latitude = "latitude";
            imageSeries.mapImages.template.tooltipText = "{title}";
            imageSeries.mapImages.template.propertyFields.url = "url";
            
            var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
            circle.radius = 3;
            circle.propertyFields.fill = "color";
            
            var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
            circle2.radius = 3;
            circle2.propertyFields.fill = "color";
            
            
            circle2.events.on("inited", function(event){
              animateBullet(event.target);
            })
            
            
            function animateBullet(circle) {
                var animation = circle.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
                animation.events.on("animationended", function(event){
                  animateBullet(event.target.object);
                })
            }
                    
            imageSeries.data = data; 
            
            
            
            });
    
        this.chart = chart;
      }

      componentWillUnmount() {
        console.log("unmount")
        if (this.chart) {
          this.chart.dispose();
        }
      }

    render() {

        return (
        <>    
            <div id="chartdiv"></div>
        </>
        )
      }

}

export default Map;
