function DataModel() {

    var self = this;
    self.countData = [];
    self.rateData = [];
    self.totalData = [];
    
    /* Retrives data for visualization */
    self.getData = function () {
        
      d3.csv("data/prosperLoanData_reduced.csv", self.buildAndBind);
        
    };
    
    //Callback once data has been retrived and loaded.
    self.buildAndBind = function(data) {
            
        /*Note: I attempted to use dimple's built-in aggregation methods
         *but they ran very slowly and would not produce the proper ordering
        */
        
        //Returns aggregate loan count
        function loanCount(leaves) {
            return leaves.length;
        };
        
        //Returns aggregate borrower APR for charting
        function rateAvg(leaves) {
            
            return d3.mean(leaves, function(d) {
                return d['BorrowerAPR'];
            });
            
        };
        
        //Returns total loaned amount for charting
        function totalAmount(leaves) {
            
            return d3.sum(leaves, function(d) {
                
                return d['LoanOriginalAmount'];
            });
            
        };
        
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
        
        //Get aggregated total Loan Amount Data
        nested = d3.nest()
                .key(function (d) {

                    return d['LoanOriginationQuarter'];

                }).sortKeys(d3.ascending)
                .key(function (d) {

                    return d['CreditCategory'];

                })
                .rollup(totalAmount)
                .entries(data);
        
        self.totalData = self.flattenObject(nested, 'totalAmount');
        

        //Interface Listeners
        d3.select('#btnNumberOfLoans').on('click', function() {
            self.drawChart(self.countData, 'measureAxis', 'count', 'Total New Loans Issued (#)');
        });
        
        d3.select('#btnAverageInterestRate').on('click', function() {
            self.drawChart(self.rateData, 'percent', 'rateAverage', 'Average Interest Rate Issued (%)');
        });
        
        d3.select('#btnTotalAmountLoaned').on('click', function() {
            self.drawChart(self.totalData, 'measureAxis', 'totalAmount', 'Total Amount Loaned ($)');
        });
        
        d3.select('#chart-area-cover').on('click', function() {
            self.viewStoryBoard(self.countData);
        });
        
        //Draw initial chart
        //self.drawChart(self.countData, 'measureAxis', 'count', 'Total New Loans Issued (#)');
        
    };
    
    /* Draw Function abstracted to avoid duplicate code */
    self.drawChart = function(data, axisType, measure, yLabel, yFormat) {
        
        //Clear any prior chart.
        d3.select('#chart-area').html('');
        
        var svg = dimple.newSvg('#chart-area', 1400, 700),
            myChart = new dimple.chart(svg, data);
        
        myChart.setBounds(60, 50, 1350, 600);
        
        var x = myChart.addCategoryAxis('x', 'quarter');
        x.addOrderRule("quarter");
        x.title = "";
        
        var y = axisType === 'percent' ? myChart.addPctAxis('y', measure) : myChart.addMeasureAxis('y', measure)
        y.title = yLabel;
        y.fontSize = "12px";
        
        var dataSeries = myChart.addSeries('creditCategory', dimple.plot.line);
        //var legend = myChart.addLegend(60, 10, 500, 20, "right");
        myChart.assignColor('Subprime', 'rgb(210, 107, 95)');
        myChart.assignColor('Acceptable', 'rgb(211, 150, 81)');
        myChart.assignColor('Good', 'rgb(149, 185, 87)');
        myChart.assignColor('Excellent', 'rgb(107, 148, 176)');
               
        /*Add 2008 crash reference line by creating a hidden y axis.*/
        var y2 = myChart.addPctAxis('y', "Dummy");
        y2.hidden = true;
        
        var lineSeries = myChart.addSeries("FinancialCrisis", dimple.plot.area, [x, y2]);
        lineSeries.lineWeight = 5;
        
        lineSeries.data = [{
            FinancialCrisis: "Financial Crisis",
            Dummy: 1,
            quarter: "2008 Q4"
        }]
        
        //Do not show vertical line in the legend.
        //legend.series = [dataSeries];
        
        //Draw the chart.
        myChart.draw(1000);
        
        //Rotate the x-axis labels.
        x.shapes.selectAll("text").attr("transform", "rotate(45)");
        
        //Remove reference line marker and change the line styling.
        d3.select(lineSeries._markers['dimple-financial-crisis'][0][0]).style('display', 'none');
        //Change color and opacity of dividing line.
        d3.select(lineSeries.shapes[0][0]).style({
            stroke: '#000',
            opacity: 0.7,
            cursor: 'pointer'
        });

        //Show manual tooltip
        var lineEl = lineSeries.shapes[0][0];
        lineEl.addEventListener('mouseover', function(event){
            
            var x = event.clientX + 10,
                y = event.clientY;
            
            //Remove any existing.
            d3.selectAll('.manual-tooltip').remove();
            
            //Add a new one.
            var div = document.createElement('div');
            div.className = 'manual-tooltip';
            div.innerHTML = "The financial crisis at it's worst in 2008 Q4";
            
            d3.select(div).style('top', y + 'px');
            d3.select(div).style('left', x + 'px');

            document.body.appendChild(div);
            
        });
        
        lineEl.addEventListener('mouseout', function(event){
            
            //Remove any existing.
            d3.selectAll('.manual-tooltip').remove();
            
        });
        
        self.viewStoryBoard();
        
    };
    
    /* Provides interactive explanation of the main story behind the visualization */
    /* Draw series and annotations in specific sequence */
    /* Click to walk-through */
    self.viewStoryBoard = function(data) {
        
        //Clear any prior chart and cover.
        d3.select('#chart-area').html('');
        
        //Find max across entire set to manually set y-axis.
        var max = d3.max(data, function(d) {
            return d.count;
        })
        
        var subPrime = dimple.filterData(data, 'creditCategory', 'Subprime'),
            preCrash = [];
        
        for (var i = 0, len = subPrime.length; i < len; i++) {
            
            if (subPrime[i]['quarter'] < '2009 Q1') {
                preCrash.push(subPrime[i]);
            }
        
        }
        
        var svg = dimple.newSvg('#chart-area', 1400, 700),
            myChart = new dimple.chart(svg, preCrash);
        
        myChart.setBounds(60, 50, 1350, 600);
        
        var x = myChart.addCategoryAxis('x', 'quarter');
        x.addOrderRule("quarter");
        x.title = "";
                
        var y = myChart.addMeasureAxis('y', 'count')
        y.title = 'Total New Loans Issued (#)';
        y.fontSize = "12px";
        y.overrideMax = max
        
        var dataSeries = myChart.addSeries('creditCategory', dimple.plot.line);
        //var legend = myChart.addLegend(60, 10, 500, 20, "right");
        myChart.assignColor('Subprime', 'rgb(210, 107, 95)');
        //myChart.assignColor('Acceptable', 'rgb(211, 150, 81)');
        //myChart.assignColor('Good', 'rgb(149, 185, 87)');
        //myChart.assignColor('Excellent', 'rgb(107, 148, 176)');
        
        //myChart.assignColor("Coolio", "red", "black", 1); We can set the opacity.
        
        myChart.draw(1000);
        
        
        setTimeout(function() {
            
            
            
            
            
            
            
            
       
        /*Add 2008 crash reference line by creating a hidden y axis.*/
        var y2 = myChart.addPctAxis('y', "Dummy");
        y2.hidden = true;
        
        var lineSeries = myChart.addSeries("FinancialCrisis", dimple.plot.area, [x, y2]);
        lineSeries.lineWeight = 5;
        
        lineSeries.data = [{
            FinancialCrisis: "Financial Crisis",
            Dummy: 1,
            quarter: "2008 Q4"
        }]
        
        myChart.draw(100);
            
            
            d3.select('#annotation').html('The financial crisis reached its apex at the end of 2008. ' + 
                                          'Many consumers lost their jobs and their homes, while financial ' +
                                          'institutions struggled to stay solvent.')
                                    .style('left', '1000px')
            
            
            
            
            
            
            setTimeout(function() {
                
                
                for (var i = 0, len = subPrime.length; i < len; i++) {

                    if (subPrime[i]['quarter'] >= '2009 Q1') {
                        preCrash.push(subPrime[i]);
                    }

                }
                
                
                dataSeries.afterDraw = function() {

                
                
                d3.select('#annotation').html('In response to the crisis, Subprime loans fell out of favour and would not ' +
                                              'return to pre-crisis levels.')
                        .style({
                            left: '900px',
                            top: '475px'
                        });
                    
                }
                
                
                
                myChart.draw(1000);
                
                
                
                
            }, 1000);
            
            
            
            
            
            
            
            
            
            
            
            
        }, 1000);
        
        //myChart.data = newDataset
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        //Create first annotation
        var div = document.createElement('div');
        div.id = 'annotation';
        div.innerHTML = 
        'The financial crisis began in 2007, and was fueled by Subprime lending. ' +
        'Before the eventual crash, Subprime loans were being approved at dangerously ' +
        'high frequencies without proper assurances.';
        
        
        //Needs to be set-up as absolute and appended to the chart-area.
        document.getElementById('chart-area').appendChild(div);
        
        div.style.top = top + 'px';
        div.style.left = left + 'px';

        
        /*
        The financial crisis reached its apex at the end of 2008. Many consumers
        lost their jobs and their homes, while financial institutions struggled
        to stay solvent.
        */
        
        /*
        In response to the crisis, Subprime loans fell out of favour and would not
        return to pre-crisis levels. */
        
        /*
        To stimulte the economy, interest rates were reduced while consumers were
        encouraged to spend more. The resulting low rates and increased consumerism
        caused a steady rise in consumer debt.
        */
        
        /*
        Finally, in 2013, consumer debt skyrockets to levels well above the pre-crisis
        numbers. Although Subprime credit approvals remain low, the staggering number of
        loans approved for the remaining population could be foreshadowing another
        crisis.
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
                dataObj[prop] = nested[i]['values'][j]['values'];
                dataArray.push(dataObj);
                
            }

        }
        return dataArray;
        
    };
    
}//End DataModel.


//Entry point.
function init() {

    //Create new model.
    var dm = new DataModel();
    
    //Retrieve data.
    dm.getData();


}


/*Ranges:

<620 Poor/Subprime
620 - 680 = Acceptable
680 to 740 = Good Credit
740 to 850 = Excellent Credit

*/