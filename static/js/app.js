// Populate initial demographics
d3.json("samples.json").then(function(sample_data){
    console.log(sample_data);
// Populate dropdown
    Object.values(sample_data.names).forEach(function(name) {
        d3.selectAll("#selDataset").append("option").text(name).property(name);
    });
    Data(sample_data.names[0]);
    Demographics(sample_data.names[0]);
});

// Create function to get the data
function Data(id) {
    d3.json("samples.json").then(function(sample_data){
        console.log(sample_data);

        let filteredSampleInfo = sample_data.samples.filter(details => details.id.toString() === id)[0];
        

        let sample_values = filteredSampleInfo.sample_values
        console.log(sample_values)

        let otu_ids = filteredSampleInfo.otu_ids
        console.log(otu_ids) 

        let top_otus = otu_ids.map(function(otuNumber){
            return "OTU " + otuNumber;
        })

        let otu_labels = filteredSampleInfo.otu_labels
        console.log(otu_labels) 

        // Create horizontal bar graph
        let barTrace = {
            x: sample_values.slice(0,10).reverse(),
            y: top_otus.slice(0,10).reverse(),
            text: otu_labels,
            type: "bar",
            orientation: "h",
            marker: {
                color: "#6b5b9c",
            },
            bgcolor: "transparent"
        };
        let barData = [barTrace];

        let subject_id = filteredSampleInfo.id
        let barLayout = {
            title: `Top Ten OTU Values for Subject ${subject_id}`,
            titlefont:{
                family: 'Quicksand, sans-serif',
                size: 28
              },
            font:{
                family: 'Quicksand, sans-serif',
                size: 14
              },
            xaxis: {gridcolor: '#fff', zerolinecolor: '#5a5a5a'},
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 75,
                r: 75,
                t: 50,
                b: 50
            },
            plot_bgcolor: "transparent",
            paper_bgcolor: "transparent"
        };
    Plotly.newPlot("bar", barData, barLayout)   
    
    // https://plotly.com/javascript/bubble-charts/
    let bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        },
        text: otu_labels
      };
      
      let bubbleData = [bubbleTrace];
      
      let bubbleLayout = {
        title: `All OTU Values for Subject ${subject_id}`,
        titlefont:{
            family: 'Quicksand, sans-serif',
            size: 28
          },
        font:{
            family: 'Quicksand, sans-serif',
            size: 14
          },
        showlegend: false,
        height: 600,
        width: 1000,
        plot_bgcolor: "transparent",
        paper_bgcolor: "transparent",
        xaxis: {gridcolor: '#fff', zerolinecolor: 'white'},
        yaxis: {gridcolor: '#fff', zerolinecolor: 'white'},
        
      };
      
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Plot gauge chart
    // https://plotly.com/python/v3/gauge-charts/
    // https://codepen.io/pen/?editors=0010
    // https://codepen.io/ascotto/pen/eGNaqe?editors=0011
    let filteredWFreq = sample_data.metadata.filter(details => details.id.toString() === id)[0];
    let washingFreq = filteredWFreq.wfreq
    // console.log(washingFreq)

      
        let level = parseFloat(washingFreq)*20;    
        let degrees = 180 - level,
            radius = .5;
        let radians = (degrees * Math.PI) / 180;
        let x = radius * Math.cos(radians);
        let y = radius * Math.sin(radians);
    
        
        let mainPath = 'M -.0 -0.05 L .0 0.05 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        let path = mainPath.concat(pathX,space,pathY,pathEnd);
            
        let gaugeData = [{ type: 'scatter',
            x: [0], y:[0],
            value: level,
            marker: {size: 28, color:'#4e4e4e'},
            showlegend: false,
            name: 'Washing Frequency',
            text: level/20,
            hoverinfo: 'text+name'},
            { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            textinfo: 'text',
            textposition:'inside',	  
            marker: {colors:['#703177','#7d3c84', '#8f4996', '#ad5aa1', '#b563a9cc','#bb76a1cc', '#d291a8cc', '#d29191c7', 'd291917a', 'transparent']},
            labels: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
            }];
        
        let layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '#4e4e4e',
            line: {
                color: '#4e4e4e'
            }
            }],
        autosize: true,
        xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
        font: { family: "Quicksand", size: 14 },
        plot_bgcolor: "transparent",
        paper_bgcolor: "transparent",
        title: 'Scrubs per Week',
        titlefont: { family: "Quicksand", size: 24 },
        margin: { t: 40, b: 0, l:0, r:0},
        };
        
    Plotly.newPlot("gauge", gaugeData, layout);
    
    });
}

// Create function to get the demographic information

function Demographics(id) {

    d3.json("samples.json").then(function(sample_data) {
        let filteredDemoInfo = sample_data.metadata.filter(details => details.id.toString() === id)[0];

        let demographicInfo = d3.select("#sample-metadata");
            
        demographicInfo.html("");
    
        Object.entries(filteredDemoInfo).forEach(function([key, value]) {   
            demographicInfo.append("h4").text(`${key}: ${value}`);    
        });
    });
}

function optionChanged(id) {
    Data(id);
    Demographics(id);
}













// UNUSED CODE AS TRYING TO PROCESS
    // Retrieve data
        // let names = Object.values(sample_data.names)
        // console.log(names)
        // let samples = Object.values(sample_data.samples)
        // console.log(samples)
        // let sample_values = samples.map(function (sampleVal){
        //     return (sampleVal.sample_values).sort(function (a, b) {
        //         return b - a;
        //     })
        // });
        // console.log(sample_values)
        // let slicedSampleVals = sample_values.map(function(value) {
        //     return value.slice(0, 10);
        // });
        
        // let otu_ids = samples.map(function(otu){
        //     return otu.otu_ids;
        // });
        // console.log(otu_ids) 

        // let slicedOtuIds = otu_ids.map(function(otus){
        //     return otus.slice(0, 10);
        // });
        // console.log(slicedOtuIds)

        // let otu_labels = samples.map(function(labels){
        //     return labels.otu_labels;
        // });
        // // console.log(otu_labels)
        // let slicedLabels =  otu_labels.map(function(value) {
        //     return value.slice(0, 10);
        // });


        // let data = [
        //     {
        //         // domain: { x: [0, 9], y: [0, 9], stroke: "white" },
        //         value: washingFreq,
        //         title: { text: "Scrubs Per Week", font: { family: 'Quicksand, sans-serif'}
        //         },
        //         type: "indicator",
        //         mode: "gauge+number",
        //         gauge: {
        //           axis: { range: [null, 9], showticklabels: false, tickwidth: 0, tickcolor: "transparent"},
        //           bar: { color: "#ffffffb3" },
        //           bordercolor: "transparent",	
        //           steps: [
        //             { range: [0, 1], color: '#d291917a' },
        //             { range: [1, 2], color: '#d29191c7' },
        //             { range: [2, 3], color: '#d291a8cc' }, 
        //             { range: [3, 4], color: '#bb76a1cc' }, 
        //             { range: [4, 5], color: '#b563a9cc' }, 
        //             { range: [5, 6], color: '#ad5aa1' }, 
        //             { range: [6, 7], color: '#8f4996' }, 
        //             { range: [7, 8], color: '#7d3c84' },
        //             { range: [8, 9], color: '#703177' }],
        //         }
        //       }
        //     ];
        
        // let layout = { 
        //     width: 500, 
        //     height: 250, 
        //     margin: { t: 30, b: 0, l:0, r:0},
        //     showticklabels: false,
        //     font: { family: "Quicksand" },
        //     plot_bgcolor: "transparent",
        //     paper_bgcolor: "transparent"
        // };