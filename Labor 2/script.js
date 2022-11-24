const inputImage = document.getElementById("inputImage");
const image = new Image();
const canvas = document.getElementById('displayImage');
const ctx = canvas.getContext('2d');
let defaultImageData;

function setImage(input) {
  console.log(input)
  if (input.files && input.files[0] && canvas) {
    var reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;
      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.style.width = image.width + 'px';
        canvas.style.height = image.height + 'px';
        if (ctx !== undefined) {
          console.log(ctx)
          ctx.drawImage(image, 0, 0, image.width, image.height);
          defaultImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
      }
    }
    reader.readAsDataURL(input.files[0]);
  }
}

function addFilter(filterName) {
  if (ctx !== undefined) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    switch (filterName) {
      case "default":
        ctx.putImageData(defaultImageData, 0, 0);
        break;
      case "grayscale":
        for (let i = 0; i < defaultImageData.data.length; i += 4) {
          const avg = (defaultImageData.data[i] + defaultImageData.data[i + 1] + defaultImageData.data[i + 2]) / 3;
          imageData.data[i] = avg;
          imageData.data[i + 1] = avg;
          imageData.data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
        break;
      case "inverted":
        for (let i = 0; i < defaultImageData.data.length; i += 4) {
          imageData.data[i] = 255 - defaultImageData.data[i];
          imageData.data[i + 1] = 255 - defaultImageData.data[i + 1];
          imageData.data[i + 2] = 255 - defaultImageData.data[i + 2];
        }
        ctx.putImageData(imageData, 0, 0);
      break;
      case "sepia":
        for (let i = 0; i < defaultImageData.data.length; i += 4) {
          const r = defaultImageData.data[i];
          const g = defaultImageData.data[i + 1];
          const b = defaultImageData.data[i + 2];
          imageData.data[i] = Math.min(Math.round((r * 0.393) + (g * 0.769) + (b * 0.189)), 255);
          imageData.data[i + 1] = Math.min(Math.round((r * 0.349) + (g * 0.686) + (b * 0.168)), 255);
          imageData.data[i + 2] = Math.min(Math.round((r * 0.272) + (g * 0.534) + (b * 0.131)), 255);
        }
        ctx.putImageData(imageData, 0, 0);
      break;
      default:
        ctx.putImageData(defaultImageData, 0, 0);
        break;
    }
  }
}