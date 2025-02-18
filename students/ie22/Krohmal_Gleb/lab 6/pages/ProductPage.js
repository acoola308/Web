import { Product } from "../components/Product.js"
import { BackButton } from "../components/BackButton.js"
import { HomePage } from "./HomePage.js"
import {ajax} from "../modules/ajax.js";
import {urls} from "../modules/urls.js";

export class ProductPage {
    constructor(parent, cardId) {
        this.parent = parent
        this.cardId = cardId
        this.data = {}
    }

    async getData() {
        // return {
        //     id: this.card.id,
        //     src: this.card.src,
        //     title: this.card.title,
        //     text: this.card.text
        // }
        return await ajax.get(urls.getStockById(this.cardId))
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    renderData(item) {
        const product = new Product(this.pageRoot)
        product.render(item)
    }

    getHTML() {
        return (
            `
                <div id="product-page"></div>
            `
        )
    }

    clickBack() {
        const homePage = new HomePage(this.parent)
        homePage.render()
    }

    async render() {
        this.parent.innerHTML = ''
        this.data = await this.getData()
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        this.renderData(this.data)
        const backButton = new BackButton(this.pageRoot)
        backButton.addListeners(this.clickBack.bind(this))

        // const data = this.getData()
        // const stock = new Product(this.pageRoot)
        // stock.render(data)
    
    }
}