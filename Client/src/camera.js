
export class Camera {

    //////////////////////////////////////
    // Public Class methods
    //////////////////////////////////////
    constructor(draw_div_id, title, url) { 
        this.draw_div_id = draw_div_id;
        this.title = title;
        this.url = url;

        this.docElem = document.getElementById(draw_div_id);

        this.docElem.innerHTML = "<img class=\"camera\" src=\""+ this.url +"\" alt=\"Could not connect to camera!\">"

        this.docElem.setAttribute("data-tooltip", this.title);

    }

  }