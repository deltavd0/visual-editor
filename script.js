const canvas = document.getElementById("canvas");
const button = document.getElementById("addSquare");

button.addEventListener("click", () => {
  const square = document.createElement("div");
  square.classList.add("shape");

  square.style.left = "50px";
  square.style.top = "50px";

  canvas.appendChild(square);

  enableInteractions(square);
});

function enableInteractions(target) {

  interact(target)
    .draggable({
      listeners: {
        move(event) {
          const target = event.target;

          let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },

      listeners: {
        move(event) {
          let { x, y } = event.target.dataset;

          x = (parseFloat(x) || 0);
          y = (parseFloat(y) || 0);

          event.target.style.width = `${event.rect.width}px`;
          event.target.style.height = `${event.rect.height}px`;

          x += event.deltaRect.left;
          y += event.deltaRect.top;

          event.target.style.transform = `translate(${x}px, ${y}px)`;

          event.target.dataset.x = x;
          event.target.dataset.y = y;
        }
      }
    });
}