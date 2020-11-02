// Populate initial demographics and
d3.json("../../samples.json").then(function(sample_data){
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
    d3.json("../../samples.json").then(function(sample_data){
        console.log(sample_data);

        // Help with filtering: v33na @GitHub
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
        let barTrace = {
            x: sample_values.slice(0,10).reverse(),
            y: top_otus.slice(0,10).reverse(),
            text: otu_labels,
            marker: {
                color: 'lightpurple'},
            type: "bar",
            orientation: "h"
        };
        let barData = [barTrace];

        let barLayout = {
            title: "Top OTU IDs",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 75,
                r: 75,
                t: 25,
                b: 50
            }
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
        showlegend: false,
        height: 600,
        width: 1200,
        
      };
      
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// Create function to get the demographic information

function Demographics(id) {

    d3.json("../../samples.json").then(function(sample_data) {
        let filteredDemoInfo = sample_data.metadata.filter(details => details.id.toString() === id)[0];

        let demographicInfo = d3.select("#sample-metadata");
            
        demographicInfo.html("");
    
        Object.entries(filteredDemoInfo).forEach(function([key, value]) {   
            demographicInfo.append("h5").text(`${key}: ${value}`);    
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