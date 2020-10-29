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
	window.ShowHideInput = ShowHideInput
	window.RemoveAnswerChoice = RemoveAnswerChoice
	window.AddAnotherAnswerChoice = AddAnotherAnswerChoice
}())
