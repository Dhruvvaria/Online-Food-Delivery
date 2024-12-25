(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  document.addEventListener("DOMContentLoaded", function() {
    if (document.querySelector('.flash-msg')) {
        document.querySelector('.container').classList.add('background-blur');
        document.querySelector('nav').classList.add('background-blur');
        document.querySelector('.footer').classList.add('background-blur');
        
        document.querySelector('.btn-close').addEventListener('click', function() {
            document.querySelector('.container').classList.remove('background-blur');
            document.querySelector('nav').classList.remove('background-blur');
            document.querySelector('.footer').classList.remove('background-blur');
        });
    }
});



// Cart 

  const qnt = document.querySelectorAll(".cartQuantity");
  qnt.forEach(input => {
    input.addEventListener("input", (event) => {
      const quantity = event.target.value; 
      const basePrice = event.target.getAttribute("data-base-price"); 
      const totalPrice = quantity * basePrice;
      const dishPriceElement = event.target.closest("tr").querySelector(".dishPrice");
      dishPriceElement.innerHTML = totalPrice.toFixed(2); 
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const updateCartTotals = () => {
      let totalPrice = 0;
      let totalQuantity = 0;
  
      const quantityInputs = document.querySelectorAll(".cartQuantity");
  
      quantityInputs.forEach(input => {
        const quantity = parseInt(input.value, 10); 
        const basePrice = parseFloat(input.getAttribute("data-base-price")); 
        if (!isNaN(quantity) && !isNaN(basePrice)) {
          const itemTotal = quantity * basePrice; 
          totalPrice += itemTotal; 
          totalQuantity += quantity; 
          const dishPriceElement = input.closest("tr").querySelector(".dishPrice");
          if (dishPriceElement) {
            dishPriceElement.innerHTML = itemTotal.toFixed(2); 
          }
        }
      });
  
      const finalPriceElement = document.querySelector(".finalPrice");
      if (finalPriceElement) {
        finalPriceElement.innerHTML = totalPrice.toFixed(2); 
      }
  
      const totalItems = document.querySelector(".totalItems");
      if (totalItems) {
        totalItems.innerHTML = totalQuantity; 
      }
    };
  
    const quantityInputs = document.querySelectorAll(".cartQuantity");
    quantityInputs.forEach(input => {
      input.addEventListener("input", updateCartTotals);
    });
  
    updateCartTotals();
  });
  
  







