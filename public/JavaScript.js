function AddAnotherAnswerChoice(sender) {
  var ClonedElement = sender.parentElement.parentElement.cloneNode(true);
	for (i = 0; i < ClonedElement.children.length; i++) {
		ClonedElement.children[i].value = "";
	}
   var EventItemsDiv = sender.parentElement.parentElement.parentElement;
   EventItemsDiv.insertBefore(ClonedElement, sender.parentElement.parentElement.nextSibling);
}

function RemoveAnswerChoice(sender) {
    if (sender.parentElement.parentElement.parentElement.childElementCount > 2)
    {
        sender.parentElement.parentElement.remove();
    }
}