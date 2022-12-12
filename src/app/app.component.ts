import { Component, ElementRef, ViewChild } from '@angular/core';
import { ImageModel } from './model/image.model';
import { TractImageAnnotation } from './model/tract-image-annotation.model';
const ImageData = [
  {
    id: 1,
    url: "https://preview.ibb.co/jrsA6R/img12.jpg",
    label: "Label 1",
    caption: " Comment1"
  },
  {
    id: 2,
    url: "https://preview.ibb.co/jrsA6R/img12.jpg",
    label: "Label 2",
    caption: "Comment 2"
  },
  {
    id: 3,
    url: "https://preview.ibb.co/jrsA6R/img12.jpg",
    label: "Label 3",
    caption: "Comment 3"
  }
]
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';
  imagesList: ImageModel[] = [];
  tempImagesList: ImageModel[] = [];
  tractImageWidth: number = 33.33;
  canvasimage = new Image();
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  dragStartIndex: number;
  tractAnnotations: TractImageAnnotation[] = [];

  ngOnInit(): void {
    this.imagesList = ImageData;
    this.tempImagesList = this.imagesList;
    this.canvasimage.addEventListener ("load", () => { 
      this.canvas = document.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.ctx.drawImage(this.canvasimage, 0, 0, this.canvas.width, this.canvas.height);
    });
    this.canvasimage.src = "https://neuroscientificallychallenged.com/files/images/anterior-corticospinal-tract.jpg";
  }

  onDragStart(event: DragEvent, i) { 
    this.dragStartIndex = i; 
    var img = document.createElement("img");
    img.src = "";
    event.dataTransfer.setDragImage(img, 0, 0);
  }
  onDragOver(event){ event.preventDefault(); }
  onDragEnd(event: DragEvent){
    if(this.dragStartIndex != null ){
      var posX = event.offsetX;
      var posY = event.offsetY;
      let color = "";
      //this.ctx = this.canvas.getContext('2d');

      //check if Item Available with same id
      let prevItem = this.tractAnnotations.find( x => x.imageId == this.imagesList[this.dragStartIndex].id);
      if(prevItem != null)[
        color = prevItem.color
      ]
      else {
        color = this.getRandomColor();
      }

      this.ctx.fillStyle = color;
      this.ctx.fillRect(posX, posY, 20, 20);
      this.ctx.fillStyle = "white";
      this.ctx.font = '20px serif';
      let imgIndex = this.dragStartIndex + 1;
      this.ctx.fillText(imgIndex.toString(), posX + 5, posY+16);
      this.ctx.stroke();
  
      let annotation = new TractImageAnnotation();
      annotation.posX = posX;
      annotation.posY = posY;
      annotation.imageId = this.imagesList[this.dragStartIndex].id;
      annotation.color = color;
      this.tractAnnotations.push(annotation);

      this.dragStartIndex = null;
    }
  }

  clearCanvas(){ 
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.canvasimage, 0, 0, this.canvas.width, this.canvas.height); 
    this.tractAnnotations = [];
  }
  
  reDrawAnnotations()
  { 
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.canvasimage, 0, 0, this.canvas.width, this.canvas.height);    
    //this.ctx = this.canvas.getContext('2d');
    this.tractAnnotations.forEach( item => {
      console.log(item.imageId);
      this.ctx.fillStyle = item.color;
      this.ctx.fillRect(item.posX, item.posY, 20, 20);
      this.ctx.fillStyle = "white";
      this.ctx.font = '20px serif';
      let imgIndex = this.imagesList.findIndex( x => x.id == item.imageId) + 1;
      this.ctx.fillText(imgIndex.toString(), item.posX + 5, item.posY+16);
      this.ctx.stroke();
    });
  }

  deleteImage(id: number){
    let imageIndex = this.imagesList.findIndex( x => x.id == id);
    let removeId = this.imagesList[imageIndex].id;
    this.imagesList.splice(imageIndex, 1);  
    for( var i = this.tractAnnotations.length -1; i >= 0; i--)
    {
      if(this.tractAnnotations[i].imageId == removeId )
      {
        this.tractAnnotations.splice(i, 1);         
      }
    }

    this.reDrawAnnotations();
  }
  

  getRandomColor() {
    let color = "#";
    let letters = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
