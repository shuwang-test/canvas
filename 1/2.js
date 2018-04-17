var canvasMaxWidth = 8192
var aDayWidth = 14
var monthHeight = 25
var dayHeight = 20
var aMonthMaxDayNumber = 31
var aMonthMaxWidth = aDayWidth * aMonthMaxDayNumber
var aCanvasMaxMonthNumber = parseInt(canvasMaxWidth / aMonthMaxWidth)

function getYearAndMonthList(start, end) {
	var startDate = new Date(start),
		startYear = startDate.getFullYear(),
		startMonth = startDate.getMonth() + 1
	var rawYearAndMonthList = []
	var nextYear, nextMonth
	var next = new Date(startYear + '/' + startMonth + '/' + 1).getTime()
	while (next <= end) {
		rawYearAndMonthList.push({
			year: startYear,
			month: startMonth
		})
		nextYear = startMonth == 12 ? startYear + 1 : startYear
		nextMonth = startMonth == 12 ? 1 : startMonth + 1
		startYear = nextYear
		startMonth = nextMonth
		next = new Date(startYear + '/' + startMonth + '/' + '1').getTime()
	}
	var yearAndMonthList = []
	rawYearAndMonthList.forEach(function(rawYearAndMonth, index) {
		var name = rawYearAndMonth.year + '年' + rawYearAndMonth.month + '月'
		var dayList = getMonthDayList(
			rawYearAndMonth.year,
			rawYearAndMonth.month
		)
		var width = aDayWidth * dayList.length
		var left
		if (index === 0) {
			left = 0
		} else {
			left =
				yearAndMonthList[index - 1].width +
				yearAndMonthList[index - 1].left
		}
		yearAndMonthList[index] = {
			name: name,
			dayList: dayList,
			width: width
		}
	})
	return yearAndMonthList
}

function getData(yearAndMonthList, canvasNumber, aCanvasMaxMonthNumber) {
	var data = []
	for (var i = 0; i < canvasNumber; i++) {
		data.push(
			yearAndMonthList.slice(
				aCanvasMaxMonthNumber * i,
				aCanvasMaxMonthNumber * (i + 1)
			)
		)
	}
	return data
}

function createCanvas(data, parent) {
	for (var i = 0; i < data.length; i++) {
		var canvasWidth = 0
		for (var j = 0; j < data[i].length; j++) {
			if (j === 0) {
				data[i][j].left = 0
			} else {
				data[i][j].left = data[i][j - 1].left + data[i][j - 1].width
			}
			canvasWidth += data[i][j].width
		}
		data[i].canvasWidth = canvasWidth
		if (i == 0) {
			data[i].left = 0
		} else {
			data[i].left = data[i - 1].left + data[i - 1].canvasWidth
		}
	}

	for (var i = 0; i < data.length; i++) {
		var canvas = document.createElement('canvas')
		canvas.width = data[i].canvasWidth
		canvas.height = monthHeight + dayHeight
		canvas.style.position = 'absolute'
		canvas.style.left = data[i].left + 'px'
		canvas.style.top = '10px'
		var context = canvas.getContext('2d')
		for (var j = 0; j < data[i].length; j++) {
			context.strokeStyle = '#ccc'
			context.lineWidth = 1
			context.font = '12px Arial'
			context.strokeRect(
				data[i][j].left,
				0,
				data[i][j].width,
				monthHeight
			)
			var text1 = data[i][j].name
			var text1Width = context.measureText(text1).width
			var left = (data[i][j].width - text1Width) / 2
			context.fillText(text1, data[i][j].left + left, monthHeight / 2 + 5)
			canvasWidth += data[i][j].width

			context.font = '10px Arial'
			for (var q = 0; q < data[i][j].dayList.length; q++) {
				var text = data[i][j].dayList[q]
				var width = context.measureText(text).width
				var left = (aDayWidth - width) / 2
				context.strokeRect(
					aDayWidth * q + data[i][j].left,
					monthHeight,
					aDayWidth,
					dayHeight
				)
				context.fillText(
					text,
					left + aDayWidth * q + data[i][j].left,
					dayHeight / 2 + 5 + monthHeight
				)
			}
		}
		parent.appendChild(canvas)
	}
}

function getMonthDayList(year, month) {
	var dayList
	if (month == 4 || month == 6 || month == 9 || month == 11) {
		dayList = getDayList(30)
	} else if (month == 2) {
		if (year % 4 == 0) {
			dayList = getDayList(29)
		} else {
			dayList = getDayList(28)
		}
	} else {
		dayList = getDayList(31)
	}
	return dayList
}
function getDayList(length) {
	var dayList = []
	for (var i = 0; i < length; i++) {
		dayList[i] = i + 1
	}
	return dayList
}
function getDayLength(monthList) {
	var length = 0
	monthList.forEach(function(month) {
		length += month.dayList.length
	})
	return length
}

function createCanvasDate(start, end, parent) {
	var yearAndMonthList = getYearAndMonthList(start, end)
	var yearAndMonthListLength = yearAndMonthList.length
	var canvasNumber =
		yearAndMonthListLength % aCanvasMaxMonthNumber === 0
			? yearAndMonthListLength / aCanvasMaxMonthNumber
			: parseInt(yearAndMonthListLength / aCanvasMaxMonthNumber) + 1
	var data = getData(yearAndMonthList, canvasNumber, aCanvasMaxMonthNumber)
	createCanvas(data, parent)
}

var start = new Date('2000/1/1').getTime()
var end = new Date('2050/1/1').getTime()
createCanvasDate(start, end, document.body)
