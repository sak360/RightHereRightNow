var RideDistApp = Class.extend({

    construct: function() {
        this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
        this.barCanvasWidth = 1500;
        this.barCanvasHeight = 400;

        this.barWidth = 0;
        this.barHeight = 0;
        
        this.svgBar1 = null;
        this.svgBar2 = null;
        
        this.myTag = "";
    },

    /////////////////////////////////////////////////////////////

    startup: function (whereToRender)
    {
        this.myTag = whereToRender;
        this.updateScreen();
    },

    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the first visualization group.  
    drawBarChart1: function (error, data)
    {
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        var svg = this.svgBar1;
        
        svg.selectAll("*").remove();
                
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .5);
        var y = d3.scale.linear()
            .rangeRound([height, 0]);
        var color = d3.scale.ordinal()
            .range(["#98abc5"]);
         
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        color.domain(d3.keys(data[0])
            .filter(function(key) {return key == "TOTAL_TRIPS"}));       
            
        data.forEach(function(d) {
            d.DIST_METERS = +d.DIST_METERS;
            d.TOTAL_TRIPS = +d.TOTAL_TRIPS;
        });
         
        x.domain(data.map(function(d) { return d.DIST_METERS; }));
        y.domain([0, d3.max(data, function(d) { return d.TOTAL_TRIPS; })]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("y", 50)
        .attr("x", width/2)
        .attr("dx", ".71em")
        .style("text-anchor", "middle")
        .text("Distance Interval");
         
        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Trips");
         
        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) { return x(d.DIST_METERS); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.TOTAL_TRIPS); })
            .attr("height", function(d) { return height - y(d.TOTAL_TRIPS); });

        svg.selectAll("text.label")
            .data(data)
            .enter().append("text")
            .text(function(d) {
                return d.TOTAL_TRIPS;
            })
            .attr("x", function(d, index) {
                return (x(d.DIST_METERS) + (x.rangeBand()/2)) - 25;
            })
            .attr("y", function(d) {
                return y(d.TOTAL_TRIPS);
            })
            .style("font-size","120%");
        
        svg.selectAll(".chart-title")
            .data(data)
           .enter()
           .append("text")
           .attr("x", width/2)
           .attr("y", height-600)
           .attr("text-anchor","middle")
           .attr("font-family", "sans-serif")
           .attr("font-size","20pt")
           .text("Ride Dist. By Distance Bar Chart");
    },

    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the second visualization group.     
    drawBarChart2: function (error, data)
    {
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        var svg = this.svgBar2;
        
        svg.selectAll("*").remove();
                
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .5);
        var y = d3.scale.linear()
            .rangeRound([height, 0]);
        var color = d3.scale.ordinal()
            .range(["#98abc5"]);
         
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        color.domain(d3.keys(data[0])
            .filter(function(key) {return key == "TOTAL_TRIPS"}));       
            
        data.forEach(function(d) {
            d.TRIP_DURATION = +d.TRIP_DURATION;
            d.TOTAL_TRIPS = +d.TOTAL_TRIPS;
        });
         
        x.domain(data.map(function(d) { return d.TRIP_DURATION; }));
        y.domain([0, d3.max(data, function(d) { return d.TOTAL_TRIPS; })]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("y", 50)
        .attr("x", width/2)
        .attr("dx", ".71em")
        .style("text-anchor", "middle")
        .text("Time Interval");
         
        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Trips");
         
        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) { return x(d.TRIP_DURATION); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.TOTAL_TRIPS); })
            .attr("height", function(d) { return height - y(d.TOTAL_TRIPS); });

        svg.selectAll("text.label")
            .data(data)
            .enter().append("text")
            .text(function(d) {
                return d.TOTAL_TRIPS;
            })
            .attr("x", function(d, index) {
                return (x(d.TRIP_DURATION) + (x.rangeBand()/2)) - 25;
            })
            .attr("y", function(d) {
                return y(d.TOTAL_TRIPS);
            })
            .style("font-size","120%");
        
        svg.selectAll(".chart-title")
            .data(data)
           .enter()
           .append("text")
           .attr("x", width/2)
           .attr("y", height-600)
           .attr("text-anchor","middle")
           .attr("font-family", "sans-serif")
           .attr("font-size","20pt")
           .text("Ride Dist. By Time Bar Chart");   },
    
    /////////////////////////////////////////////////////////////

    updateWindow: function ()
    {
        var xWin, yWin;
        
        xWin = d3.select(this.myTag).style("width");
        yWin = d3.select(this.myTag).style("height");

        this.barWidth = xWin;
        this.barHeight = yWin;
        
        var totalBarSizeX = this.barCanvasWidth+this.barMargin.left+this.barMargin.right;
        var totalBarSizeY = this.barCanvasHeight+this.barMargin.top+this.barMargin.bottom;

        switch(this.myTag){
            case "#barchart1":
                this.svgBar1 = d3.select(this.myTag).append("svg:svg")
                .attr("width", this.barWidth)
                .attr("height", this.barHeight)
                .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#barchart2":
                this.svgBar2 = d3.select(this.myTag).append("svg:svg")
                .attr("width", this.barWidth)
                .attr("height", this.barHeight)
                .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            }
    },

    /////////////////////////////////////////////////////////////

    updateData: function (){    
        switch(this.myTag){
            case "#barchart1":
                var fileToLoad = "App/json/RideDist/ride_dist_by_distance.json";
                this.inDataCallbackFunc = this.drawBarChart1.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#barchart2":
                var fileToLoad = "App/json/RideDist/ride_dist_by_time.json";
                this.inDataCallbackFunc = this.drawBarChart2.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
        }
    },

    /////////////////////////////////////////////////////////////

    updateScreen: function (){
      this.updateWindow();
      this.updateData();
    },
    
    /////////////////////////////////////////////////////////////

    init: function(whereToRender){
        
        this.loadMap();
    }

});