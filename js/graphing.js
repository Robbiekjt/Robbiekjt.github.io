
document.addEventListener("DOMContentLoaded", populateSelect);

function populateSelect() {
	// get selected year
	var e = document.getElementById("year");
	var strSelectedYear = e.options[e.selectedIndex].value;
	
	// populate the substation select box
	$.get("data/substation_files.csv", function(csvString) {
		var arraySubstationFiles = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
		
		var select = document.getElementById("sub");
		// remove options before populating
		select.innerHTML = "";
		
		for (var i = 0; i < arraySubstationFiles.length; i++) {
			if (arraySubstationFiles[i][2] === strSelectedYear) {
				select.options[select.options.length] = new Option(arraySubstationFiles[i][1], arraySubstationFiles[i][0]);
			}
		}
	});
}

// load the visualization library from Google and set a listener 
google.load("visualization", "1", {packages:["corechart", "controls"]}); 
google.setOnLoadCallback(drawChart);

//google.setOnLoadCallback(function() {
//    drawChart(your_parameter);
//}); 

function subChange(control) {
    var msg = control.value == "1" ? "1" : "2";
}

function drawChart() { 
	// grab the CSV
	var e = document.getElementById("sub");
	var strSelectedSub = e.options[e.selectedIndex].value;

	$.get("data/" + strSelectedSub, function(csvString) {

	// transform the CSV string into a 2-dimensional array 
	var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});

	// change data type to date
	for (var i = 1; i < arrayData.length; i++) {
		arrayData[i][2] = new Date(arrayData[i][2]);
	}

	// transform data
	var newArrayData = [['Date','MW']];
	var arrayIndex = 1
	for (var dayIndex = 1; dayIndex < arrayData.length; dayIndex++) {
		for (var timeIndex = 4; timeIndex < arrayData[dayIndex].length; timeIndex++) {
			var dateTime = new Date(arrayData[dayIndex][2].getFullYear(), arrayData[dayIndex][2].getMonth(), arrayData[dayIndex][2].getDate(), 0, (timeIndex-3)*15)
			newArrayData[arrayIndex] = [dateTime, arrayData[dayIndex][timeIndex]];
			//newArrayData[dayIndex-1+timeIndex-4][1] = arrayData[dayIndex][timeIndex];
			arrayIndex++;
		}
	}

	// this new DataTable object holds all the data 
	var data = new google.visualization.arrayToDataTable(newArrayData);

	// this view can select a subset of the data at a time 
	var columnOne = 0;
	var columnTwo = 1;

	//var options = { title: "Campbell St Zone Substation", hAxis: {title: data.getColumnLabel(columnOne), minValue: data.getColumnRange(columnOne).min, maxValue: data.getColumnRange(columnOne).max}, vAxis: {title: data.getColumnLabel(columnTwo), minValue: data.getColumnRange(columnTwo).min, maxValue: data.getColumnRange(columnTwo).max}, legend: 'none' };
	var options = { title: strSelectedSub, legend: 'none'};


	var chart = new google.visualization.ChartWrapper({
		chartType: 'LineChart',
		containerId: 'chart_year',
		options: options,
		view: {'columns': [0, 1]}
		});

	var control = new google.visualization.ControlWrapper({
		controlType: 'ChartRangeFilter',
		containerId: 'control_div',
		options: {filterColumnIndex: 0}
		});
		
	google.visualization.events.addListener(control, 'statechange', function () {
		var state = control.getState();
		var view = new google.visualization.DataView(data);
		view.setColumns([columnOne,columnTwo]);
		view.setRows(view.getFilteredRows([{column: 0, minValue: state.range.start, maxValue: state.range.end}]));
		});

	var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
	dashboard.bind([control], [chart]);
	dashboard.draw(data);

}); }

$(window).resize(function(){
  drawChart();
});