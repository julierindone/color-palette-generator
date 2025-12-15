const colorForm = document.getElementById('color-form')
const seedColorInput = document.getElementById('seed-color-input')
const modeDropdown = document.getElementById('mode-dropdown')
const generatedPalette = document.getElementById('generated-palette')
let schemeMode = ''
let seedColor = ''
let colorCount = 0   // # of colors to fetch for chosen mode
let currentColorIndex = 0
let fetchedPaletteArray = []

createOptions()

colorForm.addEventListener('submit', (e) => {
	e.preventDefault()
	resetAll()

	let formValues = Object.fromEntries(new FormData(colorForm));
	({ seedColor, schemeMode } = formValues)
	seedColor = seedColor.slice(1)

	// the selected element from the dropdown
	const selectElement = e.target.elements.schemeMode

	// get the selected option using the selectedIndex property
	const selectedOption = selectElement[selectElement.selectedIndex]

	// get count from data attribute
	colorCount = selectedOption.dataset.count



	let paletteQuery = `https://www.thecolorapi.com/scheme?hex=${seedColor}&mode=${schemeMode}&count=${colorCount}`
	fetch(paletteQuery)
		.then(response => response.json())
		.then(data => {
			let myColors = data.colors
			myColors.forEach(color => {
				fetchedPaletteArray.push(color.hex.value)
			})
			createHtml()
		})
})

function createHtml() {
	fetchedPaletteArray.forEach(colorInArray => {
		let hexValue = fetchedPaletteArray[currentColorIndex]
		const colorWrapper = document.createElement('div')
		const colorBox = document.createElement('div')
		const hexLabel = document.createElement('p')

		colorWrapper.classList.add('color')
		colorBox.classList.add('color-box')
		colorBox.style.backgroundColor = hexValue
		hexLabel.classList.add('hex-label')
		hexLabel.innerText = hexValue

		generatedPalette.appendChild(colorWrapper)
		colorWrapper.appendChild(colorBox)
		colorWrapper.appendChild(hexLabel)
		currentColorIndex++
	})
}

function resetAll() {
	seedColor = ''
	currentColorIndex = 0
	fetchedPaletteArray = []
	generatedPalette.replaceChildren()
	generatedPalette.style.background = 'none'
}

// ToDo: add removal of dashes; store counts for palettes with fewer colors
function createOptions() {
	const optionList = [['monochrome', 5], ['monochrome-dark', 5], ['monochrome-light', 5], ['analogic', 5], ['complement', 2], ['analogic-complement', 4], ['triad', 3], ['quad', 4]]
	let optionsHtml = `
		<option value=""
		class="scheme-option">Select a color scheme</option>`
	optionList.forEach(optionType =>
		optionsHtml += `<option value="${optionType[0]}" data-count=${optionType[1]}>${optionType[0]}</option>`
	)
	modeDropdown.innerHTML = optionsHtml
}
