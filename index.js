const modeDropdown = document.getElementById('mode-dropdown')
const dropdownForm = document.getElementById('dropdown-form')
const generatedPalette = document.getElementById('generated-palette')
const paletteModes = {
	monochrome: monochromeArray,
	iceCream: iceCreamArray,
	minty: mintyArray
}
let currentColorIndex = 0
let mode = ''

// REMOVE: Temporary hardcoded values
let monochromeArray = ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"]
let iceCreamArray = ["#96bac1", "#dfcb92", "#f3f6f4", "#dcc5c5", "#c0baba"]
let mintyArray = ["#255544", "#089382", "#d70900", "#8abeb9", "#dcd5cb"]

dropdownForm.addEventListener('submit', (e) => {
	e.preventDefault()
	mode = modeDropdown.value
	generatePalette(mode)
})

function generatePalette(mode) {
	resetAll()
	const fetchedPaletteArray = fetchPalette(mode)
	createHtml(fetchedPaletteArray)
}

function fetchPalette(mode) {
	return paletteModes[mode] || (generatedPalette.style.background = '')
}

function createHtml(fetchedPaletteArray) {
	fetchedPaletteArray.forEach(colorInArray => {
		let hexValue = fetchedPaletteArray[currentColorIndex]
		const colorWrapper = document.createElement('div')
		const colorBox = document.createElement('div')
		const hexLabel = document.createElement('p')

		colorWrapper.classList.add('color')
		colorBox.classList.add('color-box')
		colorBox.style.backgroundColor = hexValue
		hexLabel.innerText = hexValue

		generatedPalette.appendChild(colorWrapper)
		colorWrapper.appendChild(colorBox)
		colorWrapper.appendChild(hexLabel)
		currentColorIndex++
	})
}

function resetAll() {
	currentColorIndex = 0
	fetchedPaletteArray = []
	generatedPalette.replaceChildren()
	generatedPalette.style.background = 'none'
}
