function addField(addBtn){
    if(addBtn.previousElementSibling.value.trim() === ""){
        return false;
    };

    let parentNode = document.querySelector(".ingredientsParent");
    let clone = parentNode.lastElementChild.cloneNode(true);

    parentNode.append(clone)

    addBtn.nextElementSibling.removeAttribute("style"); // Showing the minus sign
    addBtn.style.display = "none"; // Hidding the plus sign
};

function removeField(minusBtn){
    minusBtn.parentElement.remove();
}