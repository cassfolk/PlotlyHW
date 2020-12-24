grabNames();

function grabNames() {
    d3.json("samples.json").then((importedData) => {
    // console.log("importData: ", importedData);
    var data = importedData;

    //Variables for dropdown
    var names = data.names; // for dropdown menu
    // console.log("Names: ", names);

    // fill in dropdown menu with values
    var sel = document.getElementById('selDataset');
    for (var i = 0; i < names.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = names[i];
        opt.value = names[i];
        sel.appendChild(opt);
    }
    });
};

function getIntoRows(rows) {
    return rows.map(function(row) {
        return row;
    });
};


optionChanged();

function optionChanged(option = "940") {
    // alert("hi");
    d3.json("samples.json").then((importedData) => {
    // console.log("importData: ", importedData);
    var data = importedData;
    var names = data.names;

    // var option = d3.select("select").selectAll("option").property("value");
    console.log("Option: ", option);

    var indexValue = names.findIndex(name => name === option);
    // console.log("index: ", indexValue);

    /// VARIABLES
    // Navigating json so you can extract variables based on indexValue (aka option selected)
    var samplesRow = getIntoRows(data.samples);
    // console.log("samplesRow ", samplesRow);
    // var sampleIDRow = samplesRow[indexValue].id;
    // console.log("sampleIDRow ", sampleIDRow);
    var otuIds = (samplesRow[indexValue].otu_ids);
    // console.log("otuIdsRAW ", otuIdsRAW);
    var sampleValues = (samplesRow[indexValue].sample_values);
    // console.log("sampleValues ", sampleValues);
    var otuLabels = (samplesRow[indexValue].otu_labels);
    // console.log("outLables ", otuLabels);


    //// Demographic Info filled in
    var list = d3.select("#sample-metadata").text("");
    // var idDemo = data.metadata[indexValue].id
    list.append("dd").text(`Id: ${data.metadata[indexValue].id}`);
    list.append("dd").text(`ethnicity: ${data.metadata[indexValue].ethnicity}`);
    list.append("dd").text(`gender: ${data.metadata[indexValue].gender}`);
    list.append("dd").text(`age: ${data.metadata[indexValue].age}`);
    list.append("dd").text(`location: ${data.metadata[indexValue].location}`);
    list.append("dd").text(`bbtype: ${data.metadata[indexValue].bbtype}`);
    list.append("dd").text(`wfreq: ${data.metadata[indexValue].wfreq}`);
                                    //// CHECK ONCE YOU CAN SWITCH HOW DOES NULLLLLLLLLLLLLLLLLLL
    
    // Bar SLICE info
    // Sort & slice the data array using sampleValues the
    var sampleValuesSlice = sampleValues.map(row => row);
    sampleValuesSlice.sort(function(a, b) {
            return parseFloat(b.sampleValues) - parseFloat(a.sampleValues);
        })
    sampleValuesSlice = sampleValuesSlice.slice(0, 10);
    // console.log(sampleValuesSlice);
    
    var otuIdsSlice = otuIds.map(row => row).slice(0, 10);

    var otuIdsSliceFinal = otuIdsSlice.map(function(el) {
        return "OTU " + el});
    // console.log(otuIdsSliceFinal);

    var otuLabelsSlice = otuLabels.map(row => row).slice(0, 10);
    // console.log(otuLabelsSlice);

    // // BAR
    var trace1 = {
        x: sampleValuesSlice,
        y: otuIdsSliceFinal,
        mode: 'markers',
        marker: {size:12},
        text: otuLabelsSlice,
        type: "bar",
        orientation: "h"
    };

    // data   
    var chartDataBar = [trace1];

    // Apply the group bar mode to the layout
    var layout = {  
        yaxis:{
            autorange:'reversed'
        },
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", chartDataBar, layout);


    // // BUBBLE!
    var trace2 = {
        x: otuIds,
        y: sampleValues,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: sampleValues,
            colorscale: 'Earth',
            type: 'heatmap'
        },
        text: otuLabels,
        type: "bubble",
    };

    // data   
    var chartDataBubble = [trace2];

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", chartDataBubble);


    });
};