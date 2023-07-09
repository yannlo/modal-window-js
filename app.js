import { loadModal } from "./functions/api.js";

class Modal {

    /** @type {HTMLElement} */
    #link

    /** @type {HTMLElement} */
    #modal

    /** @type {HTMLElement[]} */
    #focusables = [];


    /** @type {boolean} */
    static ONCE_IS_OPEN = false;

    /** @type {HTMLElement|null} */
    static PREV_FOCUSED = null;

    /**
     * 
     * @param {HTMLElement} link 
     * @param {HTMLElement|null} modal 
     */
    constructor(link, modal = null){
        this.#link = link;
        this.#modal = modal;

        this.#focusables = Array.from( 
            this.#modal
            .querySelectorAll(
                this.#modal.dataset.focusables
            )
        )
        this.#link.addEventListener('click', (e) => this.#openModal(e))

        this.#modal.addEventListener('click', (e) => this.#closeModal(e))
        this.#modal
            .querySelector('.js-close-modal')
            .addEventListener('click', (e) => this.#closeModal(e))
        
        this.#modal
            .querySelector('.modal-wrapper')
            .addEventListener('click', (e) => e.stopPropagation())

        window.addEventListener('keydown', (e) => {
            if (['Escape', 'Esc'].includes(e.key)){
                this.#closeModal(e);
            }
            if(e.key === 'Tab' && Modal.ONCE_IS_OPEN){
                this.#focusInModal(e)
            }
        })
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    #focusInModal = (e) => {
        e.preventDefault(); 
        let index = this.#focusables
            .findIndex(
                elt => elt === this.#modal.querySelector(':focus')
            );
            
        index = !e.shiftKey ? ++index : --index
        
        if( index >= this.#focusables.length){
            index = 0
        }

        if( index < 0){
            index = this.#focusables.length - 1;
        }

        this.#focusables[index].focus()
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    #openModal = (e) => {
        e.preventDefault()
        if(Modal.ONCE_IS_OPEN){
            return
        }
        Modal.PREV_FOCUSED = document.querySelector(':focus');
        this.#modal.classList.remove('modal-close')
        this.#modal.setAttribute('aria-hidden', false)
        this.#modal.setAttribute('aria-modal', true)
        Modal.ONCE_IS_OPEN= true;
        this.#focusables[0].focus();
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    #closeModal = (e) => {
        e.preventDefault();
        this.#modal.classList.add('modal-animation')
        setTimeout(() => {
            this.#modal.classList.add('modal-close')
            this.#modal.classList.remove('modal-animation')
        }, 300)
        this.#modal.setAttribute('aria-hidden', true)
        this.#modal.setAttribute('aria-modal', false)
        Modal.ONCE_IS_OPEN = false;
        Modal.PREV_FOCUSED.focus();/*  */
    }


}

document.querySelectorAll('.js-modal')
    .forEach(
        async link => {
            let modal;
            const url = link.getAttribute('href');
            if(link.getAttribute('href').startsWith("#")){
                modal = document.querySelector(url)
            } else{
                modal = await loadModal(url)
            }
            new Modal(link, modal)
        }
    )