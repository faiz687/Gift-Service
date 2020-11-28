(function() {
	function AddAnotherAnswerChoice(sender) {
		const ClonedElement = sender.parentElement.parentElement.cloneNode(true)
		for (let i = 0; i < ClonedElement.children.length; i++) {
			ClonedElement.children[i].value = ''
		}
		const EventItemsDiv = sender.parentElement.parentElement.parentElement
		EventItemsDiv.insertBefore(ClonedElement, sender.parentElement.parentElement.nextSibling)
	}
	function RemoveAnswerChoice(sender) {
		const MinimumItem = 2
		if (sender.parentElement.parentElement.parentElement.childElementCount > MinimumItem) {
			sender.parentElement.parentElement.remove()
		}
	}
	function ShowHideInput(sender) {
		const PLedgeForm = sender.nextSibling.nextSibling
		if (PLedgeForm.style.display === 'none') {
			PLedgeForm.style.display = 'block'
		} else {
			PLedgeForm.style.display = 'none'
		}
	}

	function ShowMessageBox(sender) {
		const x = sender.parentElement.getElementsByClassName('MessageBox')[0]
		if (x.style.display === 'none') {
			x.style.display = 'block'
		} else {
			x.style.display = 'none'
		}
	}

 	window.ShowMessageBox = ShowMessageBox
	window.ShowHideInput = ShowHideInput
	window.RemoveAnswerChoice = RemoveAnswerChoice
	window.AddAnotherAnswerChoice = AddAnotherAnswerChoice
}())
