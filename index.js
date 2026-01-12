const colorForm = document.getElementById('color-form')
const seedColorOverlay = document.getElementById('seed-color-overlay')
const seedColorInput = document.getElementById('seed-color-input')
const schemeDropdown = document.getElementById('scheme-dropdown')
const generatedPalette = document.getElementById('generated-palette')
let schemeMode = ''
let seedColor = ''
let colorCount = 0
let currentColorIndex = 0
let fetchedPaletteArray = []

createOptions()

seedColorInput.addEventListener('mouseleave', (event) => {
	setTimeout(() => {
		seedColor = event.target.value
		schemeDropdown.style.backgroundColor = `${seedColor}40`
		document.getElementsByTagName('html')[0].style.setProperty('--btn-color', seedColor)
	}, 200)
})

colorForm.addEventListener('submit', (e) => {
	e.preventDefault()
	resetAll()

	// TODO: This should all be in a function.

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
			addCopyArrayBtn()
		})
})

generatedPalette.addEventListener('click', (event) => {
	const colorBlock = event.target.closest('.color')
	if (colorBlock) {
		copyHexValue(colorBlock)
	}
})

async function copyHexValue(colorBlock) {
	await navigator.clipboard.writeText(colorBlock.id)
}

function createHtml() {
	fetchedPaletteArray.forEach(colorInArray => {
		let hexValue = fetchedPaletteArray[currentColorIndex]
		const colorWrapper = document.createElement('div')
		const colorBox = document.createElement('div')
		const hexLabel = document.createElement('p')

		colorWrapper.classList.add('color')
		colorWrapper.id = hexValue
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

function createOptions() {
	// TODO: add removal of dashes
	const optionList = [
		['monochrome', 5],
		['monochrome-dark', 5],
		['monochrome-light', 5],
		['analogic', 5],
		['complement', 2],
		['analogic-complement', 4],
		['triad', 3],
		['quad', 4]]

	let optionsHtml = `
		<option value=""
		class="scheme-option">Select scheme</option>`

		optionList.forEach(optionType =>
		optionsHtml += `<option value="${optionType[0]}" data-count=${optionType[1]}>${optionType[0]}</option>`
	)

	schemeDropdown.innerHTML = optionsHtml
}

function addCopyArrayBtn() {
	const hiddenClass = document.querySelectorAll('.hidden')
	hiddenClass.forEach(instance => instance.style.display = 'block')

	document.getElementById('copy-all-btn').addEventListener('click', () => {
		const hexValueString = fetchedPaletteArray.join(', ')
		navigator.clipboard.writeText(hexValueString)
	})
}

