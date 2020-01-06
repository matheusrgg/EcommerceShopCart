//fazer o select de um monte de coisa
//variaveis


const cartBtn = document.querySelector(".cart-btn")
const closeCartBtn = document.querySelector(".close-cart")
const clearCartBtn = document.querySelector(".clear-cart")
const cartDOM = document.querySelector(".cart")
const cartOverlay = document.querySelector(".cart-overlay")
const cartItems = document.querySelector(".cart-items")
const cartTotal = document.querySelector(".cart-total")
const cartContent = document.querySelector(".cart-content")
const productDOM = document.querySelector(".products-center")




//cart variable
let cart = []

//buttons
let buttonsDOM = []

//getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch("products.json")
            //getting data in json format
            let data = await result.json()
            //  return result
            // return data
            let products = data.items
            products = products.map(item => {
                const {
                    title,
                    price
                } = item.fields
                const {
                    id
                } = item.sys
                const image = item.fields.image.fields.file.url
                return {
                    title,
                    price,
                    id,
                    image
                }
            })

            return products
        } catch (error) {
            console.log(error)
        }
    }

}

//display products
class UI {
    //most of the methods 
    //everything thats going to be displayed on the screen
    //much bigger


    displayProducts(products) {
        // console.log(products)
        let result = '';
        products.forEach(product => {
            result += `    
            
            <!--single content-->
            <article class="product">

                <div class="img-container">
                    <img src=${product.image} alt="" class="product-img">
                    <button class="bag-btn"data-id=${product.id}>

                    <i class="fa fa-shopping-cart">Add to the bag</i>

                    </button>
                </div>

                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>

            <!--endsinglecontent-->
            
        `
        });

        productDOM.innerHTML = result
    }

    getBagButtons() {
        //select all buttons
        const buttons = [...document.querySelectorAll(".bag-btn")]
        // console.log(buttons)
        buttonsDOM = buttons
        buttons.forEach(button => {
            let id = button.dataset.id
            // console.log(id)
            let inCart = cart.find(item => item.id === id)
            if (inCart) {
                button.innerText = "In Cart"
                button.disabled = true
            }
            button.addEventListener('click', event => {
                event.target.innerText = "In Cart"
                event.target.disabled = true
                //criando alguns metodos, que vou reutilizar ao longo do projeto 
                //get product from products

                let cartItem = {
                    ...Storage.getProduct(id),
                    amount: 1
                }
                // console.log(cartItem)
                //add product to the cart
                cart = [...cart, cartItem]
                // console.log(cart)
                //save cart in local storage
                Storage.saveCart(cart)

                //set cart values
                this.setCartValues(cart)

                //display cart item
                this.addCartItem(cartItem)

                //show the cart
                this.showCart()
            })
        })
    }

    setCartValues(cart) {
        let tempTotal = 0
        let itemTotal = 0
        cart.map(item => {
            tempTotal += item.price * item.amount
            itemTotal += item.amount
        })

        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemTotal
        // console.log(cartTotal, cartItems)
    }

    // Tutorial video Minuto 2-29 - ele clicou atë aqui e aumentou o bagulho
    addCartItem(item) {
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML = `
            <img src=${item.image} alt="">
                
            <div>
            <H4>${item.title}</H4>
            <h5>${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount" data-id=${item.amount}>1</p>
                <i class="fas fa-chevron-down" data-id=${item.id} ></i>
            </div> 
            `
        cartContent.appendChild(div)
        // console.log(cartContent)
    }

    showCart() {
        cartOverlay.classList.add("transparentBcg")
        cartDOM.classList.add("showCart")
    }

    setupAPP() {
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.populateCart(cart)
        cartBtn.addEventListener("click", this.showCart)
        closeCartBtn.addEventListener("click", this.hideCart)

    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item))
    }

    hideCart() {
        cartOverlay.classList.remove("transparentBcg")
        cartDOM.classList.remove("showCart")
    }

    // cartLogic() {
    //     // clear cart button
    //     clearCartBtn.addEventListener('click', () => {
    //         this.clearCart()
    //     })
    // }

    // clearCart() {
    //     console.log(this)
    //     let cartItems = cart
    // }


}



class Storage {
    //local storage
    //outro metodo setItem , slavar como um string nào array   
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }

    static getProduct(id) {
        //isso vai retornar a array que eu tenho no local Storage
        let products = JSON.parse(localStorage.getItem("products"))

        return products.find(product => product.id === id)
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart))
    }

    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const ui = new UI()
    const products = new Products()

    //setup app (isso è um metodo) e cart è uma array   
    // ui.setupAPP()


    //get all products
    //getProducts è o nosso method
    //.then pega o produto
    // ai a gente display o produto

    ui.setupAPP()

    

    products.getProducts().then(products => {
        ui.displayProducts(products) /*console.log(products))*/
        Storage.saveProducts(products)
    }).then(() => {
        ui.getBagButtons()
    })

})