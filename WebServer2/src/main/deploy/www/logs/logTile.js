export class LogTile {

    constructor(drawDiv_in, name_in, size_in, path_in) { 

        this.name = name_in;
        this.size = size_in;
        this.path = path_in;
        this.drawDiv = drawDiv_in;

        this._addColumn(this.name);
        this._addColumn(this.size);
        this._addButtons(this.deleteCallback.bind(this), this.downloadCallback.bind(this));
    }

    show(){
        this.drawDiv.style.display = "block";
    }

    hide(){
        this.drawDiv.style.display = "none";
    }

    downloadCallback(){
        //TODO
    }

    deleteCallback(){
        //TODO
    }

    _addColumn(text_in){
        var new_td = document.createElement("td");
        new_td.innerHTML = text_in;
        this.drawDiv.appendChild(new_td);
        return new_td;
    }

    _addButtons(deleteCallback, downloadCallback){
        var deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.onclick = deleteCallback;
        deleteButton.innerHTML = "Delete";

        var downloadButton = document.createElement("button");
        downloadButton.setAttribute("type", "button");
        downloadButton.onclick = downloadCallback;
        downloadButton.innerHTML = "Download";

        var buttonDiv = document.createElement("div");
        var new_td = document.createElement("td");

        buttonDiv.appendChild(deleteButton);
        buttonDiv.appendChild(downloadButton);
        new_td.appendChild(buttonDiv);
        this.drawDiv.appendChild(new_td);
        return new_td;
    }

}