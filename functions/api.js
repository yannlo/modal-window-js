/**
 * 
 * @param {string} url 
 * @returns {HTMLElement}
 */
export async function loadModal(url) {
        const id = url.split('#')[1];
        const r = await fetch(url)
        if(r.ok){
            const html= await r.text()
            const modal = document
                .createRange()
                .createContextualFragment(html)
                .getElementById(id)
                .cloneNode(true);
                document.body.append(modal)
                return modal;
        }

    }u