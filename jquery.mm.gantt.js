(function ($) {
   var o,
   mainobj = this;
   
   $.fn.dailyGantt = function (options) {
      o = $.extend($.fn.dailyGantt.defaults, options);
      if(o.data) {
         $.fn.dailyGantt.start();
      }
   }

   $.fn.dailyGantt.defaults = {
      renderin : '#dailyGantt',
      slideWidth : 400,
      cellWidth : 23,
      cellHeight: 31,
      startCell : 0,
      endCell : 23
   };
   
   
   $.fn.dailyGantt.start = function() {
      var numOfCells = Math.floor((o.slideWidth / o.cellWidth));
      var container = $(this);
      var div = $(document.createElement('div')).addClass('dailyGantt');
      new Chart(div, o).render();
		container.append(div);
   };
   
   var Chart = function(div, opts) {
		var hours = ['Midnight','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','Noon','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'];
		function render() {
            addVtHeader(div, o.data, opts.cellHeight);

            var slideDiv = jQuery("<div>", {
                "class": "dailyGantt-slide-container",
                "css": { "width": opts.slideWidth + "px" }
            });
			
            //dates = getDates(opts.start, opts.end);
            
            addHzHeader(slideDiv,hours, o.cellWidth);
            addGrid(slideDiv, opts.data, dates, opts.cellWidth, opts.showWeekends);
            addBlockContainers(slideDiv, opts.data);
            //addBlocks(slideDiv, opts.data, opts.cellWidth, opts.start);
            div.append(slideDiv);
            applyLastClass(div.parent());
		}
		
		//var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		// Creates a 3 dimensional array [year][month][day] of every day 
		// between the given start and end dates
//        function getDates(start, end) {
//            var dates = [];
//			dates[start.getFullYear()] = [];
//			dates[start.getFullYear()][start.getMonth()] = [start]
//			var last = start;
//			while (last.compareTo(end) == -1) {
//				var next = last.clone().addDays(1);
//				if (!dates[next.getFullYear()]) { dates[next.getFullYear()] = []; }
//				if (!dates[next.getFullYear()][next.getMonth()]) { 
//					dates[next.getFullYear()][next.getMonth()] = []; 
//				}
//				dates[next.getFullYear()][next.getMonth()].push(next);
//				last = next;
//			}
//			return dates;
//        }

        function addVtHeader(div, data, cellHeight) {
            var headerDiv = jQuery("<div>", { "class": "dailyGantt-vtheader" });
            for (var i = 0; i < data.length; i++) {
                var itemDiv = jQuery("<div>", { "class": "dailyGantt-vtheader-item" });
                itemDiv.append(jQuery("<div>", {
                    "class": "dailyGantt-vtheader-item-name",
                    "css": { "height": (data[i].series.length * cellHeight) + "px" }
                }).append(data[i].name));
                var seriesDiv = jQuery("<div>", { "class": "dailyGantt-vtheader-series" });
                for (var j = 0; j < data[i].series.length; j++) {
                    seriesDiv.append(jQuery("<div>", { "class": "dailyGantt-vtheader-series-name" })
						.append(data[i].series[j].name));
                }
                itemDiv.append(seriesDiv);
					 headerDiv.append(itemDiv);
				}
				div.append(headerDiv);
		  }
        
        function addHzHeader(div, hours, cellWidth) {
            var headerDiv = jQuery("<div>", { "class": "dailyGantt-hzheader" });
            var daysDiv = jQuery("<div>", { "class": "dailyGantt-hzheader-days" });
            var totalW = 0;
					for (var h in hours) {
						daysDiv.append(jQuery("<div>", { "class": "dailyGantt-hzheader-day" })
							.append(h));
					}

            daysDiv.css("width", totalW + "px");
            headerDiv.append(daysDiv);
            div.append(headerDiv);
        }


//        function addHzHeader(div, hours, cellWidth) {
//            var headerDiv = jQuery("<div>", { "class": "ganttview-hzheader" });
//            var monthsDiv = jQuery("<div>", { "class": "ganttview-hzheader-months" });
//            var daysDiv = jQuery("<div>", { "class": "ganttview-hzheader-days" });
//            var totalW = 0;
//			for (var h in hours) {
//					var w = hours[h].length * cellWidth;
//					totalW = totalW + w;
//					headerDiv.append(jQuery("<div>", {
//						"class": "dailyGantt-hzheader-day",
//						"css": { "width": (w - 1) + "px" }
//					}).append(monthNames[m] + "/" + y));
//					for (var d in dates[y][m]) {
//						daysDiv.append(jQuery("<div>", { "class": "ganttview-hzheader-day" })
//							.append(dates[y][m][d].getDate()));
//					}
//				}
//			}
//            monthsDiv.css("width", totalW + "px");
//            daysDiv.css("width", totalW + "px");
//            headerDiv.append(monthsDiv).append(daysDiv);
//            div.append(headerDiv);
//        }

        function addGrid(div, data, hours, cellWidth, showWeekends) {
            var gridDiv = jQuery("<div>", { "class": "dailyGantt-grid" });
            var rowDiv = jQuery("<div>", { "class": "dailyGantt-grid-row" });
   			for (var h in hours) {
					var cellDiv = jQuery("<div>", { "class": "dailyGantt-grid-row-cell" });
					rowDiv.append(cellDiv);
				}

            var w = jQuery("div.dailyGantt-grid-row-cell", rowDiv).length * cellWidth;
            rowDiv.css("width", w + "px");
            gridDiv.css("width", w + "px");
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    gridDiv.append(rowDiv.clone());
                }
            }
            div.append(gridDiv);
        }

        function addBlockContainers(div, data) {
            var blocksDiv = jQuery("<div>", { "class": "dailyGantt-blocks" });
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    blocksDiv.append(jQuery("<div>", { "class": "dailyGantt-block-container" }));
                }
            }
            div.append(blocksDiv);
        }

        function addBlocks(div, data, cellWidth, hours) {
            var rows = jQuery("div.dailyGantt-blocks div.dailyGantt-block-container", div);
            var rowIdx = 0;
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    var series = hours;
                    var size = DateUtils.daysBetween(series.start, series.end) + 1;
					var offset = DateUtils.daysBetween(start, series.start);
					var block = jQuery("<div>", {
                        "class": "ganttview-block",
                        "title": series.name + ", " + size + " days",
                        "css": {
                            "width": ((size * cellWidth) - 9) + "px",
                            "margin-left": ((offset * cellWidth) + 3) + "px"
                        }
                    });
                    addBlockData(block, data[i], hours);
                    if (data[i].series[j].color) {
                        block.css("background-color", data[i].series[j].color);
                    }
                    block.append(jQuery("<div>", { "class": "ganttview-block-text" }).text(size));
                    jQuery(rows[rowIdx]).append(block);
                    rowIdx = rowIdx + 1;
                }
            }
        }
        
        function addBlockData(block, data, hours) {
        	// This allows custom attributes to be added to the series data objects
        	// and makes them available to the 'data' argument of click, resize, and drag handlers
        	var blockData = { id: data.id, name: data.name };
        	jQuery.extend(blockData, series);
        	block.data("block-data", blockData);
        }

        function applyLastClass(div) {
            jQuery("div.ganttview-grid-row div.ganttview-grid-row-cell:last-child", div).addClass("last");
            jQuery("div.ganttview-hzheader-days div.ganttview-hzheader-day:last-child", div).addClass("last");
            jQuery("div.ganttview-hzheader-months div.ganttview-hzheader-month:last-child", div).addClass("last");
        }
		
		return {
			render: render
		};
	}
   
   
}(jQuery);