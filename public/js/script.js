function addField(addBtn) {
  let parentNode = document.querySelector('.ingredientsParent');
  let clone = parentNode.lastElementChild.cloneNode(true);
  clone.querySelector('input').value = '';

  parentNode.append(clone);

  addBtn.nextElementSibling.removeAttribute('style'); // Showing the minus sign
  addBtn.style.display = 'none'; // Hidding the plus sign
}

function removeField(minusBtn) {
  minusBtn.parentElement.remove();
}
