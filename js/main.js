function DataModel() {

    var self = this;
    self.countData = [];
    self.rateData = [];
    
    /* Retrives data for visualization */
    self.getData = function () {
        
      d3.csv("data/prosperLoanData_reduced.csv", self.draw);
        
    };
    
    //Callback once data has been retrived and loaded.
    self.draw = function(data) {
        
        var margin = 75,
            width = 1400 - margin,
            height = 600 - margin;

        d3.select("body")
            .append("h2")
            .text("Out of the frying pan, into the fire");

        var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin)
            .attr("height", height + margin)
            .append('g')
            .attr('class', 'chart');
    
        
        //Returns aggregate loan count
        function loanCount(leaves) {
            return leaves.length;
        };
        
        //Returns aggregate borrower APR for charting
        function rateAvg(leaves) {
            
            return d3.mean(leaves, function(d) {
                return d['BorrowerAPR'];
            });
            
        }
        
        //Get aggregated count data.
        var nested = d3.nest()
                        .key(function (d) {
                            
                            return d['LoanOriginationQuarter'];
                            
                        }).sortKeys(d3.ascending)
                        .key(function (d) {
                            
                            return d['CreditCategory'];
                            
                        })
                        .rollup(loanCount)
                        .entries(data);
        
        self.countData = self.flattenObject(nested, 'count');
        
        //Get aggregated APR data.
        nested = d3.nest()
                .key(function (d) {

                    return d['LoanOriginationQuarter'];

                }).sortKeys(d3.ascending)
                .key(function (d) {

                    return d['CreditCategory'];

                })
                .rollup(rateAvg)
                .entries(data);

        self.rateData = self.flattenObject(nested, 'rateAverage');
        
        /*
        console.log(self.rateData);
        var svg = dimple.newSvg('#chart-area', 600, 400);
        var myChart = new dimple.chart(svg, self.rateData);
        myChart.setBounds(60, 30, 510, 330);
        
        myChart.addCategoryAxis('x', ['creditCategory']);
        myChart.addMeasureAxis('y', 'rateAverage');
        myChart.addSeries('creditCategory', dimple.plot.bar);
        myChart.addLegend(60, 10, 500, 20, "right");
        myChart.draw();
        */
        
          var svg = dimple.newSvg("#chart-area", 490, 430);
          d3.csv("data/Birds.csv", function(data) {
              console.log(data);
              var myChart = new dimple.chart(svg, data);
              myChart.setBounds(60, 10, 400, 330)
              var x = myChart.addCategoryAxis("x", ["SPECIES"]);
              myChart.addMeasureAxis("y", "D/S");
              var s = myChart.addSeries("SPECIES", dimple.plot.bar);
              s.barGap = 0.05;
              myChart.draw();
          });
        
        
        /*
        var x = myChart.addTimeAxis("x", "year"); 
          x.dateParseFormat = "%Y";
          x.tickFormat = "%Y";
          x.timeInterval = 4;
          myChart.addMeasureAxis("y", "attendance");
          myChart.addSeries(null, dimple.plot.line)//.lineMarkers = true;
          myChart.addSeries(null, dimple.plot.scatter); //Same as adding line markers.
          myChart.draw();
        */
        
        /*
              svg.append('g')
                .attr('class', 'bubble')
                .selectAll('circle')
                .data(nested.sort(function(a, b) {
                  
                  return b.values.attendance - a.values.attendance;
                  
                }), key_func)
                .enter()
                .append('circle')
                .attr('cx', function(d) {
                  
                  return d.values.x
                })
                .attr('cy', function(d) {
                  
                  return d.values.y
                  
              })
              .attr('r', function(d) {
                 
                  return radius(d.values.attendance);
                  
              })
              .attr('fill', 'rgb(247, 148, 32)')
              .attr('stroke', 'black')
              .attr('stroke-width', 0.7)
              .attr('opacity', 0.7)
              
          };
        */
        
    };
    
    /*Dimple.js will not handle nested JSON objects. Need to flatten for each view.
      Pushes a new flat object for each nested entry.
    */
    self.flattenObject = function(nested, prop) {

        var dataArray = [];
        for (var i = 0, len = nested.length; i < len; i++) {
        
            //Grab the entry for each category.
            for (var j = 0, jlen = nested[i]['values'].length; j < jlen; j++) {
                
                var dataObj = {};
                //Grab the info for each entry
                dataObj['quarter'] = nested[i]['key'];
                dataObj['creditCategory'] = nested[i]['values'][j]['key'];
                dataObj[prop] = nested[i]['values'][j]['value'];
                dataArray.push(dataObj);
                
            }

        }
        return dataArray;
        
    };
    
}//End DataModel.


//Entry point.
function init() {

    var dm = new DataModel();
    dm.getData();
    //dm.drawChart();

}

function ChartGUI() {

    var self = this;
    
}

function eventGUI() {

    var self = this;
    
    
}

/*Ranges:

<620 Poor/Subprime
620 - 680 = Acceptable
680 to 740 = Good Credit
740 to 850 = Excellent Credit

*/