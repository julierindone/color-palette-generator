const colorForm = document.getElementById('color-form')
const generatedPalette = document.getElementById('generated-palette')
const modeDropdown = document.getElementById('mode-dropdown')
let schemeMode = ''
let seedColor = ''
let currentColorIndex = 0
let fetchedPaletteArray = []

createOptions()

colorForm.addEventListener('submit', (e) => {
	e.preventDefault()
	resetAll()
	let formValues = Object.fromEntries(new FormData(colorForm));
	({ seedColor, schemeMode } = formValues)
	seedColor = seedColor.slice(1)

	let paletteQuery = `https://www.thecolorapi.com/scheme?hex=${seedColor}&mode=${schemeMode}`
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

// ToDo: add removal of dashes; change counts for palettes with fewer colors
function createOptions() {
	const optionList = ['monochrome', 'monochrome-dark', 'monochrome-light', 'analogic', 'complement', 'analogic-complement', 'triad', 'quad']
	let optionsHtml = `
		<option value=""
		class="scheme-option">Select a color scheme</option>`
	optionList.forEach(optionType =>
		optionsHtml += `<option value="${optionType}"><li>${optionType}</li></option>`
	)
	modeDropdown.innerHTML = optionsHtml
}
